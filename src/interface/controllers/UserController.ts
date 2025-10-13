import { CreateUser } from './../../use-cases/user/createUsers';
import { UpdateUser } from './../../use-cases/user/updateUser';
import { GetUserById } from './../../use-cases/user/getUserById';
import { NextFunction, Request, Response } from 'express'
// import { DIContainer } from '../../infrastructure/DIContainer';
import { GetAllUsers } from '../../use-cases/user/getAllUsers';
import { DeleteUser } from '../../use-cases/user/deleteUser';
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
// import { CreateUserDto } from "../dto/UserResponseDto";
import { UserResponseDto } from "../dto/CreateUserDto";
import { PostModel } from "../../infrastructure/models/PostModel"; // adjust relative path if needed

export class UserController {
    constructor(private getAllUsers: GetAllUsers, private createUser: CreateUser, private getUserByid: GetUserById, private updateUser: UpdateUser, private deleteUser: DeleteUser) {}
    // private getAllUsers =  DIContainer.getGetAllUsersUseCase(); 

    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        const users = await this.getAllUsers.execute();
        res.json(users);
        next();
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // // 1️⃣ Validate input
            // const dto = Object.assign(new CreateUserDto(), req.body);
            // const errors = await validate(dto);

            // if (errors.length > 0) {
            //     const validationErrors = errors.map(err => ({
            //         property: err.property,
            //         constraints: err.constraints
            //     }));
            //     res.status(400).json({
            //         message: "Validation failed",
            //         errors: validationErrors
            //     });
            //     return;
            // }

            // 2️⃣ Create user (use-case returns a Mongoose doc or plain object)
            const user = await this.createUser.execute(req.body, req.params.id);

            // 3️⃣ Transform response using class-transformer
            const userResponse = plainToInstance(UserResponseDto, user, {
                excludeExtraneousValues: true, // ensures only @Expose fields appear
            });

            // 4️⃣ Send clean, safe response
            res.status(201).json({
                message: "User created successfully",
                data: userResponse
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId = req.params.id;
        const user = await this.updateUser.execute(userId, req.body);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
        next();
    }

    async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.id;

            const user = await this.getUserByid.execute(userId);
            if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
            }

            const posts = await PostModel.find({ user: userId })
            .populate("user", "first_name last_name avatar")
            // .populate("comments")
            .sort({ createdAt: -1 });

            // Remove the posts array from the user (to avoid duplication)
            const userObj = (user && typeof (user as any).toObject === "function") ? (user as any).toObject() : user;
            const { posts: _omitPosts, ...userWithoutPosts } = userObj;

            res.status(200).json({
            user: userWithoutPosts,
            posts,
            });

            next();
        } catch (error) {
            console.error("Error fetching user by ID:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }


    async delUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId = req.params.id;
        await this.deleteUser.execute(userId);
        res.status(204).send();
        next();
    }
}