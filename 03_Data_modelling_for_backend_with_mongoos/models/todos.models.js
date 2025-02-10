import mongoose from "mongoose";

const todoSchema = mongoose.Schema({
  content: {
    type: String,
    required:true
  },
  complete: {
    type: Boolean,
    default:false
  },
  //dekho ab ye wala todo kisne banaya hai wo to pata hona hi chahiye as we have multiple user so ek createdBy field bana rahe hai
  createdBy: {
    //now dekho this below mongoose.Schema.Types.ObjectId is a type like string , boolean and all , to jab bhi mongoose is type ko dekhta hai kisi bhi field k andar to it then directly search or requires reference. Now this reference (ref) is made to another model.
    type: mongoose.Schema.Types.ObjectId,
    //here we are referring to User model.
    //this user is the name of the model not the export name it is the name that we pass as a string ( in good practise export name and inside string name of model should be same)
    //now ab ye user ka data user model se le lega .
    ref:"User"
  }
  ,//now inside this todo we want to  have multiple subtodos so it will directly be array of objects and here each object will be a subtodo so it will directly refer to subtodo
  subTodos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:'SubTodo'
    }
  ]
}, { timestamps: true });


export const Todo = mongoose.model("Todo", todoSchema);