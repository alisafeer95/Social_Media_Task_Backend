import mongoose, { Schema, Document } from 'mongoose';

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  name:string;
}

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  tokenFCM: [{ type: String }],
  wallet: { type: Number, default: 0 }
});

export const userModel = mongoose.model('User',userSchema);