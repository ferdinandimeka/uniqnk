import { Router } from "express"
import { MongoAuthRepository } from "../../infrastructure/repositories/MongoAuthRepository" 
// import { InMemoryUserRepository } from "../../infrastructure/repositories/InMemoryUserRepository" 
import { LoginUser } from "../../use-cases/auth/signIn"
import { SignUpUser } from "../../use-cases/auth/signUp"
import { AuthController } from "../controllers/AuthController"

const router = Router();

const authRepository = new MongoAuthRepository();
const registerUser = new SignUpUser(authRepository);
const loginUser = new LoginUser(authRepository);

const authController = new AuthController(loginUser, registerUser);

router.post("/login", (req, res, next) => authController.login(req, res, next));
router.post("/register", (req, res, next) => authController.signUp(req, res, next));

export { router as authRoutes };