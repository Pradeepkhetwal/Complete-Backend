//1.first import mongoose.
import mongoose from 'mongoose'


//Note here we are only practising models here we are not dealing with mongodb.


//2. creating schema
//now mongoose help to create schema so we can create schema with new keyword and mongoose.Schema({}).Inside this Schema we enter the fields of the data .
//This schema will be created in mongodb.
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,//means ye username field hona hi chahiye.
      unique: true,
      lowercase:true//all username must be lower case .
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase:true
    },
    password: {
      type: String,
      required:[true,"password is required"]
    }
  }
  , //this second object bascially note karta hai ki user kis samay create hua or update hua
  {timestamps:true}
)


//3. creating model from the schema.
//model is a method that makes model and takes 2 parameter the first parameter is the name of the model and the second parameter is kis k basis pe model banana hai so here userSchema is the 2nd parameter means we are making model on the basis of userSchema
//here user is the name of the model.
//And now we will export user model.
export const User = mongoose.model("User", userSchema);

//ab jaise hi ye model mongodb mein jayega to iska naam will become plural and in small letters i.e it will become users in mongodb