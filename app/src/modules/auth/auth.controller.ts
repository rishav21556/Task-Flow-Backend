import { Auth } from "typeorm";
import { AuthService } from "./auth.service";
import Router from "express";
import { Request, Response } from "express";
import dataSource from "../../db/dataSource";
import { Users } from "../../entity/users.entity";
const jwt = require('jsonwebtoken');


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

router.post('/login', async (req: Request, res: Response) => {
    const data = req.body;
    if (!data) {
        return res.status(400).json({ message: "No data provided" });
    }
    if (!data.username || !data.password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    // check if the user exists
    const user = await userRepository.findOne({
        where: { user_name: data.username }
    });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    // verify password
    const isPasswordValid = await authService.verifyPassword(data.password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        return res.status(500).json({ message: "JWT secret not configured" });
    }

    try {
        // require here to avoid changing top-level imports in the snippet
        const payload = { id: (user as any).user_id, username: (user as any).user_name };
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
    } catch (err) {
        return res.status(500).json({ message: "Failed to generate token" });
    }
    res.status(200).json({ message: "Login successful" });
});

router.post('/logout', (req: Request, res: Response) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    });
    res.status(200).json({ message: "Logout successful" });
});

router.get('/auth-verify', async (req: Request, res: Response) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const jwtSecret = process.env.JWT_SECRET
        if (!jwtSecret) {
            return res.status(500).json({ message: 'JWT secret not configured' });
        }
        const decoded = jwt.verify(token, jwtSecret);
        const user = await userRepository.findOne({ where: { user_id: (decoded as any).id } }); 
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        res.status(200).json({ user: { id: user.user_id, username: user.user_name } });
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
});

export default router;