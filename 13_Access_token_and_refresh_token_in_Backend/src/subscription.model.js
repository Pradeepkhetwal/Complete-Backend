import mongoose , {Schema} from "mongoose"

const subscriptionSchema = new Schema({
  subscriber: {
    //one who is subscribing is also a user.
    type: Schema.Types.ObjectId,
    ref:"User"
  },
  // channel bhi to ek user hi hai.
  channel: {
    type: Schema.Types.ObjectId,
    ref:"User"
  }
},{timestamps:true})

export const Subscription = mongoose.model("Subscription", subscriptionSchema);