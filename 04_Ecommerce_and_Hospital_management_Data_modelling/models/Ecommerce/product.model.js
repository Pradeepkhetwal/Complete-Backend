import mongoose from 'mongoose'

const productSchema = mongoose.Schema({
  description: {
    required: true,
    type:String
  },
  name: {
    required: true,
    type:String
  },
  //3rd party mein hi usually store karete hai hum images , mongo bhi kar sakta hai save par database heavy ho jayega, 3rd party like cloudinary uploaded images ka link de dete hai so here type is string.
  productImage: {
    type:String
  },
  price: {
    type: Number,
    default:0
  },
  stock: {
    default: 0,
    type:Number
  },
  category: {
    type: mongoose.Schema.Types.Objectid,
    ref: "Category",
    required:true
  },
  owner: {
    type: mongoose.Schema.Type.ObjectId,
    ref:"User"
  }
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);