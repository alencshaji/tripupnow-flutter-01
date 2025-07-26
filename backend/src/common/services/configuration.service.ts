import {
    Global,
    Injectable,
    Logger,
    Module,
    OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as argon2 from 'argon2';
import { User, UserSchema } from '../../schemas/user.schema';


@Injectable()
export class ConfigurationService implements OnApplicationBootstrap {
    private logger = new Logger(ConfigurationService.name);
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
    ) { }

    async onApplicationBootstrap() {
        
    }






}

@Global()
@Module({
    providers: [ConfigurationService],
    exports: [ConfigurationService],
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
        ]),
    ],
})
export class ConfigurationModule { }

