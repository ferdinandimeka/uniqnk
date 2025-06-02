import { Router } from "express"
import { MongoUserRepository } from "../../infrastructure/repositories/MongoUserRepository" 
// import { InMemoryUserRepository } from "../../infrastructure/repositories/InMemoryUserRepository" 
import { GetAllUsers } from "../../use-cases/user/getAllUsers"
import { UserController } from "../controllers/UserController"
import { CreateUser } from "../../use-cases/user/createUsers"
import { UpdateUser } from "../../use-cases/user/updateUser"
import { DeleteUser } from "../../use-cases/user/deleteUser"
import { GetUserById } from "../../use-cases/user/getUserById"
// import { authenticateToken } from "../middleware/auth";

const router = Router();

const userRepository = new MongoUserRepository();
const getAllUsers = new GetAllUsers(userRepository);
const createUser = new CreateUser(userRepository);
const getUserById = new GetUserById(userRepository);
const updateUser = new UpdateUser(userRepository);
const deleteUser = new DeleteUser(userRepository);
const userController = new UserController(getAllUsers, createUser, getUserById, updateUser, deleteUser);

router.get("/", (req, res, next) => userController.getAll(req, res, next));
router.post("/", (req, res, next) => userController.create(req, res, next));
router.get("/:id", (req, res, next) => userController.getUserById(req, res, next));
router.put("/:id", (req, res, next) => userController.update(req, res, next));
router.delete("/:id", (req, res, next) => userController.delUser(req, res, next));

export { router as userRoutes };