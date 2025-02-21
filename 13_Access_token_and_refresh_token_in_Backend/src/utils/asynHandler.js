// const assyncHandler = (func) => async (req,res,next) => {
//   try {
//     await func(req,res,next)
//   }
//   catch (error) {
//     res.status(error.code || 500).json({
//       success: false,
//       message:err.message
//     })
//   }
// }



const assyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
  }
}
export {assyncHandler}



