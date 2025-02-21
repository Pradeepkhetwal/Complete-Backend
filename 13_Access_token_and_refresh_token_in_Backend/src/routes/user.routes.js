//To create a route.
//first create router using express and export it
import {Router} from 'express'
import { loginUser, logoutUser, registerUser } from '../controllers/user.controller.js';
import { upload } from "../middlewares/multer.middleware.js";
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

//exporting this
export default router;
