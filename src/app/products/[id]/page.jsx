"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { getProductById } from "@/lib/actions/products";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        if (!data || data.status !== "available") {
          toast.error("Product not available");
          router.push("/products");
          return;
        }
        setProduct(data);
      } catch (err) {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, router]);

  const handleBuyNow = () => {
    router.push(`/checkout/${id}`); 
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0d0d0e] text-white flex items-center justify-center">Loading...</div>;
  }
  if (!product) return null;

  const images = product.imageUrls?.length ? product.imageUrls : ["/placeholder-product.png"];

  return (
    <div className="min-h-screen bg-[#0d0d0e] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <div className="aspect-square bg-[#121214] border border-zinc-900 rounded-xl overflow-hidden">
            <img src={images[activeImage]} alt={product.title} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border ${i === activeImage ? "border-blue-500" : "border-zinc-800"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-full border border-zinc-700 bg-zinc-800 text-zinc-300 capitalize">{product.condition}</span>
            <span className="text-xs px-2 py-1 rounded-full border border-zinc-700 bg-zinc-800 text-zinc-300 capitalize">{product.category}</span>
          </div>

          <h1 className="text-3xl font-semibold">{product.title}</h1>
          <p className="text-2xl font-bold text-blue-400">${product.price}</p>
          <p className="text-zinc-400 text-sm leading-relaxed">{product.description}</p>
          <div className="text-sm text-zinc-500">
            Stock available: <span className="text-zinc-300">{product.stockQuantity}</span>
          </div>

          {product.sellerName && (
            <div className="border-t border-zinc-800 pt-4 mt-2 text-sm text-zinc-400">
              Sold by <span className="text-zinc-200 font-medium">{product.sellerName}</span>
            </div>
          )}

          <button
            onClick={handleBuyNow}
            disabled={product.stockQuantity < 1}
            className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg h-12 font-semibold transition-colors"
          >
            {product.stockQuantity < 1 ? "Out of Stock" : "Buy Now"}
          </button>
        </div>
      </div>
    </div>
  );
}