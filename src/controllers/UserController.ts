// routes/authRoutes.ts
import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userModel } from '../models/users';
import { postModel } from '../models/posts';
import dotenv from 'dotenv';

dotenv.config();



export const register=async (req: Request, res: Response) => {
    const { username, email, password,name } = req.body;
  
    try {
      // Check if the email is already in use
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already registered' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser =new userModel({
        username,
        email,
        password: hashedPassword,
        name
      });
  
      // Save the user to the database
      const savedUser = await newUser.save();
  
      return res.status(201).json(savedUser);
    } catch (error) {
      console.error('Error registering user:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const logout = async (req: Request, res: Response) => {
    // You can invalidate the JWT token here if needed
    return res.status(200).json({ message: 'Logged out successfully' });
  }


export const login = async (req: Request, res: Response) => {
    const { email, password, FCM } = req.body;
  
    try {
      // Find the user by email
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
    
      // Verify the password
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      user.tokenFCM.push(FCM);
      await user.save();
      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, `${process.env.JWT_SECRET}`, { expiresIn: '1h' });
  
      return res.status(200).json({ token });
    } catch (error) {
      console.error('Error logging in user:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }


export const getUsers = async (req: Request, res: Response) => {
  try {
      // Fetch all users from the database
      const users = await userModel.find();
      return res.status(200).json(users);
  } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getUserByIdWithPosts =async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
      // Fetch user by ID from the database
      const user = await userModel.findById(userId);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Fetch posts of the user from the database
      const userPosts = await postModel.find({ author: userId });

      // Combine user and userPosts data
      const userDataWithPosts = {
          user: user,
          posts: userPosts
      };

      return res.status(200).json(userDataWithPosts);
  } catch (error) {
      console.error('Error fetching user with posts:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
  }
};