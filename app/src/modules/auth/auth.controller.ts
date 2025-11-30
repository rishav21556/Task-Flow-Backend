import { Auth } from "typeorm";
import { AuthService } from "./auth.service";
import Router from "express";


const authService = new AuthService();
const router = Router();

router.get('/', (req, res)=> {
    
})

export default router;