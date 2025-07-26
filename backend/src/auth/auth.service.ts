import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { LoginDto, Roles, SignupDto } from './dto/auth.dto';
import { RefreshToken } from '../schemas/refreshToken.schema';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../common/services/email.service';

@Injectable()
export class AuthService {
  private otpStore = new Map();
  constructor(
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private configService: ConfigService,
    @InjectModel(RefreshToken.name)
    private refreshTokenRepository: Model<RefreshToken>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async signup(signupDto: SignupDto, req: any) {
    try {
      const origin = req.origin;
      const existingUser = await this.userModel.findOne({
        email: signupDto?.email,
      });

      if (existingUser) {
        if (existingUser.verified) {
          throw new BadRequestException('Email is already registered.');
        } else {
          await this.userModel.deleteOne({ email: signupDto?.email });
        }
      }
      const hashedPassword = await argon2.hash(signupDto.password, {
        timeCost: 10,
      });

      const newUser = await this.userModel.create({
        ...signupDto,
        password: hashedPassword,
      });

      // You can send email here if needed

      const token = await this.getTokens(
        newUser._id,
        newUser.name,
        newUser.role,
      );

      return {
        status: 'success',
        message: 'Signed up successfully',
        // token: token,
      };
    } catch (error) {
      console.error('Signup error:', error);
      throw new BadRequestException('Signup failed: ' + error.message);
    }
  }

  async getTokens(userId: string, name: string, role: any) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId.toString(),
          name,
          role,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '1d',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId.toString(),
          name,
          role,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '30d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async getUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).select('-password');
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    try {
      const payload = this.jwtService.verify(token);

      const user = await this.userModel.findOne({ email: payload.email });
      if (!user) {
        throw new BadRequestException('User not found.');
      }

      if (user.verified) {
        throw new BadRequestException('User already verified.');
      }

      // ✅ Mark User as Verified
      user.verified = true;
      await user.save();

      return { message: 'Email verified successfully. You can now log in.' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired token.');
    }
  }

  async login(loginDto: LoginDto, req: any) {
    try {
      const origin = req.headers.origin;

      const user = await this.userModel.findOne({ email: loginDto.email });
      if (!user) {
        throw new UnauthorizedException('User not found.');
      }

      if (!user.verified) {
        throw new UnauthorizedException('Please verify your email first.');
      }
      if (user && user.isActive == false) {
        throw new BadRequestException('Inactive User');
      }

      if (user.role === Roles.ADMIN) {
        // if ("add domain" !== origin) throw new BadRequestException('Domain not matched')
      } else {
        // if ("add domain" !== origin) throw new BadRequestException('Domain not matched')
      }
      const passwordMatches = await argon2.verify(
        user.password,
        loginDto.password,
      );
      if (!passwordMatches) {
        throw new BadRequestException('Password is incorrect');
      }
      const tokens = await this.getTokens(user._id, user.name, user?.role);
      await this.updateRefreshToken(user._id, tokens.refreshToken);

      const accessToken = tokens.accessToken;
      const refreshToken = tokens.refreshToken;

      // Do not return the hashed password
      delete user.password;

      return {
        status: 'success',
        user,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    try {
      const currentUserToken = await this.refreshTokenRepository.findOne({
        userId: new Types.ObjectId(userId),
        active: true,
      });

      if (currentUserToken) {
        currentUserToken.active = false;
        await currentUserToken.save();
      }

      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 30);

      const hashedRefreshToken = await this.hashData(refreshToken);
      const createdRefresh = await this.refreshTokenRepository.create({
        userId,
        refreshToken: hashedRefreshToken,
        expiresIn: currentDate,
      });

      await createdRefresh.save();
    } catch (error) {
      throw error;
    }
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    try {
      const user = await this.userModel.findById(userId);
      const userRefreshtoken = await this.refreshTokenRepository.findOne({
        userId: new Types.ObjectId(userId),
        active: true,
      });
      if (!user || !userRefreshtoken)
        throw new ForbiddenException('Access Denied');
      const refreshTokenMatches = await argon2.verify(
        userRefreshtoken.refreshToken,
        refreshToken,
      );

      if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
      const tokens = await this.getTokens(user._id, user.name, user.role);
      // await this.updateRefreshToken(user._id, tokens.refreshToken);
      delete tokens.refreshToken;
      return tokens;
    } catch (error) {
      throw error;
    }
  }

  async init(userId: string) {
    const user = await this.userModel.findById(userId);
    user.password = undefined;
    return {
      user,
    };
  }

  async verifyOtp(email: string, otp: string) {
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isOtpValid = await argon2.verify(user.otp, otp);

    if (!isOtpValid) {
      // Handle the case where the OTP is invalid
      throw new BadRequestException('Invalid OTP');
    }
    return {
      status: 'success',
      message: 'OTP verified',
    };
  }

  async resetPassword(otp: string, password: string, email: string) {
    try {
      if (!otp || !password || !email) {
        throw new BadRequestException('OTP, newPassword, or email is missing.');
      }
      const user = await this.userModel.findOne({ email: email });

      if (!user || !otp) {
        throw new NotFoundException('Resend Otp');
      }

      // Verify OTP
      const validate = await argon2.verify(user.otp, otp);

      if (!user.otp || !validate) {
        throw new BadRequestException('Invalid OTP');
      }
      const hashedPassword = await argon2.hash(password, { timeCost: 12 });
      user.password = hashedPassword;
      user.otp = null;
      console.log(user);
      const id = user._id;
      const updatedUser = this.userModel.findOneAndUpdate({ _id: id }, user);
      return { message: 'Password changed successfully' };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async logout(userId: string) {
    try {
      const currentUserToken = await this.refreshTokenRepository
        .findOne({
          userId: new Types.ObjectId(userId),
          active: true,
        })
        .exec();

      if (currentUserToken) {
        ((currentUserToken.active = false), await currentUserToken.save());
        return {
          status: 'success',
        };
      } else {
        throw new Error('Refresh token not found');
      }
    } catch (error) {
      throw new Error('Logout failed: ' + error.message);
    }
  }

  async sendOtp(email: string) {
    const users = await this.userModel.findOne({ email: email });
    if (!users) {
      throw new NotFoundException('User not found');
    }
    let otp;
    // Generate OTP
    otp = this.generateOTP();

    // Send OTP via email
    await this.emailService.requestPasswordReset(email, otp);
    // Hash OTP
    const hashOtp = await this.hashData(otp);

    // Update user with hashed OTP
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const id = user._id;
    user.verified = true;
  await user.save();
    await this.userModel
      .findOneAndUpdate({ _id: new Types.ObjectId(id) }, { otp: hashOtp })
      .exec();

    return {
      status: 'success',
      message: 'Otp send successfully',
    };
  }

  generateOTP() {
    // Generate a random 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
