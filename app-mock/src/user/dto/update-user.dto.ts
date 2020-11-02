import { IsString, IsInt, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {

    @IsString()
    @IsOptional()
    firstName: string;
  
    @IsString()
    @IsOptional()
    lastName: string;
  
    @IsInt()
    @IsOptional()
    age: number;
  
    @IsEmail()
    @IsOptional()
    email: string;

}