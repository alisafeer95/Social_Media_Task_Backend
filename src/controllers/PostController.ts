import express, { Request, Response } from 'express';
import {  postModel } from '../models/posts';
import multer from 'multer';
import path from 'path';
import { commentModel } from '../models/comments';
import { userModel } from '../models/users';
import config from '../../values.json'


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = `${config.uploaddirectory}`;
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const fileName = `${Date.now()}-${path.extname(file.originalname)}`;
      cb(null, fileName);
    }
  });
  
  const upload = multer({ storage });

export const getPostById=async (req: Request, res: Response) => {
    const { postId } = req.params;
  
    try {
      const post:any = await postModel.findById(postId).populate({
        path: 'comments',
        populate: [{
          path: 'replies' 
        },{
          path:'likes',
          select:'-password -email'
        }]
      }).populate({
        path: 'likes',
        select: '-password -email' // Exclude password and email fields
    });
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      post.views+=1;
      await post.save();
      return res.status(200).json(post);
    } catch (error) {
      console.error('Error fetching post:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  

export const createPost= async (req: Request|any, res: Response) => {

    upload.single('media')(req, res, async (err: any) => {
        if (err) {
          console.error('Error uploading file:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
    const { author, content } = req.body;
    let media;
    if(req.file)
    {
        
        let mediaPath=req.file.filename;
        if (req.file.mimetype.startsWith('image')) {
            media = { images:[mediaPath] };
        } else if (req.file.mimetype.startsWith('video')) {
            media = { videos: [mediaPath] };
        } else {
            // Unsupported media type
            return res.status(400).json({ message: 'Unsupported media type' });
        }
    }

  
    try {
      // Create a new post
      const newPost  = new postModel({
        author,
        content,
        media, // Save file path
        likes: [],
        comments: [],
      });

      
      // Save the post to the database
      const savedPost = await newPost.save();
      const userId = req.user.id; 
       //assuming there are 20 points per post.
      await userModel.findByIdAndUpdate(userId, { $inc: { wallet: 20 } }, { new: true });
      return res.status(201).json(savedPost);
    } catch (error) {
      console.error('Error creating post:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
   })
  }

  export const getuserPosts=async (req: Request | any, res: Response) => {
  
    try {
        const posts = await postModel.find({author:req.user.id}).populate({
            path: 'comments',
            populate: [{
              path: 'replies' 
            },{
              path:'likes',
              select:'-password -email'
            }]
          }).populate({
            path: 'likes',
            select: '-password -email' // Exclude password and email fields
        });
      if (!posts) {
        return res.status(404).json({ message: 'Post not found' });
      }
      return res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching post:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  export const commentOnPost = async (req:Request, res: Response) => {
        
    const { postId,author, content } = req.body;
    try {
      // Check if the post exists
      const post = await postModel.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Create a new comment
      const newComment = new commentModel({
        post: postId,
        author,
        content,
        likes: [],
        replies: [],
      });
  
      // Save the comment to the database
      const savedComment = await newComment.save();
  
      // Add the comment to the post's comments array
      post.comments.push(savedComment._id);
      await post.save();
  
      return res.status(201).json(savedComment);
    } catch (error) {
      console.error('Error commenting on post:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  export const likePost=async (req: Request|any, res: Response) => {
    const postId:String  = req.query.postId as String;

    try {
      // Find the post by ID
      const post = await postModel.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Check if the user has already liked the post
      const userHasLiked = post.likes.includes(req.user.id); // Assuming you have authentication middleware and req.user contains user information
  
      if (userHasLiked) {
        return res.status(400).json({ message: 'You have already liked this post' });
      }
  
      // Add user's ID to the post's likes array
      post.likes.push(req.user.id); // Assuming you have authentication middleware and req.user contains user information
      await post.save();
  
      return res.status(200).json({ message: 'Post liked successfully' });
    } catch (error) {
      console.error('Error liking post:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  export const deletePost=async (req: Request | any, res: Response) => {
    const postId = req.params.postId;
    const authorId = req.user.id; 

    try {
        // Find the post by ID and author ID
        const post = await postModel.findOne({ _id: postId, author: authorId });

        if (!post) {
            // If post not found or user is not the author
            return res.status(404).json({ message: 'Post not found or you are not authorized to delete it' });
        }

        // Delete the post
        await postModel.deleteOne({ _id: postId });
        return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
