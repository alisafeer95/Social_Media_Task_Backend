import mongoose,{Schema} from 'mongoose';



const postSchema = new Schema({
  author: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  media: {
    // For images
    images: [{ type: String }],
    // For videos
    videos: [{ type: String }],
    // Add more types as needed
  },
  likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
  views: { type: Number, default: 0 }
}, { timestamps: true });

export const postModel = mongoose.model('Posts',postSchema);