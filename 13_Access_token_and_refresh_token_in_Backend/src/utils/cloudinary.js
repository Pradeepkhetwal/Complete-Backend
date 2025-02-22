import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'


// This Configuration is directly copied from my cloudinary account , you will see this at let's get started page.
    //it will give these keys i have added those keys in environmental variables.
    cloudinary.config({ 
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_SECRET_KEY
    });


//now we will organize the file upload  to cloudinary in a uploadOnCloudinary (user defined async method) here localfielpath is the path of the file that is to be uploaded . The functionality inside the function is also copied from cloudnary 
const uploadOnCloudinary = async(localFilePath) =>
{
  try {
    //if path does not exist return null.
    if (!localFilePath) {
     return null
    } 
    //upload the file on cloudinary.
   const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type:'auto'
    })
    console.log("File is uploaded on cloudinary", response.url);
    //this will remove the locally save file when the file is uploaded to cloudinary successfully 
    fs.unlinkSync(localFilePath);
    return response;
  }
  catch (error) {
    //this will remove the locally save file as the upload operation to cloudinary got failed.
    fs.unlinkSync(localFilePath)
  }
}

//finally exporting this function.
export {uploadOnCloudinary}
    

    

 
