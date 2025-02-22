//here we will use the asyncHandler that we created in utils.Simply asynchandler ko import karao it will help us with try catch block simply hume ab manually nahi likhna padega , simply pass an async function to that handler and we are good to go.

import { assyncHandler } from "../utils/asynHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import  jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId)=>{
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    
    return { accessToken, refreshToken };
  }
  catch (error) {
    throw new ApiError(500,"Something went wrong while generating refresh and access token")
  }
}
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
 const existedUser =await User.findOne({
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
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  //now we need to check for avatar hai ki nahi in local path.
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  //5 .upload them to cloudinary,avatar

  // to upload first import cloudinary upload method.is method ko simply hum local path denge aur ye use cloudinary mein upload kar dega.
  //it will take time so we will use await.
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  //now check avatar gya ya nhi cloudinary mein bcoz it is required filed agar nhi gya to pura backend fatt jayega.

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required ");
  }

  //6. now create user object then create entry in db.
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
  //agar neeche user mil gya to user create hua tha pehle se, ._id automatic generate karta hai mongo , user create nahi hua hai to kuch nahi ayega, Now we have a select method as well that allow us to select a specfic field from the user, here we basically mention those fileds which we does not want so these fields are passed as a string with - sign, so here we don't want password and refreshToken so we have passed them.
  const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if (!createUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  //7 remove password and refresh token field from response.
  //check for usercreation.
  //return response if user is created.

  // finally we will return the created user with the help of API response that we have created in utils folder , it will help us to return the response in an structured manner(means we can send statuscode,response,message) . So we are returning it.
  return res.status(201).json(
    new ApiResponse(200, createUser, "user registered successfully")
  )
})

const loginUser = assyncHandler(async(req, res) => {
  
  //1. retreive data from req.body

  const { email, username, password } = req.body
  
  //email ya username mein se ek to hona hi chahiye.
  if (!username && !email) {
    throw new ApiError(400,"username or password is required")
  }
  //2. either login by username or email.

  //3. find the user 

  //finding the user by either username or email
  const user = await User.findOne({
    $or: [{username}, {email}]
})

  //agar user nahi mila.
  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  //4.password check karo
  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
   throw new ApiError(401, "Invalid user credentials")
   }
  //5. now generate access and refresh token and provide it to the user.
  const {accessToken , refreshToken
  } = await generateAccessAndRefreshTokens(user._id)
  
  //optional step. (As here we are removing unwanted fields like password , and refreshToken(which is empty here) from the user)
  const loggedInUser = await User.findById(user._id).select("-password-refreshToken")

  //6. send cookie.
  //Here we create an object jiske andar we need to modify some options like httpOnly and secure bcoz by default jo humari cookie hoti hai wo easily modify ho skti hai . So when we true httpOnly and secure field now the cookie is modifiable only from the server. Not from the frontend.So cookies ko frontend se koi modify na kar paye uske liye we are setting these options as true.
  const options = {
    httpOnly: true,
    secure:true
  }
  
  //with the help of cookieparser module we can now have cookies with req, as well as with response so that's why we are capable of writing res.cookie here.

  //now we will return the reponse of this method , in this reponse we will return cookie , so by .cookie karke jitni chahe utni cookie send kar sakte ho , so here ek cookie for setting accessToken ,and one for setting refreshToken so ek json reponse bhi bhej do jiske andar we are sending user with, accessToken and refreshToken.
  // here inside string we have key and after coma we have it's value.
  return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
    new ApiResponse(
      200, {
        user: loggedInUser, accessToken,
        refreshToken
    },
      "User logged In Successfully"
    )
  )
})

const logoutUser = assyncHandler(async (req, res) => {
  //to logout we need to clear cookies of the user and to reset the refreshToken of the user.
  // so for that we first need user id , so the question comes from where we will get this user id .
  //so for that we will create a middleware in auth.middleware.js file with name verifyJWT(please go and see it) jo ki accesstoken ko verify karega kisi bhi user k aur waha se req mein ek naya object add kar dega (named user) jiski value will be user(which we want so that we can get id).
  //now with the help of findByIdAndUpdate method we will reset the cookies and refreshToken
 await User.findByIdAndUpdate(
    req.user._id,
   {
     $set: {
       refreshToken: undefined
     }
   },
   {
        //by setting new to true to response mein hume (changed fields) refreshToken ki new value milegi i.e undefined. nahi to purani value mil jayegi
        new:true
      }
    
  )

  const options = {
    httpOnly: true,
    secure:true
  }
  //clearing cookies.
  return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse(200,{},"User logged out"))
})


//This function is to renew the access token of the user , once it is expired.
const refreshAccessToken = assyncHandler(async (req, res) => {
  //to get user refreshToken access it from cookies.Now if the user is using mobile app the Refresh Token is fetched from the body.

 const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
  
  //if Token not found throw error.
  if (!incomingRefreshToken) {
    throw new ApiError(401,"unauthorized request")
  }

  //now verify the incomingRefreshToken.
  //So to verify this user token we will be using jwt.After verifying we will get decoded token.

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )
  
    //now we need to find user. So now in this RefreshToken we have user id (go and check in user.model.js in generateRefreshToken function)
  
    const user = await User.findById(decodedToken?._id)
  
    if (!user) {
      throw new ApiError(401, "invalid refresh Token");
    }
  
    //now matching the incomingRefreshToken(jo user hume bhej ra hai) and the decodedRefreshToken from incomingRefreshToken jisse we found a user and now we need to check if both user are same , then user is valid.
  
    if (incomingRefreshToken != user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or user");
    }
  
    //now we will generate new token and we will store them in cookies so options ko leke aao.
    const options = {
      httpOnly: true,
      secure:true
    }
  //with the help of generateAceessAndRefreshToken we are able to generate new access and refresh token 
   const {accessToken,newRefreshToken} = await generateAccessAndRefreshTokens(user._id);
  
    //now return the response with updated token values in the cookies of the user.
    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", newRefreshToken, options).json(
      new ApiResponse(
        200,
        {
          //acessToken ki value will be accessToken
          accessToken,refreshToken:newRefreshToken
        },"Access token refreshed"
      )
    )
  } catch (error) {
    throw new ApiError(401,error?.message || "invalid refresh token")
  }

})


const changeCurrentPassword = assyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body
  
  //to user chahiye hume jiska password change karna ho, to wo loginbhi hoga.
  // to agar user loggedin hai to confirm hai ki auth middleware run hua hai and in this middleware inside req.user we have user. so we can find the user 

  const user = await User.findById(req?._id)
  
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  
  return res.status(200).json(new ApiResponse(200,{},"Password changed Successfully!"))
})

const getCurrentUser = assyncHandler(async (req, res) => {
  return res.status(200).json(200,req.user,"current user fetched successfully")
})

const updateAccountDetails = assyncHandler(async (req, res) => {
  const { fullName, email } = req.body
  
  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required")
  }

  const user = User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email: email
      }
    },
    { new: true }
  ).select("-password")//means password filed gayab kar do

  return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"))
});

//function for file update.
//for this we again need multer middleware.

const updateUserAvatar = assyncHandler(async (req, res) => {
  //through this req.file we can get the files as multer middleware is there. 
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400,"Avatar file is missing")
  }
//now upload this avatar on cloudinary.
  const avatar = await uploadOnCloudinary(avatarLocalPath)
  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

 const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        //set the avatar by this avatar.url(url of new avatar)
        avatar:avatar.url
      }
    },
    {new:true}
  ).select("-password")

  return res.status(200).json(
    new ApiResponse(200,user,"Avatar image updated successfully")
  )
})
const updateUserCoverImage = assyncHandler(async (req, res) => {
  //through this req.file we can get the files as multer middleware is there. 
  const coverImageLocalPath = req.file?.path;
  if (!coverImageLocalPath) {
    throw new ApiError(400,"Avatar file is missing")
  }
//now upload this avatar on cloudinary.
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  if (!coverImage.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

 const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        //set the avatar by this avatar.url(url of new avatar)
        coverImage:coverImage.url
      }
    },
    {new:true}
  ).select("-password")

  return res.status(200).json(
    new ApiResponse(200,user,"Cover image updated successfully")
  )
})
export {registerUser,loginUser,logoutUser,refreshAccessToken,getCurrentUser,updateAccountDetails,updateUserAvatar,updateUserCoverImage}