import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export enum Roles {
  ADMIN = 'admin',
  USER = 'user'
}


export class SignupDto {
  @IsString()
  @Length(2, 50) 
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 20)
  password: string;
}

export class LoginDto {

  @IsEmail()
  // @ApiProperty({ example: 'strangerthings369369@gmail.com' })
  email: string;

  @IsNotEmpty()
  // @ApiProperty({ example: '123456' })
  password: string;
}

export class OTPVerifyDto {

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  otp: string;
}




export class ForgotPasswordDto {

  @IsString()
  otp: string;

  @IsString()
  password: string;

  @IsString()
  @IsEmail()
  email: string
}



export class EmailDto {
    @ApiProperty()
    @IsString()
    email:string
}