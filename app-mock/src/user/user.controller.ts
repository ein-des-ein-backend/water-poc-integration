import { Controller, Get, Post, Put, Delete, Param, Body } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SapMessageService } from "src/core/sap-message.service";
import { AppEvents } from "../core/app-events.enum";
import { SapUserDto } from "./dto/sap-user.dto";

@Controller('users')
export class UserController {

    constructor(
        private readonly userService: UserService,
        private readonly sapMessageService: SapMessageService
    ) {}

    @Get()
    public findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    public findOne(@Param('id') id: string): Promise<User | null> {
        return this.userService.findOne(id);
    }

    @Post()
    public async createOne(@Body() dto: CreateUserDto): Promise<User> {
        const user: User = await this.userService.createOne(dto);
        this.sapMessageService.publishEvent(AppEvents.CREATED_USER, new SapUserDto(user));
        return user;
    }

    @Put(':id')
    public async updateOne(@Param('id') id: number, @Body() dto: UpdateUserDto): Promise<User> {
        const user: User = await this.userService.updateOne(id, dto);
        this.sapMessageService.publishEvent(AppEvents.UPDATED_USER, new SapUserDto(user));
        return user;
    }

    @Delete(':id')
    public async deleteOne(@Param('id') id: number): Promise<User> {
        const user: User = await this.userService.removeOne(id);
        this.sapMessageService.publishEvent(AppEvents.DELETED_USER, new SapUserDto(user));
        return user;
    }

    @Delete()
    public async deleteAll(): Promise<void> {
        await this.userService.deleteAll();
    }
}