import mongoose from 'mongoose'

const agentSchema = mongoose.Schema({
    name: String,
    mobile: String,
    email: String,
    city: String,
    gender: String,
    adhar: String,
    upi: String,
    status: Number,
    location: {
        lat: String,
        lng: String
    }
})

const AgentSchema = mongoose.model('AgentSchema', agentSchema);
export default AgentSchema;