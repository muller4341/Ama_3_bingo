import mongoose from "mongoose";

const allPriceSchema = new mongoose.Schema({
  createdBy: {
      type: mongoose.Schema.Types.ObjectId, // Or String, depending on your user ID type
      required: true,
    },
    Total: {
      type: String, // Or Number, if you store it as a number
      required: true,
    },
    WinnerPrize: {
      type: String, // Or Number
      required: true,
    },
    
winRemains: {
      type: String, // Or Number
      required: true,
    },


    round: {
      type: Number, // Or Number
      required: true,
    },
    HostingRent: {
      type: String, // Or Number
      required: true,
    },
  

}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

const AllPrice = mongoose.model("AllPrice", allPriceSchema);
export default AllPrice;

