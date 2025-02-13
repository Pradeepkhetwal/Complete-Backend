//To create a route.
//first create router using express and export it 
import {Router} from 'express'
import { registerUser } from '../controllers/user.controller.js';

const router = Router()

//now we will create route which is /register pe aake envoke registerUser controller with post functionality.
router.route("/register").post(registerUser)

//exporting this 
export default router;