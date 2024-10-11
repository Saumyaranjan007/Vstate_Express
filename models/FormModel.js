import mongoose from "mongoose";


const formSchema= new mongoose.Schema(
    {
        state:{ type:String,required:true,trim:true},
        companyType:{ type:String,required:true,trim:true},
        formFieldCollection:{ type:String,required:true,trim:true},
        templateUrl:{ type:String,required:true,trim:true},
    }
)

const formModel= mongoose.model("form-model",formSchema)

export default formModel;