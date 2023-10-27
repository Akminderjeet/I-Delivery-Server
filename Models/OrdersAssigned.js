import mongoose from "mongoose";

const ordersAssigned = mongoose.Schema({
    agent: String,
    orders: Array,
    pickup: String,
    delivery: String

})