import mongoose from "mongoose";


const Demo= new mongoose.Schema(
    {
        names:{ type:String,required:true,trim:true},
        emails:{ type:String,required:true,trim:true},
        passwords:{ type:String,required:true,trim:true},
     
    }
)

const customModel= mongoose.model("saumya",Demo)

export default customModel;