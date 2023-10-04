import mongoose from "mongoose";

const distanceEdgeSchema = mongoose.Schema({
    FirstPoint: mongoose.Schema.Types.ObjectId,
    SecondPoint: mongoose.Schema.Types.ObjectId,
    City: String,
    Distance: Number
})

const DistanceEdgeSchema = mongoose.model('DistanceEdgeSchema', distanceEdgeSchema);
export default DistanceEdgeSchema;