import mongoose from "mongoose";

const connectDb= async (DATABASE_URL)=>{
try {
    const DBMS_OPTION={
        dbName:"redberyltech",
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
    await mongoose.connect(DATABASE_URL,DBMS_OPTION)
    console.log("connected successfully")
} catch (error) {
    console.log(error)
    console.log('some thing fishy')
}
    
}

export default connectDb;