
//look below this code is directly taken from github multer documentation. from the section to upload file to diskstorage. This middleware will now can be directly at any route that is expecting a file upload so here simply ye middleware file ko local storage mein upload karata hai.
//here cb is callback .
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //here we pass the directory to save the file that are to be uploaded to cloudinary , as first we have to upload them to local storage so here the path to the local storage is passed which is simply the inside public folder inside temp. 
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

export const upload = multer({ storage: storage })