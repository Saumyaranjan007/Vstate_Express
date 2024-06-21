import mongoose from "mongoose";


const invoiceSchema= new mongoose.Schema(
    {
        InvoiceNo:{ type:Number,required:true},
        CustomerName:{type:String,required:true,trim:true},
        TotalAmt:{ type:Number,required:true},
        Balance:{ type:Number,required:true},
        DueDate:{type:String,required:true}
       
     
    },{timestamps:true}
)

const invoiceModel= mongoose.model("invoice",invoiceSchema)

export default invoiceModel;