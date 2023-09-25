import mongoose from "mongoose";

// To keep track of the number of entries so than we can assign sequence numbers in increasing order
const counterSchema = mongoose.Schema({
    collectionName: String,
    entries: Number
})
