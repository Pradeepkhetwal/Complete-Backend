//here we will use the asyncHandler that we created in utils.Simply asynchandler ko import karao it will help us with try catch block simply hume ab manually nahi likhna padega , simply pass an async function to that handler and we are good to go.

import { asyncHandler } from "../utils/asynHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  res.status(500).json({
    message:"ok"
  })
})


export {registerUser}