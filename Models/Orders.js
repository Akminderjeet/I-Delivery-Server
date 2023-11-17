import mongoose from 'mongoose'

const orders = mongoose.Schema({
    // Number of Node at which it is reached
    status: Number,
    city: String,
    current: String,
    next: String,
    owner: String,
    start: {
        lat: String,
        lng: String
    },
    end: {
        lat: String,
        lng: String,
    },
    path: [String],
    //  Stage -> Assigned -> 1  Order Picked -> 2     Order Delivered -> 0
    stage: Number

})
const Orders = mongoose.model('Orders', orders);
export default Orders;
