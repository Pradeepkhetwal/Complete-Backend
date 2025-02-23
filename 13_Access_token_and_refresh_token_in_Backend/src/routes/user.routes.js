//To create a route.
//first create router using express and export it
import {Router} from 'express'
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from '../controllers/user.controller.js';
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router = Router()

//now we will create route which is /register pe aake envoke registerUser controller with post functionality.
router.route("/register").post(upload.fields([
  {
    name: "avatar",
    maxCount:1
  }, {
     name: "coverImage",
    maxCount:1
  }
]), registerUser)

router.route("/login").post(loginUser);

//secured routes

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken)
//to change password user must be loggedin so we will use verifyJWT middleware.
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
//to get current user, user must be loggedin so we will use verifyJWT middleware.
router.route("/current-user").get(verifyJWT, getCurrentUser)
//to update account details user must be loggedin so we will use verifyJWT middleware. Yaha par kuch hi details ko update karna hai so we will use patch, not post, becoz post sarri info ko update kar dega.
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
//to update user avatar image first user must be loggedin so we will use verifyJWT middleware and then to upload image we will use multer. Same will happen for coverimage.
//here upload.single means we are uploading a single file. you can give any name to the file inside the strings
//here we have given avatar and cover image. patch ka concept I have explained in above route.
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

//ab params mein se le rahe hai.
// /c rakhna hai ya fir /channel aapki marzi hai
//yaha par important sirf colon hai ki hum uske baad kya likhe.
//colon k baad jo likhoge wahi aapko milega
router.route("/c/:username").get(verifyJWT, getUserChannelProfile);
router.route("/history").get(verifyJWT,getWatchHistory)

//exporting this router.
export default router;
