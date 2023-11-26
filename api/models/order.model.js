import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderStatus: {
      type: String,
      required: true,
      enum: ["rent", "sale"],
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    payment: {
      paypalID: String,
      status: {
        type: String,
        enum: ["pair", "unpair"],
      },
    },
  },
  { timestamps: true }
);


const Order = mongoose.model('Order', orderSchema)
export default Order