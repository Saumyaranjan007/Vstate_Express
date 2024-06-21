import mongoose from "mongoose";


const userRegistratiionSchema= new mongoose.Schema(
    {
        user_id:{ type:Number},
        username:{ type:String,required:true,trim:true},
        password:{ type:String,required:true,trim:true},
        email:{type:String,required:true,trim:true},
        contactNo:{type:String,required:true},
        firstName:{type:String,required:true,trim:true},
        lastName:{type:String,required:true,trim:true},
        prefix:{type:String,trim:true},
        fullName:{type:String,trim:true},
        address:{type:String,trim:true},
        city:{type:String,trim:true},
        state:{type:String,trim:true},
        zip:{type:String,trim:true},
     
    },{timestamps:true}
)

const userRegistrationModel= mongoose.model("signup",userRegistratiionSchema)

export default userRegistrationModel;