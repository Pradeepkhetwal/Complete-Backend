import mongoose from "mongoose";

const subtodoSchema = mongoose.Schema({
  content: {
    type: String,
    required:true
  },
  complete:{
    type: Boolean,
    default:false
  },
  createdBy: {
    type: mongoose.Schema.Type.ObjectId,
    ref:"User",
  },
}, { timestamps: true })

export const SubTodo = mongoose.model("SubTodo", subtodoSchema);