import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_TOKEN);

class PaymentController {
    static createPayment = async (req, res) => {
        const { product } = req.body;

        const lineItems = product.map((val) => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: val.productListing.displayName
                    },
                    unit_amount: Math.round(val.productListing.unitPrice * 100)
                },
                quantity: 1
            }

        })
        // const lineItems =   [
        //     {
        //         price_data: {
        //             currency: "usd",
        //             product_data: {
        //                 name: "Laptop"  
        //             },
        //             unit_amount: Math.round(amount * 100) 
        //         },
        //         quantity: 1
        //     }
        // ];

        try {

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: lineItems,
                mode: "payment",
                success_url: `http://localhost:3000/#/payment-success`,
                cancel_url: "http://localhost:3000/#/payment-failed"
            });

            console.log(session)

            // Send the session ID in the response
            res.status(200).json({ id: session.id,product:product,clientSecret:session });
        } catch (error) {
            // Handle the error
            console.error("Stripe error:", error);
            res.status(500).json({ error: error.message });
        }
    }

    static createNewPay=async (req,res)=>{
        try {
            // You can pass in amount, currency, and other details like orderId here
            const { amount, currency, orderId } = req.body;
    
            // Create a Payment Intent with Stripe
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,  // Amount in cents
                currency: currency,
                metadata: { orderId: orderId }  // Adding custom metadata (order ID)
            });
    
            res.status(200).json({
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

export default PaymentController;
