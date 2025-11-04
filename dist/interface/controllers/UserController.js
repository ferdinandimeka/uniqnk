"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const class_transformer_1 = require("class-transformer");
// import { CreateUserDto } from "../dto/UserResponseDto";
const CreateUserDto_1 = require("../dto/CreateUserDto");
const PostModel_1 = require("../../infrastructure/models/PostModel"); // adjust relative path if needed
class UserController {
    constructor(getAllUsers, createUser, getUserByid, updateUser, deleteUser) {
        this.getAllUsers = getAllUsers;
        this.createUser = createUser;
        this.getUserByid = getUserByid;
        this.updateUser = updateUser;
        this.deleteUser = deleteUser;
    }
    // private getAllUsers =  DIContainer.getGetAllUsersUseCase(); 
    async getAll(req, res, next) {
        const users = await this.getAllUsers.execute();
        res.json(users);
        next();
    }
    async create(req, res, next) {
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
            const userResponse = (0, class_transformer_1.plainToInstance)(CreateUserDto_1.UserResponseDto, user, {
                excludeExtraneousValues: true, // ensures only @Expose fields appear
            });
            // 4️⃣ Send clean, safe response
            res.status(201).json({
                message: "User created successfully",
                data: userResponse
            });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        const userId = req.params.id;
        const user = await this.updateUser.execute(userId, req.body);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
        next();
    }
    async getUserById(req, res, next) {
        try {
            const userId = req.params.id;
            const user = await this.getUserByid.execute(userId);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            const posts = await PostModel_1.PostModel.find({ user: userId })
                .populate("user", "first_name last_name avatar")
                // .populate("comments")
                .sort({ createdAt: -1 });
            // Remove the posts array from the user (to avoid duplication)
            const userObj = (user && typeof user.toObject === "function") ? user.toObject() : user;
            const { posts: _omitPosts, ...userWithoutPosts } = userObj;
            res.status(200).json({
                user: userWithoutPosts,
                posts,
            });
            next();
        }
        catch (error) {
            console.error("Error fetching user by ID:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    async delUser(req, res, next) {
        const userId = req.params.id;
        await this.deleteUser.execute(userId);
        res.status(204).send();
        next();
    }
}
exports.UserController = UserController;
