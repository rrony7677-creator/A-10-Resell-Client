"use server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const siteUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";
const apiBaseUrl =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

// response JSON না হলে (404 HTML page ইত্যাদি) exact URL+status+body সহ error throw করবে
const safeFetchJson = async (url, options) => {
  const res = await fetch(url, options);
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(
      `Non-JSON response\nURL: ${url}\nStatus: ${res.status}\nBody: ${text.slice(0, 150)}`
    );
  }
};

export const getBuyerPayments = async (buyerId) => {
  return safeFetchJson(`${apiBaseUrl}/api/payments?buyerId=${buyerId}`, { cache: "no-store" });
};

export const createCheckoutSession = async ({ product, buyer, quantity = 1 }) => {
  try {
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
            unit_amount: Math.round(product.price * 100),
          },
          quantity,
        },
      ],
      success_url: `${siteUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/products/${product._id}`,
      metadata: {
        productId: String(product._id),
        sellerId: String(product.sellerId),
        buyerId: String(buyer.id),
        buyerName: String(buyer.name || ""),
        buyerEmail: String(buyer.email || ""),
        quantity: String(quantity),
      },
    });
    return { url: session.url };
  } catch (err) {
    console.error("createCheckoutSession error:", err.message);
    return { url: null, error: err.message };
  }
};

export const verifyPaymentAndCreateOrder = async (sessionId) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return { success: false, message: "Payment not completed yet" };
    }

    const { productId, sellerId, buyerId, buyerName, buyerEmail, quantity } = session.metadata || {};
    if (!productId || !buyerId) {
      return { success: false, message: "Missing metadata on Stripe session" };
    }
    const qty = parseInt(quantity, 10) || 1;

    // Idempotency check — same session দিয়ে দুইবার order না বানানোর জন্য
    const existingPayments = await safeFetchJson(
      `${apiBaseUrl}/api/payments?transactionCheck=${session.payment_intent}`,
      { cache: "no-store" }
    );
    if (Array.isArray(existingPayments) && existingPayments.length > 0) {
      return {
        success: true,
        order: { productTitle: existingPayments[0]?.productTitle, price: existingPayments[0]?.amount },
      };
    }

    const product = await safeFetchJson(`${apiBaseUrl}/api/products/${productId}`, { cache: "no-store" });

    const orderPayload = {
      productId,
      productTitle: product?.title || "Product",
      productImage: product?.imageUrls?.[0] || "",
      price: session.amount_total / 100,
      quantity: qty,
      sellerId,
      buyerInfo: { userId: buyerId, name: buyerName, email: buyerEmail },
      paymentStatus: "paid",
      orderStatus: "pending",
    };

    const orderRes = await safeFetchJson(`${apiBaseUrl}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });

    if (!orderRes?.insertedId) {
      return { success: false, message: `Failed to save order: ${JSON.stringify(orderRes)}` };
    }

    if (product?.stockQuantity != null) {
      await safeFetchJson(`${apiBaseUrl}/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stockQuantity: Math.max(0, product.stockQuantity - qty) }),
      });
    }

    await safeFetchJson(`${apiBaseUrl}/api/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: orderRes.insertedId,
        transactionId: session.payment_intent,
        amount: session.amount_total / 100,
        paymentStatus: "success",
        paymentMethod: "card",
        buyerId,
        productTitle: orderPayload.productTitle,
      }),
    });

    return { success: true, order: orderPayload };
  } catch (err) {
    console.error("verifyPaymentAndCreateOrder FATAL error:", err);
    return { success: false, message: err.message || "Unknown server error" };
  }
};




// "use server";

// import Stripe from "stripe";
// import { getProductById, updateProduct } from "@/lib/actions/products";
// import { createOrder } from "@/lib/actions/orders";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// const siteUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";
// const apiBaseUrl =
//   process.env.API_BASE_URL ||
//   process.env.NEXT_PUBLIC_API_BASE_URL ||
//   "http://localhost:5000";

// export const getBuyerPayments = async (buyerId) => {
//   const res = await fetch(`${apiBaseUrl}/api/payments?buyerId=${buyerId}`, { cache: "no-store" });
//   return res.json();
// };

// const createPaymentRecord = async (paymentData) => {
//   const res = await fetch(`${apiBaseUrl}/api/payments`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(paymentData),
//   });
//   return res.json();
// };

// export const createCheckoutSession = async ({ product, buyer, quantity = 1 }) => {
//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: product.title,
//               images: product.imageUrls?.[0] ? [product.imageUrls[0]] : [],
//             },
//             unit_amount: Math.round(product.price * 100),
//           },
//           quantity,
//         },
//       ],
//       success_url: `${siteUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${siteUrl}/products/${product._id}`,
//       metadata: {
//         productId: String(product._id),
//         sellerId: String(product.sellerId),
//         buyerId: String(buyer.id),
//         buyerName: String(buyer.name || ""),
//         buyerEmail: String(buyer.email || ""),
//         quantity: String(quantity),
//       },
//     });
//     return { url: session.url };
//   } catch (err) {
//     console.error("createCheckoutSession error:", err.message);
//     return { url: null, error: err.message };
//   }
// };

// export const verifyPaymentAndCreateOrder = async (sessionId) => {
//   try {
//     const session = await stripe.checkout.sessions.retrieve(sessionId);

//     if (session.payment_status !== "paid") {
//       return { success: false, message: "Payment not completed yet" };
//     }

//     const { productId, sellerId, buyerId, buyerName, buyerEmail, quantity } = session.metadata || {};
//     if (!productId || !buyerId) {
//       return { success: false, message: "Missing metadata on Stripe session" };
//     }
//     const qty = parseInt(quantity, 10) || 1;

//     // Idempotency check — যদি এই session_id দিয়ে আগেই payment record বানানো হয়ে থাকে, আবার বানাবে না
//     const existingCheck = await fetch(`${apiBaseUrl}/api/payments?transactionCheck=${session.payment_intent}`, { cache: "no-store" });
//     const existingPayments = await existingCheck.json().catch(() => []);
//     if (Array.isArray(existingPayments) && existingPayments.length > 0) {
//       return {
//         success: true,
//         order: {
//           productTitle: existingPayments[0]?.productTitle,
//           price: existingPayments[0]?.amount,
//         },
//       };
//     }

//     const product = await getProductById(productId);
//     if (!product || product.error) {
//       console.error("verifyPaymentAndCreateOrder: product not found for id", productId);
//       return { success: false, message: "Product not found while creating order" };
//     }

//     const orderPayload = {
//       productId,
//       productTitle: product?.title || "Product",
//       productImage: product?.imageUrls?.[0] || "",
//       price: session.amount_total / 100,
//       quantity: qty,
//       sellerId,
//       buyerInfo: { userId: buyerId, name: buyerName, email: buyerEmail },
//       paymentStatus: "paid",
//       orderStatus: "pending",
//     };

//     const orderRes = await createOrder(orderPayload);
//     if (!orderRes?.insertedId) {
//       console.error("verifyPaymentAndCreateOrder: createOrder failed", orderRes);
//       return { success: false, message: "Failed to save order to database" };
//     }

//     if (product.stockQuantity != null) {
//       await updateProduct(productId, {
//         stockQuantity: Math.max(0, product.stockQuantity - qty),
//       });
//     }

//     await createPaymentRecord({
//       orderId: orderRes.insertedId,
//       transactionId: session.payment_intent,
//       amount: session.amount_total / 100,
//       paymentStatus: "success",
//       paymentMethod: "card",
//       buyerId,
//       productTitle: orderPayload.productTitle,
//     });

//     return { success: true, order: orderPayload };
//   } catch (err) {
//     console.error("verifyPaymentAndCreateOrder FATAL error:", err);
//     return { success: false, message: err.message || "Unknown server error" };
//   }
// };


