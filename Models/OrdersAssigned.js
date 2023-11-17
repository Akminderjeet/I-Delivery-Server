import mongoose from "mongoose";
import Orders from './Orders.js'
const ordersAssigned = mongoose.Schema({
    agent: String,
    order: {
        type: String,
        ref: 'Orders',
    },
    pickup: String,
    delivery: String,
    activeStatus: Number

})

const OrdersAssigned = mongoose.model('OrdersAssigned', ordersAssigned);
export default OrdersAssigned;