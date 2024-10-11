import express from 'express'
import userModel from "../models/User.js"
import Usercontroller from '.././controllers/homeController.js'
import checkuser from '../middlewares/auth_middleware.js'
import Apiproxy from '../controllers/ApiProxyController.js'
import PaymentController from '../controllers/PaymentController.js'


const router = express.Router()

// routerlevel middleware to protect route
router.use("/changepassword", checkuser)
router.use('/profile', checkuser)

// public route
router.post('/register', Usercontroller.userRegistration)
router.get("/register", (req, res,) => {
    res.render("index")

})
router.get('/usermangement/login', (req, res) => {
    res.render("login")
})
router.post('/usermanagement/login', Usercontroller.userLogin)
router.post('/passwordreset', Usercontroller.sendUserPasswordResetEmail)
router.get('/passwordreset', (req, res) => {
    res.render("passwordreset")
})
router.get('/api/user/reset/:id/:token', (req, res) => {
    res.render("passwordresetpage")
})
router.post('/api/user/reset/:id/:token', Usercontroller.passwordResetPage)

router.post("/signup", Usercontroller.staticUserSignUp)




// protected route
router.post('/changepassword', Usercontroller.changePassword)
router.get('/changepassword', (req, res) => {
    res.render("changepassword")
})
router.get('/profile', (req, res) => {
    res.render("profile")
})

router.get("/customer", Usercontroller.getCustomer)

router.get("/invoice", Usercontroller.getInvoice)

router.post("/create-invoice", Usercontroller.createInvoice)

router.post("/create/invoice", Usercontroller.createCompanyInvoice)

router.post("/create-customer", Usercontroller.createCustomer)

router.post("/create-llc", Usercontroller.createLLCDetails)

router.post("/create-llc-members", Usercontroller.createLLCMembers)

router.post("/create-credit-info", Usercontroller.createCreditCardInfo)

router.post("/create-payment", Usercontroller.createPayment)

router.get("/user/getAll", Usercontroller.getUserDetails)

router.post("/create-form", Usercontroller.createForm)

router.get("/form/getAll", Usercontroller.getAllForm)

router.post("/checkout",PaymentController.createPayment)

router.post("/pay",PaymentController.createNewPay)

// router.get("/automation",main)

// router.get("/decrypt",Apiproxy.ApiProxyController)








export default router;