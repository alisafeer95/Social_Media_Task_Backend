import express,{Response, } from "express";
import { authMiddleware } from "../middleware/authentication";
import { replyToComment,likeComment } from "../controllers/CommentController";

const commentRouter = express.Router();

commentRouter.patch('/api/comment/reply/:commentId',authMiddleware,replyToComment);
commentRouter.patch('/api/comment/like/:commentId',authMiddleware,likeComment);


export default commentRouter;