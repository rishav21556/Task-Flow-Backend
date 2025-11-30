import dataSource from "../../db/dataSource";
import { Users } from "../../entity/users.entity";
import * as bcrypt from 'bcrypt';

export class AuthService {
    private readonly userRepository;

    constructor() {
        this.userRepository = dataSource.getRepository(Users);
    }

    async registerUser(username: string, password: string): Promise<Users> {

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = this.userRepository.create({
            user_name: username,
            password: hashedPassword
        });
        return await this.userRepository.save(newUser);
    }

    async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

}