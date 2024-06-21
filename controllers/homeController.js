import userModel from "../models/User.js";
import customModel from "../models/Demo.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import transporter from "../config/emailconfig.js";
import axios from "axios";
import userRegistrationModel from "../models/UserRegistration.js";
import customerRegistrationModel from "../models/Customer.js";
import invoiceModel from "../models/Invoice.js";
import formModel from "../models/FormModel.js";

class Usercontroller {
    static userRegistration = async (req, res) => {
        console.log(req.body + "res")
        const { name, email, password, password_confirmation } = req.body

        const user = await customModel.findOne({ email: email })
        if (user) {
            res.send({ "status": "failed", "msg": "Email already exists" })
        }
        else {
            if (name && email && password && password_confirmation) {

                if (password === password_confirmation) {
                    try {
                        const salt = await bcrypt.genSalt(10)
                        const hashpassword = await bcrypt.hash(password, salt)
                        const doc = new customModel({
                            name: name,
                            password: hashpassword,
                            email: email
                        })
                        await doc.save()
                        const saved_user = await customModel.findOne({ email: email })
                        // Generate jwt token
                        const token = jwt.sign({ userid: saved_user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })

                        res.status(201).send({ "status": "success", "msg": "Registration successful", "token": token })

                    } catch (error) {
                        console.log(error)
                        res.send({ "status": "failed", "msg": "Unable to Registered" })
                    }
                }
                else {
                    res.send({ "status": "failed", "msg": "Password and Password Confirmation does not match" })
                }

            }
            else {
                res.send({ "status": "failed", "msg": "All fields are required" })
            }
        }
    }

    static userLogin = async (req, res) => {
        const { email, password } = req.body
        console.log(email)
        console.log(password)
        const data=await axios.post("http://127.0.0.1:1337/admin/login", req.body, {
            headers: {
                Authorization: 'Bearer ' + process.env.STRAPI_TOKEN,
            }
        })
        console.log(data)
        res.send(data.data)

        // const options = {
        //     hostname: 'api.example.com',
        //     path: '/data',
        //     method: 'GET',
        //   };
        
        //   const externalRequest = http.request(options, (externalResponse) => {
        //     let data = '';
        
        //     externalResponse.on('data', (chunk) => {
        //       data += chunk;
        //     });
        
        //     externalResponse.on('end', () => {
        //       res.json(JSON.parse(data));
        //     });
        //   });
        
        //   externalRequest.on('error', (error) => {
        //     console.error('Error fetching data:', error);
        //     res.status(500).json({ error: 'Failed to fetch data' });
        //   });
        
        //   externalRequest.end();
        // const user = await userModel.findOne({ email: email })
        // const isMatch = await bcrypt.compare(password, user.password)
        // if (email && password) {
        //     if (user != null) {
        //         if (email == user.email && isMatch) {
        //             // Generate token for login
        //             const token = jwt.sign({ userid: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })

        //             res.send({ "status": "success", "msg": "login successful", "token": token })
        //             res.redirect('/profile')

        //         }
        //         else {
        //             res.send({ "status": "failed", "msg": "Email or Password is not valid" })
        //         }
        //     }
        //     else {
        //         res.send({ "status": "failed", "msg": "Email not registered" })
        //     }

        // }
        // else {
        //     res.send({ "status": "failed", "msg": "All fields are required" })
        // }
    }


    static changePassword = async (req, res) => {
        const { password, password_confirmation } = req.body
        if (password && password_confirmation) {
            if (password == password_confirmation) {
                const salt = await bcrypt.genSalt(10)
                const newhashpassword = await bcrypt.hash(password, salt)
                //Update password
                await userModel.findByIdAndUpdate(req.user._id, { $set: { password: newhashpassword } })
                res.send({ "status": "success", "msg": "New password updated successfully" })
            }
            else {
                res.send({ "status": "failed", "msg": "New Password and New Confirm Password does not match" })
            }

        }
        else {
            res.send({ "status": "failed", "msg": "All fields required" })
        }
    }



    static sendUserPasswordResetEmail = async (req, res) => {
        const { email } = req.body
        if (email) {
            const user = await userModel.findOne({ email: email })
            if (user) {
                const secret = user._id + process.env.JWT_SECRET_KEY
                const token = jwt.sign({ userid: user._id }, secret, { expiresIn: '15m' })
                // create front_end link
                const link = `http://127.0.0.1:8000/api/user/reset/${user._id}/${token}`
                const info = await transporter.sendMail({
                    from: process.env.EMAIL_FROM,
                    to: user.email,
                    subject: 'Ganitravel Password Reset',
                    html: `<a href=${link}>click here</a>Password Reset`

                })
                res.send({ "status": "success", "msg": "Please check your email for link", 'info': info })

            }
            else {
                res.send({ "status": "failed", "msg": "Unauthorized Email entered" })
            }

        }
        else {
            res.send({ "status": "failed", "msg": "Email fields required" })
        }

    }



    static passwordResetPage = async (req, res) => {
        const { password, password_confirmation } = req.body
        const { id, token } = req.params
        const user = await userModel.findById(id)
        const new_secret_key = user._id + process.env.JWT_SECRET_KEY
        try {
            jwt.verify(token, new_secret_key)
            if (password && password_confirmation) {
                if (password == password_confirmation) {
                    const salt = await bcrypt.genSalt(10)
                    const newhashpassword = await bcrypt.hash(password, salt)
                    //Update password
                    await userModel.findByIdAndUpdate(user._id, { $set: { password: newhashpassword } })
                    res.send({ "status": "success", "msg": "Password reset successfully" })

                }
                else {
                    res.send({ "status": "failed", "msg": "New Password and New Confirm Password does not match" })
                }

            }
            else {
                res.send({ "status": "failed", "msg": "All fields required" })
            }


        } catch (error) {
            console.log(error)
            res.send({ "status": "failed", "msg": "Invalid token" })

        }

    }


    static staticUserSignUp = async (req, res) => {
        try {
            const { user_id, fullName, firstName, prefix, lastName, website, company, phone, address, city, state, zip, blocked, confirmed, email, password, username } = req.body

            const actualdata = {
                properties:
                    [{ property: 'firstname', value: firstName },
                    { property: 'lastname', value: lastName },
                    { property: 'website', value: website },
                    { property: 'company', value: company },
                    { property: 'phone', value: phone },
                    { property: 'address', value: address },
                    { property: 'city', value: city },
                    { property: 'state', value: state },
                    { property: 'zip', value: zip }]
            }

            const temp = {
                blocked: false,
                confirmed: confirmed,
                username: username,
                password: password,
                email: email
            }



            const response = await axios.post("http://127.0.0.1:1337/users", temp, {
                headers: {
                    Authorization: 'Bearer ' + process.env.STRAPI_TOKEN,
                    'Content-Type': 'application/json',
                }
            })
                .then((response) => {
                    console.log(response)

                    // res.status(201).json(response.data);
                    // res.send({ "status": "success", "msg": "Data successfully" })
                })
                .catch((err) => {
                    console.log(err)
                    res.send({ "status": "failed", "msg": "Error" })
                })

            const response1 = await axios.post(`https://api.hubapi.com/contacts/v1/contact/createOrUpdate/email/${email}/`, actualdata, {
                headers: {
                    Authorization: 'Bearer ' + process.env.HUBSPOT_TOKEN,
                    'Content-Type': 'application/json',

                },
              
            })
                .then((response) => {
                    console.log(response)
                    // res.send({ "status": "success", "msg": "Data successfully" })
                })
                .catch((err) => {
                    console.log(err)
                    res.send({ "status": "failed", "msg": "Error" })
                })


            const user = await userRegistrationModel.findOne({ email: email })
            if (user) {
                res.status(500).send({ "status": "failed", "msg": "Email already exists" })
            }
            else {
                if (email && password) {

                    if (password) {
                        try {
                            const salt = await bcrypt.genSalt(10)
                            const hashpassword = await bcrypt.hash(password, salt)
                            const doc = new userRegistrationModel({
                                user_id: user_id,
                                username: username,
                                password: hashpassword,
                                email: email,
                                contactNo: phone,
                                firstName: firstName,
                                lastName: lastName,
                                prefix: prefix,
                                fullName: fullName,
                                address: address,
                                city: city,
                                state: state,
                                zip: zip
                            })
                            await doc.save()
                            const saved_user = await userRegistrationModel.findOne({ email: email })
                            // Generate jwt token
                            const token = jwt.sign({ userid: saved_user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })

                            res.status(201).send({ "status": "success", "msg": "Registration successful", "token": token })

                        } catch (error) {
                            console.log(error)
                            res.send({ "status": "failed", "msg": "Unable to Registered" })
                        }
                    }
                    else {
                        res.send({ "status": "failed", "msg": "Password and Password Confirmation does not match" })
                    }

                }
                else {
                    res.send({ "status": "failed", "msg": "All fields are required" })
                }
            }


        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static getCustomer = async (req, res) => {
        const response = await axios.get("https://sandbox-quickbooks.api.intuit.com/v3/company/9341452347737481/query?query=select * from Customer&minorversion=70", {
            headers: {
                Authorization: 'Bearer ' + process.env.TOKEN,
            }
        })
            .then((resp) => {
                console.log(resp)
                res.send(resp.data)
            })
            .catch((err) => {
                console.log(err)
                res.send(err)
            })
    }

    static getInvoice = async (req, res) => {
        const response = await axios.get("https://sandbox-quickbooks.api.intuit.com/v3/company/9341452347737481/query?query=select * from Invoice&minorversion=70", {
            headers: {
                Authorization: 'Bearer ' + process.env.TOKEN,
            }
        })
            .then((resp) => {
                console.log(resp)
                res.send(resp.data)
            })
            .catch((err) => {
                console.log(err)
                res.send(err)

            })
    }

    static createInvoice = async (req, res) => {
        const response = await axios.post("https://sandbox-quickbooks.api.intuit.com/v3/company/9341452347737481/invoice?minorversion=70", req.body, {
            headers: {
                Authorization: 'Bearer ' + process.env.TOKEN,
            }
        })
            .then((resp) => {
                console.log(resp)
                res.send(resp.data)
            })
            .catch((err) => {
                console.log(err)
                res.send(err)
            })
    }

    static createCompanyInvoice = async (req, res) => {
        try {

            const { InvoiceNo, CustomerName, TotalAmt, Balance, DueDate } = req.body
            const data = new invoiceModel({

                InvoiceNo: InvoiceNo,
                CustomerName: CustomerName,
                TotalAmt: TotalAmt,
                Balance: Balance,
                DueDate: DueDate
            })
            await data.save()
            res.status(201).send({ "status": "success", "msg": "Invoice Created successful", "data": data })

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: error.message });

        }
    }

    static createCustomer = async (req, res) => {
        try {
            const { FullyQualifiedName, PrimaryEmailAddr, DisplayName, Title, PrimaryPhone, CompanyName, BillAddr, GivenName } = req.body

            const { City, PostalCode, Line1, Country, CountrySubDivisionCode } = BillAddr

            const { Address } = PrimaryEmailAddr

            const { FreeFormNumber } = PrimaryPhone

            const company = await customerRegistrationModel.findOne({ FullyQualifiedName: FullyQualifiedName })

            if (company) {
                res.status(500).send({ "status": "failed", "msg": "Company Already Exist" })
            }
            else {

                try {
                    const data = new customerRegistrationModel({

                        FullyQualifiedName: FullyQualifiedName,
                        email: Address,
                        contactNo: FreeFormNumber,
                        DisplayName: DisplayName,
                        CompanyName: CompanyName,
                        GivenName: GivenName,
                        address: Line1,
                        city: City,
                        state: CountrySubDivisionCode,
                        zip: PostalCode,
                        country: Country,
                        title: Title,
                    })

                    await data.save()
                    // res.status(201).send({ "status": "success", "msg": "Registration successful"})
                } catch (error) {
                    console.log(error)
                }
                const response = await axios.post("https://sandbox-quickbooks.api.intuit.com/v3/company/9341452347737481/customer?minorversion=70", req.body, {
                    headers: {
                        Authorization: 'Bearer ' + process.env.TOKEN,
                    }
                })
                    .then((resp) => {
                        console.log(resp)
                        res.send(resp.data)
                    })
                    .catch((err) => {
                        console.log(err)
                        res.send(err)
                    })
            }

        } catch (error) {
            console.log(error)
        }

    }

    static createPayment = async (req, res) => {
        const response = await axios.post("https://sandbox-quickbooks.api.intuit.com/v3/company/9341452347737481/payment?minorversion=70", req.body, {
            headers: {
                Authorization: 'Bearer ' + process.env.TOKEN,
            }
        })
            .then((resp) => {
                console.log(resp)
                res.send(resp.data)
            })
            .catch((err) => {
                console.log(err)
                res.send(err)
            })
    }

    static createLLCDetails = async (req, res) => {
        const response = await axios.post("http://127.0.0.1:1337/llcs", req.body, {
            headers: {
                Authorization: 'Bearer ' + process.env.STRAPI_TOKEN,
            }
        })
            .then((resp) => {
                console.log(resp)
                res.send(resp.data)
            })
            .catch((err) => {
                console.log(err)
                res.send(err)
            })
    }

    static createLLCMembers = async (req, res) => {
        const response = await axios.post("http://127.0.0.1:1337/llc-members", req.body, {
            headers: {
                Authorization: 'Bearer ' + process.env.STRAPI_TOKEN,
            }
        })
            .then((resp) => {
                console.log(resp)
                res.send(resp.data)
            })
            .catch((err) => {
                console.log(err)
                res.send(err)
            })
    }

    static createCreditCardInfo = async (req, res) => {
        const response = await axios.post("http://127.0.0.1:1337/credit-card-infos", req.body, {
            headers: {
                Authorization: 'Bearer ' + process.env.STRAPI_TOKEN,
            }
        })
            .then((resp) => {
                console.log(resp)
                res.send(resp.data)
            })
            .catch((err) => {
                console.log(err)
                res.send(err)
            })
    }

    static getUserDetails = async (req, res) => {
        try {
            const data = await userRegistrationModel.find()
            console.log("$$$$$$$$$$$$$$$$$$"+data)
            res.send(data)
        } catch (error) {
            console.log(error)
            res.status(500).send({ "status": "failed" })
        }
    }

    static createForm = async (req, res) => {
        const { state, companyType, formFieldCollection, templateUrl } = req.body
        try {
            const data = new formModel({

                state: state,
                companyType: companyType,
                formFieldCollection: formFieldCollection,
                templateUrl: templateUrl,
            })
            await data.save()
            res.status(201).send(data)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }

    static getAllForm =async (req,res)=>{
        try {
            const data = await formModel.find()
            res.status(200).send(data)
        } catch (error) {
            res.status(500).send(error)
        }
    }

    static getUrl = async (req,res)=>{
        console.log(req.query)
    }

}








export default Usercontroller;
