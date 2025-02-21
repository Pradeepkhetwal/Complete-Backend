import { ApiError } from "../utils/ApiError";
import { assyncHandler } from "../utils/asynHandler";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

// we will use this middleware in logout route.
export const verifyJWT = assyncHandler(async (req, res, next) => {
  try {
    // we can get access token from the req or from the header.
    //Header mein agar cookie hoti hai to basically key value pair generate hota hai with key as Authorization and Bearer space tokenkeyvalue as the key
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    

    //if we don't get token throw error.
    if (!token) {
      throw new ApiError(401,"Unauthorized request")
    }
  

    //if token is received , so as our token has many fields as we have created so to verify if the token is correct we use JWT , so in JWT we have verify method in which we pass the token which we have to decode and the access key of that token.(here token is access token)
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  
    //now we have verified the access token so we must get user from this token and we must remove the password and refresh token field.
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
    if (!user) {
      throw new ApiError(401,"Invalid Access Token")
    }
  
    //to agar user hai hi hai to hum req k andar ek naya object add kar denge , kisi bhi naam se(here name used is user i.e req.user) aur use user ka access de denge(by writing user in rhs).
    req.user = user;
    next()
  
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token ")
  }
  
})