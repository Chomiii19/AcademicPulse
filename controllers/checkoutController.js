import Stripe from "stripe";
import catchAsync from "../utils/catchAsync.js";

export default catchAsync(async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url:
      "https://academicpulse.onrender.com/app/checkout-full-access/success",
    cancel_url: "https://academicpulse.onrender.com/app",
    customer_email: req.user.email,
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "php",
          product_data: {
            name: "AcademicPulse Full Feature Access",
            description:
              "Get access to your own server with its own database. Allow up to 1000 requests per hour.",
          },
          unit_amount: 49900,
        },
        quantity: 1,
      },
    ],
  });

  res.status(200).json({
    status: "Success",
    session,
  });
});
