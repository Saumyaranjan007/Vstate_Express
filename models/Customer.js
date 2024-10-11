import mongoose from "mongoose";


const customerRegistratiionSchema= new mongoose.Schema(
    {
        FullyQualifiedName:{ type:String,required:true,trim:true},
        email:{type:String,required:true,trim:true},
        contactNo:{type:String,required:true},
        DisplayName:{type:String,required:true,trim:true},
        CompanyName:{type:String,required:true,trim:true},
        GivenName:{type:String,trim:true},
        address:{type:String,trim:true},
        city:{type:String,trim:true},
        state:{type:String,trim:true},
        zip:{type:String,trim:true},
        country:{type:String,trim:true},
        title:{type:String,trim:true},
     
    },{timestamps:true}
)

const customerRegistrationModel= mongoose.model("companies",customerRegistratiionSchema)

export default customerRegistrationModel;