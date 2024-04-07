import mongoose,{Schema} from "mongoose";
  
  const commentSchema = new Schema({
    post: { type: mongoose.Types.ObjectId, ref: 'Post', required: true },
    author: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    replies: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
  }, { timestamps: true });
  
  export const commentModel= mongoose.model('Comment', commentSchema);