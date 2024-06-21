import  jwt  from "jsonwebtoken";
import userModel from "../models/User.js";

const checkuser=async (req,res, next)=>{
    let token
    const { authorization}= req.headers
    if (authorization&& authorization.startswith('Bearer')){
        try {
            // Get token from headers
            token=authorization.split('')[1]
            // Verify token
            const {userid}= jwt.verify(token,process.env.JWT_SECRET_KEY)

            // Get user from token
            req.user= await userModel.findById(userid).select('-password')
            next()
        } catch (error) {
            console.log(error)
            res.status(401).send({"status":"failed","msg":"Unauthorized User"})
        }
    }
    if (!token){
        res.status(401).send({"status":"failed","msg":"Unauthorized User , No token "})
    }
}


export default checkuser
