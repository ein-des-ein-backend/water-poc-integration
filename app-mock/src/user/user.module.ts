import { Module } from "@nestjs/common";
import { UserController } from './user.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from './user.entity';
import { UserService } from "./user.service";
import { CoreModule } from "../core/core.module";
import { UserSapController } from "./user.sap-controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        CoreModule
    ],
    providers: [UserService],
    controllers: [UserController, UserSapController],
    exports: []
})
export class UserModule {}