import { IsString, IsInt, IsUUID, IsEmail } from 'class-validator';
import { User } from '../user.entity';

export class SapUserDto {

    @IsString()
    firstName: string;
  
    @IsString()
    lastName: string;
  
    @IsInt()
    age: number;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsUUID()
    integrationId: string;

    constructor(user?: User) {
        if (user) {
            this.firstName = user.firstName;
            this.lastName = user.lastName;
            this.age = user.age;
            this.email = user.email;
            this.password = user.password;
            this.integrationId = user.integrationId;
        }
        
    }
}