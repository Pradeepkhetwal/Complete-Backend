import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js'

//here we will import mongoose first then we will create an async function that will have await as well now we have mongoose.connect function that takes uri as the argument with /db name now this is done with in try catch block and this mongoose.connect method returns connection object ok.From here move to index.js file which is inside src.
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
    console.log(`\n Yeah !! MongoDB is  connected DB Host ${connectionInstance.connection.host}`)
  } catch (error) {
    console.log("mongo db connection failed",error);
    process.exit(1)
  }
}

export default connectDB;