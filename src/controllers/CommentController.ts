    import {commentModel} from "../models/comments";
    import express, { Request,Response } from 'express';
   // import {RequestWithUser} from "../Interfaces/requestWithUser";
    export const replyToComment=async (req: Request, res: Response) => {
        const { commentId } = req.params;
        const { author, content } = req.body;
      
        try {
          // Check if the parent comment exists
          const parentComment = await commentModel.findById(commentId);
          if (!parentComment) {
            return res.status(404).json({ message: 'Parent comment not found' });
          }
      
          // Create a new reply
          const newReply = new commentModel({
            post: parentComment.post,
            author,
            content,
            likes: [],
            replies: [],
          });
      
          // Save the reply to the database
          const savedReply = await newReply.save();
      
          // Add the reply to the parent comment's replies array
          parentComment.replies.push(savedReply._id);
          await parentComment.save();
          return res.status(201).json(savedReply);
        } catch (error) {
          console.error('Error replying to comment:', error);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
      }


      export const likeComment=async (req: Request|any, res: Response) => {
        const {commentId}  = req.params;
    
        try {
          // Find the post by ID
          const comment = await commentModel.findById(commentId);
          if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
          }
      
          // Check if the user has already liked the post
          const userHasLiked = comment.likes.includes(req.user.id); // Assuming you have authentication middleware and req.user contains user information
      
          if (userHasLiked) {
            return res.status(400).json({ message: 'You have already liked this comment'});
          }
      
          // Add user's ID to the post's likes array
          comment.likes.push(req.user.id); // Assuming you have authentication middleware and req.user contains user information
          await comment.save();
      
          return res.status(200).json({ message: 'Comment liked successfully' });
        } catch (error) {
          console.error('Error liking post:', error);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
      }

     