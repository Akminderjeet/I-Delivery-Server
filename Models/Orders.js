import mongoose from 'mongoose'

const orders = mongoose.Schema({
    status: Number,
    city: String,
    current: String,
    next: String,
    start: {
        lat: String,
        lng: String
    },
    end: {
        lat: String,
        lng: String,
    },
    path: [String]

})
const Orders = mongoose.model('Orders', orders);
export default Orders;
