import { Auth } from "typeorm";
import { AuthService } from "./auth.service";
import Router from "express";
import { Request, Response } from "express";
import dataSource from "../../db/dataSource";
import { Users } from "../../entity/users.entity";


const authService = new AuthService();
const userRepository = dataSource.getRepository(Users);
const router = Router();

router.post('/', async (req: Request, res: Response)=> {
    const data = req.body;

    if (!data) {
        return res.status(400).json({ message: "No data provided" });
    }

    // verify data and call service methods here
    // data must contain necessary auth info like username and password
    if (!data.username || !data.password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // username must not be empty string and it must be unique
    if (data.username.trim() === "") {
        return res.status(400).json({ message: "Username cannot be empty" });
    }
    const existingUser = await userRepository.findOne({
        where: { user_name: data.username }
    });

    if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
    }

    // password must be at least 6 characters long
    if (data.password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    await authService.registerUser(data.username, data.password);
    res.status(201).json({ message: "User registered successfully" });
})

export default router;