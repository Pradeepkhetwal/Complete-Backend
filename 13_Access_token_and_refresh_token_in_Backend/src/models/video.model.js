import mongoose from "mongoose";
import  mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
const videoSchema = new mongoose.Schema({
  videoFile: {
     //cloudinary url
    type: String,
   required:true
  },
  thumbnail: {
    type: String,
    required:true
  },
  title: {
    type: String,
    required:true
  },
  description: {
    type: String,
    required:true
  },
  duration: {
    
    type: String,
    required:true
  },
  views: {
    type: Number,
    default:0
  },
  isPublished: {
    type: Boolean,
    default:true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
}, {
  timestamps:true
})

//look these mongooseAggregatePaginate are generally added to schema as plugins as we have done in the below line.
// now we will be able to perform the aggregate operations that will be discussed in further lectures.
videoSchema.plugin(mongooseAggregatePaginate)


export const Video = mongoose.model('Video', videoSchema);