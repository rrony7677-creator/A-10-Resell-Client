"use client";

import React, { useEffect, useState } from "react";
import {
  Form,
  Fieldset,
  TextField,
  Label,
  Input,
  TextArea,
  FieldError,
  Select,
  ListBox,
  Button,
} from "@heroui/react";
import { Picture } from "@gravity-ui/icons";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { getProductById, updateProduct } from "@/lib/actions/products";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const newErrors = {};
    if (!data.productTitle) newErrors.productTitle = "Product title is required";
    if (!data.category) newErrors.category = "Category choice is required";
    if (!data.condition) newErrors.condition = "Condition metric is required";
    if (!data.price) newErrors.price = "Product listing price is required";
    if (!data.stockQuantity) newErrors.stockQuantity = "Stock quantity is required";
    if (!data.description) newErrors.description = "Product description details are required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const updatedData = {
      title: data.productTitle,
      category: data.category,
      condition: data.condition,
      price: parseFloat(data.price),
      stockQuantity: parseInt(data.stockQuantity, 10),
      description: data.description,
      imageUrls: [data.imageUrl1, data.imageUrl2, data.imageUrl3].filter(Boolean),
    };

    setSubmitting(true);
    try {
      const res = await updateProduct(id, updatedData);
      if (res?.modifiedCount > 0 || res?.acknowledged) {
        toast.success("Product updated successfully!");
        router.push("/dashboard/seller/my-product");
      } else {
        toast.error("Failed to update product");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const textInputClass =
    "w-full text-white bg-[#1c1c1e] border border-zinc-800 hover:bg-[#242426] focus:border-zinc-600 rounded-lg h-12 px-3 text-sm placeholder:text-zinc-600 outline-none transition-all";
  const textAreaClass =
    "w-full text-white bg-[#1c1c1e] border border-zinc-800 hover:bg-[#242426] focus:border-zinc-600 rounded-lg p-3 text-sm placeholder:text-zinc-600 outline-none transition-all";
  const selectBoxClass = "w-full";
  const triggerClasses =
    "w-full flex items-center justify-between bg-[#1c1c1e] border border-zinc-800 hover:bg-[#242426] h-12 rounded-lg px-3 text-white transition-all text-sm outline-none data-[focused=true]:border-zinc-600 data-[invalid=true]:border-danger";
  const popoverClasses =
    "bg-[#1c1c1e] border border-zinc-800 text-white rounded-lg shadow-xl p-1";
  const listItemClasses =
    "flex items-center justify-between p-2 rounded-md hover:bg-zinc-800 cursor-pointer text-sm text-zinc-200 outline-none data-[focused=true]:bg-zinc-800";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0e] text-white flex items-center justify-center">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0d0d0e] text-white flex items-center justify-center">
        Product not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0e] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-[#121214] border border-zinc-900 rounded-xl p-8 shadow-2xl">
        <div className="border-b border-zinc-800 pb-6 mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Edit Product</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Update your product details below.
          </p>
        </div>

        <Form
          onSubmit={handleSubmit}
          className="space-y-8"
          validationErrors={errors}
          validationBehavior="aria"
        >
          <Fieldset className="space-y-6 w-full">
            <TextField
              name="productTitle"
              isInvalid={!!errors.productTitle}
              defaultValue={product.title}
              className="flex flex-col gap-1 w-full"
            >
              <Label className="text-zinc-400 font-medium text-sm">
                Product Title *
              </Label>
              <Input className={textInputClass} />
              {errors.productTitle && (
                <FieldError className="text-xs text-danger mt-1">
                  {errors.productTitle}
                </FieldError>
              )}
            </TextField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                className={selectBoxClass}
                name="category"
                isInvalid={!!errors.category}
                defaultSelectedKey={product.category}
              >
                <Label className="text-zinc-400 font-medium text-sm mb-1 block">
                  Category *
                </Label>
                <Select.Trigger className={triggerClasses}>
                  <Select.Value className="text-white placeholder:text-zinc-600" />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover className={popoverClasses}>
                  <ListBox className="outline-none">
                    <ListBox.Item id="electronics" className={listItemClasses} textValue="Electronics">Electronics</ListBox.Item>
                    <ListBox.Item id="furniture" className={listItemClasses} textValue="Furniture">Furniture</ListBox.Item>
                    <ListBox.Item id="fashion" className={listItemClasses} textValue="Fashion & Apparel">Fashion & Apparel</ListBox.Item>
                    <ListBox.Item id="vehicles" className={listItemClasses} textValue="Vehicles">Vehicles</ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>

              <Select
                className={selectBoxClass}
                name="condition"
                isInvalid={!!errors.condition}
                defaultSelectedKey={product.condition}
              >
                <Label className="text-zinc-400 font-medium text-sm mb-1 block">
                  Condition *
                </Label>
                <Select.Trigger className={triggerClasses}>
                  <Select.Value className="text-white placeholder:text-zinc-600" />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover className={popoverClasses}>
                  <ListBox className="outline-none">
                    <ListBox.Item id="used" className={listItemClasses} textValue="Used">Used</ListBox.Item>
                    <ListBox.Item id="like-new" className={listItemClasses} textValue="Like New">Like New</ListBox.Item>
                    <ListBox.Item id="refurbished" className={listItemClasses} textValue="Refurbished">Refurbished</ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextField
                name="price"
                isInvalid={!!errors.price}
                defaultValue={String(product.price)}
                className="flex flex-col gap-1 w-full"
              >
                <Label className="text-zinc-400 font-medium text-sm">
                  Price (USD) *
                </Label>
                <Input type="number" step="0.01" className={textInputClass} />
                {errors.price && (
                  <FieldError className="text-xs text-danger mt-1">
                    {errors.price}
                  </FieldError>
                )}
              </TextField>

              <TextField
                name="stockQuantity"
                isInvalid={!!errors.stockQuantity}
                defaultValue={String(product.stockQuantity)}
                className="flex flex-col gap-1 w-full"
              >
                <Label className="text-zinc-400 font-medium text-sm">
                  Stock Quantity *
                </Label>
                <Input type="number" className={textInputClass} />
                {errors.stockQuantity && (
                  <FieldError className="text-xs text-danger mt-1">
                    {errors.stockQuantity}
                  </FieldError>
                )}
              </TextField>
            </div>

            <TextField
              name="description"
              isInvalid={!!errors.description}
              defaultValue={product.description}
              className="flex flex-col gap-1 w-full"
            >
              <Label className="text-zinc-400 font-medium text-sm">
                Description *
              </Label>
              <TextArea rows={5} className={textAreaClass} />
              {errors.description && (
                <FieldError className="text-xs text-danger mt-1">
                  {errors.description}
                </FieldError>
              )}
            </TextField>

            <div className="space-y-4">
              <Label className="text-zinc-400 font-medium text-sm flex items-center gap-2">
                <Picture size={16} className="text-zinc-500" /> Product Images (URLs)
              </Label>
              <div className="flex flex-col gap-3">
                <TextField name="imageUrl1" defaultValue={product.imageUrls?.[0] || ""} className="w-full">
                  <Input placeholder="Image URL 1 (main)" className={textInputClass} />
                </TextField>
                <TextField name="imageUrl2" defaultValue={product.imageUrls?.[1] || ""} className="w-full">
                  <Input placeholder="Image URL 2 (optional)" className={textInputClass} />
                </TextField>
                <TextField name="imageUrl3" defaultValue={product.imageUrls?.[2] || ""} className="w-full">
                  <Input placeholder="Image URL 3 (optional)" className={textInputClass} />
                </TextField>
              </div>
            </div>
          </Fieldset>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800 w-full">
            <Button
              type="button"
              variant="bordered"
              onPress={() => router.back()}
              className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 rounded-lg px-6 font-medium h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isDisabled={submitting}
              className="bg-blue-600 text-white font-semibold hover:bg-blue-700 rounded-lg px-6 transition-colors h-11"
            >
              {submitting ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}