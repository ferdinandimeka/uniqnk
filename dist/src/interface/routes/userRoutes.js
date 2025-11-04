"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const MongoUserRepository_1 = require("../../infrastructure/repositories/MongoUserRepository");
// import { InMemoryUserRepository } from "../../infrastructure/repositories/InMemoryUserRepository" 
const getAllUsers_1 = require("../../use-cases/user/getAllUsers");
const UserController_1 = require("../controllers/UserController");
const createUsers_1 = require("../../use-cases/user/createUsers");
const updateUser_1 = require("../../use-cases/user/updateUser");
const deleteUser_1 = require("../../use-cases/user/deleteUser");
const getUserById_1 = require("../../use-cases/user/getUserById");
// import { authenticateToken } from "../middleware/auth";
const router = (0, express_1.Router)();
exports.userRoutes = router;
const userRepository = new MongoUserRepository_1.MongoUserRepository();
const getAllUsers = new getAllUsers_1.GetAllUsers(userRepository);
const createUser = new createUsers_1.CreateUser(userRepository);
const getUserById = new getUserById_1.GetUserById(userRepository);
const updateUser = new updateUser_1.UpdateUser(userRepository);
const deleteUser = new deleteUser_1.DeleteUser(userRepository);
const userController = new UserController_1.UserController(getAllUsers, createUser, getUserById, updateUser, deleteUser);
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */
/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/", (req, res, next) => userController.getAll(req, res, next));
/**
* @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get("/:id", (req, res, next) => userController.getUserById(req, res, next));
/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Updated Name"
 *               username:
 *                 type: string
 *                 example: "updatedusername"
 *               email:
 *                 type: string
 *                 example: "updated@example.com"
 *               phone:
 *                 type: string
 *                 example: "08123456789"
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 */
router.put("/:id", (req, res, next) => userController.update(req, res, next));
/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete("/:id", (req, res, next) => userController.delUser(req, res, next));
/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Updated Name"
 *               username:
 *                 type: string
 *                 example: "updatedusername"
 *               email:
 *                 type: string
 *                 example: "updated@example.com"
 *               phone:
 *                 type: string
 *                 example: "08123456789"
 *               profilePicture:
 *                 type: string
 *                 example: "http://example.com/profile.jpg"
 *               coverPhoto:
 *                 type: string
 *                 example: "http://example.com/cover.jpg"
 *               gender:
 *                 type: string
 *                 example: "male"
 *               marital_status:
 *                 type: string
 *                 example: "single"
 *               bio:
 *                 type: string
 *                 example: "This is a short bio"
 *               location:
 *                 type: string
 *                 example: "New York, USA"
 *               website:
 *                 type: string
 *                 example: "http://example.com"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 */
router.put("/:id", (req, res, next) => userController.create(req, res, next));
