//here we will use the asyncHandler that we created in utils.Simply asynchandler ko import karao it will help us with try catch block simply hume ab manually nahi likhna padega , simply pass an async function to that handler and we are good to go.

import { assyncHandler } from "../utils/asynHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
const registerUser = assyncHandler(async (req, res) => {
  //This registerUser will do these things.
  //1.get user details from frontend.
  
  //with the help of req.body we can retrieve data that is coming from a form or from json so here we will use req.body agar data url se aye to uske liye we don't use req.body(we will study this later)
  //simply ek bar ye data postman se bhej k api ki testing kar lena iss route mein by sending raw data in json format.console mein print karwa lena
  const { fullName, email, username, password } = req.body;
  console.log("email", email);
  //2. validation - not empty(check if any field is empty)

  if ([fullName,email,username,password].some((field)=>{field?.trim()===""})) {
    throw new ApiError(400, "All fields are required");
  }
  //3. check if user already exists:username,email.
  //To check whether user exist or not first import user from model folder.

  //now this User is directly connected to db so we can use findOne method to check if the user already exists or not 
 const existedUser = User.findOne({
    //by using dollar $ we can use operator.
   //inside this [] bracket we can pass as many as entities.
   //it will check whether in db the user with this username or email exist karta hai ki nahi if it does it will return true , if does not then return false.It is or operator so dono mein se ek bhi agar exist karega in db so it will return true.
    $or:[{username},{email}]
  })
  if (existedUser) {
    throw new ApiError(409,"User with given email or username already exists")
  }
  //4. check for images, check for avatar.

  //as we have used multer middleware with the controller so now we can have req.files which will give us the access to files.

  //this will give avatar by [0] we are acessing the first property of avatar as it will have many properties so here we are accessing first property as in first property we get an object we can take it as optionally to get the path.
  //path for avatar image
  const avatarLocalPath = req.files?.avatar[0]?.path;


  //path for cover image
  const coverImageLocalPath = req.files?.converImage[0]?.path;

  //now we need to check for avatar hai ki nahi in local path.
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  //upload them to cloudinary,avatar

  // to upload first import cloudinary upload method.is method ko simply hum local path denge aur ye use cloudinary mein upload kar dega.
  //it will take time so we will use await.
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  //now check avatar gya ya nhi cloudinary mein bcoz it is required filed agar nhi gya to pura backend fatt jayega.

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required ");
  }

  //now create user object then create entry in db.
  //create method se hum user create kar lete hai inside it we can pass the fields of the user.

  //now this creation of user might take some time so we wrap it inside await function.
 const user = await User.create({
    fullName,
    //db mein sirf url store karayenge of avatar
   avatar: avatar.url,
    //if coverimage hai to save url to db nahi to empty url push kardo to db.
    coverImage: coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()
 })
  //agar user mil gya to user create hua tha pehle se ._id automatic generate karta hai mongo , user create nahi hua hai to 
  User.findById(user._id)
  //remove password and refresh token field from response.
  //check for usercreation.
  //return response if user is created.

 
})





export {registerUser}