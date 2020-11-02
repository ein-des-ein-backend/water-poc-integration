import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from './user.entity';
import { Repository, Not } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { SapUserDto } from "./dto/sap-user.dto";
import { BusinessValidationException } from "src/core/business-validation.exception";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    public findAll(): Promise<User[]> {
        return this.userRepository.find();
      }
    
    public findOne(id: string): Promise<User> {
        return this.userRepository.findOne(id);
    }

    public createOne(dto: CreateUserDto): Promise<User> {
        const user: User = new User(dto);
        return this.userRepository.save(user);
    }

    public async createOneFromSap(dto: SapUserDto): Promise<User> {
        const foundUser = await this.userRepository.findOne({ email: dto.email });
        if (foundUser) {
            throw new BusinessValidationException([{ message: 'User with provided email already exist', field: 'email' }]);
        }

        const user: User = new User(dto);
        return this.userRepository.save(user);
    }

    public async updateOne(id: number, dto: UpdateUserDto): Promise<User> {
        let user: User = await this.userRepository.findOne(id);
        if (!user) {
            throw new NotFoundException('USER_NOT_FOUND');
        }
        user = { ...user, ...dto };

        return this.userRepository.save(user);
    }

    public async updateOneFromSap(dto: SapUserDto): Promise<User> {
        let user: User = await this.userRepository.findOne({ integrationId: dto.integrationId });
        if (!user) {
            throw new NotFoundException('USER_NOT_FOUND');
        }

        const foundUser = await this.userRepository.findOne({ email: dto.email, integrationId: Not(dto.integrationId) });
        if (foundUser) {
            throw new BusinessValidationException([{ message: 'User with provided email already exist', field: 'email' }]);
        }

        user = { ...user, ...dto };

        return this.userRepository.save(user);
    }

    public async removeOne(id: number): Promise<User> {
        const user: User = await this.userRepository.findOne(id);
        if (!user) {
            throw new NotFoundException('USER_NOT_FOUND');
        } 
        await this.userRepository.delete(id);
        return user;
    }

    public async removeOneFromSap(integrationId: string): Promise<User> {
        const user: User = await this.userRepository.findOne({ integrationId });
        if (!user) {
            throw new NotFoundException('USER_NOT_FOUND');
        } 
        await this.userRepository.delete({ integrationId });
        return user;
    }

    public async deleteAll(): Promise<void> {
        await this.userRepository.delete({});
    }
}