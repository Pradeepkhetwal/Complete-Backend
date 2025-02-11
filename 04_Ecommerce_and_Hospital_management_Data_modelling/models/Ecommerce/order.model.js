import mongoose from 'mongoose'

//ye ek mini schema hai .This is basically for the orders quantity kyu ki quantity kitni bhi ho skti hai product ki.
const orderItemsSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Product"
  },
  quantity: {
    type: Number,
    required:true
  }
})

const orderSchema = mongoose.Schema({
  orderPrice: {
    type: Number,
    required:true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  orderItems: {
    type:[orderItemsSchema]
  },
  address: {
    type: String,
    required:true
  },
  status: {
    type: String,
    //enum provide options from which we have to choose now here string must be either pending, or cancelled or deliverd , by default it will be pending. apart from this nothing will be acccepted.
    enum: ["PENDING", "CANCELLED", "DELIVERED"],
    default:"PENDING"
  }
},{timestamp:true})

export const Order = mongoose.model('Order', orderSchema);