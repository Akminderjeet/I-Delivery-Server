import mongoose from "mongoose";

const midPointSchema = mongoose.Schema({
    longitude: Number,
    latitude: Number,
    name: String,
    city: String
})

const MidPointSchema = mongoose.model('MidPointSchem', midPointSchema);
export default MidPointSchema;