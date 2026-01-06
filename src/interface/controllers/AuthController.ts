import { LoginUser } from './../../use-cases/auth/signIn';
import { SignUpUser } from './../../use-cases/auth/signUp';
import { VerifyPassword } from './../../use-cases/auth/verifyPassword';
import { ApiResponse } from "../../utils/apiResponse";
import { NextFunction, Request, Response } from 'express'

export class AuthController{
    constructor(private loginUser: LoginUser, private signUpUser: SignUpUser,
        private passwordVerify: VerifyPassword
    ) {}

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;
            const result = await this.loginUser.execute(email, password);
            res.status(200).json(
                new ApiResponse(200, result, "User logged in successfully")
            );
        } catch (error) {
            next(error);
        }
    }

    async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { fullName, username, email, phone, password } = req.body;
            const result = await this.signUpUser.execute(fullName, username, email, phone, password);
            res.status(201).json(
                new ApiResponse(201, result, "User signed up successfully")
            );
        } catch (error) {
            next(error);
        }
    }

    async verifyPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;
            const isValid = await this.passwordVerify.execute(email, password);
            res.status(200).json(
                new ApiResponse(200, { isValid }, "Password verification successful")
            );
        } catch (error) {
            next(error);
        }
    }
}