import { IsString, IsInt, IsEmail } from 'class-validator';

export class CreateUserDto {

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
  

}