import Order from "../models/order.model.js";
import Listing from "../models/listing.model.js";

export const createOrder = async (req, res, next) => {
  try {
    const { listing, listingStatus, ...rest } = req.body;
    const newOrder = await Order.create(req.body);
    const list = await Listing.findByIdAndUpdate(listing, {
      status: listingStatus,
    }, {new: true});
    return res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
};
