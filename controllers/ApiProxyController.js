import encryption from "./CryptoApiContoller.js";
import httpProxy from "express-http-proxy"
import express from "express"
import web from "../routes/web.js"

const app = express()

class Apiproxy {
    static ApiProxyController = async (req, res, next) => {
        const { data } = req.query
        console.log(req)
        const decryptData = encryption.decryptData(data)
        const { endpoint, payload } = decryptData
        console.log(endpoint)

        req.dynamicEndpoint = endpoint;
        // app.use(endpoint, web)
        next();
        // router.post(endpoint,Usercontroller.userRegistration)
        console.log(decryptData)
    }
}

export default Apiproxy;