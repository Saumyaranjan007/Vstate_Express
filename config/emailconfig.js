import dotenv from 'dotenv'
dotenv.config()
import nodemailer from 'nodemailer'


let transporter= nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure:false,  // true for by default port=465
    auth:{
        user: process.env.EMAIL_USER, //Admin user
        pass: process.env.EMAIL_PASS  //ADMIN Password
    }
})


export default transporter