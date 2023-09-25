import mongoose from "mongoose";

const DistanceEdgeSchema = mongoose.Schema({
    FirstPoint: mongoose.Schema.Types.ObjectId,
    SecondPoint: mongoose.Schema.Types.ObjectId,
    Distance: Number
})