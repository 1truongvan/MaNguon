import mongoose from "mongoose";
const reviewschema = new mongoose.Schema({
    product_id :{type:mongoose.Schema.Types.ObjectId,ref:'product',require: true},
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 }, // 1–5 sao
    comment: { type: String, trim: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
})
export default mongoose.model("Review",reviewschema)