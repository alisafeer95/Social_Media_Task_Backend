import express,{ Request,Response, } from "express";
import multer from 'multer';
import path from 'path';
import { createPost,getuserPosts,commentOnPost,likePost,getPostById,deletePost } from "../controllers/PostController";
import { authMiddleware } from "../middleware/authentication";

//import { UserController } from "../controllers/UserController";

const postRouter = express.Router();

postRouter.post('/api/post/create',authMiddleware,createPost)
postRouter.get('/api/post/getuserposts',authMiddleware,getuserPosts)
postRouter.post('/api/comment',authMiddleware,commentOnPost);
postRouter.post('/api/like',authMiddleware,likePost);
postRouter.get('/api/post/getpost/:postId',authMiddleware,getPostById);
postRouter.delete('/api/post/delete/:postId',authMiddleware,deletePost);

export default postRouter;