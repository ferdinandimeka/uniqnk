import { CreateUser } from './../../use-cases/user/createUsers';
import { UpdateUser } from './../../use-cases/user/updateUser';
import { GetUserById } from './../../use-cases/user/getUserById';
import { NextFunction, Request, Response } from 'express'
// import { DIContainer } from '../../infrastructure/DIContainer';
import { GetAllUsers } from '../../use-cases/user/getAllUsers';
import { DeleteUser } from '../../use-cases/user/deleteUser';
import { CreateUserDto } from '../dto/CreateUserDto';
import { validate } from 'class-validator';

export class UserController {
    constructor(private getAllUsers: GetAllUsers, private createUser: CreateUser, private getUserByid: GetUserById, private updateUser: UpdateUser, private deleteUser: DeleteUser) {}
    // private getAllUsers =  DIContainer.getGetAllUsersUseCase(); 

    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        const users = await this.getAllUsers.execute();
        res.json(users);
        next();
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        // Validate the request body
        const dto = Object.assign(new CreateUserDto(), req.body);
        const errors = await validate(dto);

        if (errors.length > 0) {
            res.status(400).json({ errors })
        }

        const user = await this.createUser.execute(dto);
        res.status(201).json(user);
        next();
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
        const userId = req.params.id;
        const user = await this.getUserByid.execute(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.json(user);
        }
        next();
    }

    async delUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId = req.params.id;
        await this.deleteUser.execute(userId);
        res.status(204).send();
        next();
    }
}