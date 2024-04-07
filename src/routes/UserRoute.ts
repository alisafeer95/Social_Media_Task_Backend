import express from "express";
import {login,logout,register,getUsers,getUserByIdWithPosts} from '../controllers/UserController'
import { authMiddleware } from "../middleware/authentication";

const userRouter = express.Router();

userRouter.post('/api/user/register',register);

userRouter.post('/api/user/login',login);

userRouter.get('/api/user/:userId',authMiddleware,getUserByIdWithPosts);
userRouter.get('/api/users',authMiddleware,getUsers)

userRouter.post('/api/user/logout',logout);


export default userRouter;