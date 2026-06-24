"use server";

import Stripe from "stripe";
import { getProductById, updateProduct } from "@/lib/actions/products";
import { createOrder } from "@/lib/actions/orders";



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const siteUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000"; 
const apiBaseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:5000"; 

  export const getBuyerPayments = async (buyerId) => {
  const res = await fetch(`${apiBaseUrl}/api/payments?buyerId=${buyerId}`, { cache: "no-store" });
  return res.json();
};

const createPaymentRecord = async (paymentData) => {
  const res = await fetch(`${apiBaseUrl}/api/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paymentData),
  });
  return res.json();
};

export const createCheckoutSession = async ({ product, buyer, quantity = 1 }) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.title,
            images: product.imageUrls?.[0] ? [product.imageUrls[0]] : [],
          },
          unit_amount: Math.round(product.price * 100), // cents
        },
        quantity,
      },
    ],
    success_url: `${siteUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/products/${product._id}`,
    metadata: {
      productId: product._id,
      sellerId: product.sellerId,
      buyerId: buyer.id,
      buyerName: buyer.name,
      buyerEmail: buyer.email,
      quantity: String(quantity),
    },
  });

  return { url: session.url };
};

export const verifyPaymentAndCreateOrder = async (sessionId) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return { success: false, message: "Payment not completed" };
  }

  const { productId, sellerId, buyerId, buyerName, buyerEmail, quantity } = session.metadata;
  const qty = parseInt(quantity, 10);

  const product = await getProductById(productId);

  const orderPayload = {
    productId,
    productTitle: product?.title,
    productImage: product?.imageUrls?.[0] || "",
    price: session.amount_total / 100,
    quantity: qty,
    sellerId,
    buyerInfo: { userId: buyerId, name: buyerName, email: buyerEmail },
    paymentStatus: "paid",
    orderStatus: "pending",
  };

  const orderRes = await createOrder(orderPayload);

  if (product && product.stockQuantity != null) {
    await updateProduct(productId, {
      stockQuantity: Math.max(0, product.stockQuantity - qty),
    });
  }

  await createPaymentRecord({
    orderId: orderRes?.insertedId,
    transactionId: session.payment_intent,
    amount: session.amount_total / 100,
    paymentStatus: "success",
    paymentMethod: "card",
    buyerId,
  });

  return { success: true, order: orderPayload };

  
};