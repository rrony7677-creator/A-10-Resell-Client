
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

export 
const getSellerProducts = async(sellerId,status="pending_review")=>{
const res = await fetch (`${baseUrl}/api/products?sellerId=${sellerId}&status=${status}`);
return res.json()
}
