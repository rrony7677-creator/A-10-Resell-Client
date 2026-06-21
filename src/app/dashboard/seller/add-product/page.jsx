"use client";

import React, { useState } from "react";
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
import { Briefcase, Picture } from "@gravity-ui/icons";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createProduct } from "@/lib/actions/products";
import { useRequireRole } from "@/lib/hooks/useRequireRole";
import { uploadToImgbb } from "@/lib/utils/uploadImage";

export default function AddProductPage() {
  // const [mockSeller] = useState({
  //   name: "Alex Rivera",
  //   role: "Seller",
  //   id: "seller_9912",
  // });

  const { session, isPending } = useRequireRole("seller");
  console.log("session", session);

  const [errors, setErrors] = useState({});
  const router = useRouter();

  const [imageFiles, setImageFiles] = useState([null, null, null]);
  const [imagePreviews, setImagePreviews] = useState([null, null, null]);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (index, file) => {
    if (!file) return;
    const newFiles = [...imageFiles];
    newFiles[index] = file;
    setImageFiles(newFiles);

    const newPreviews = [...imagePreviews];
    newPreviews[index] = URL.createObjectURL(file);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) return;

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const newErrors = {};
    if (!data.productTitle)
      newErrors.productTitle = "Product title is required";
    if (!data.category) newErrors.category = "Category choice is required";
    if (!data.condition) newErrors.condition = "Condition metric is required";
    if (!data.price) newErrors.price = "Product listing price is required";
    if (!data.stockQuantity)
      newErrors.stockQuantity = "Stock quantity is required";
    if (!data.description)
      newErrors.description = "Product description details are required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    if (!imageFiles[0]) {
      setErrors((prev) => ({
        ...prev,
        image: "Main product image is required",
      }));
      return;
    }

    setUploading(true);
    const uploadedUrls = [];
    try {
      for (const file of imageFiles) {
        if (file) {
          const url = await uploadToImgbb(file);
          uploadedUrls.push(url);
        }
      }
    } catch (err) {
      toast.error("Image upload failed, please try again");
      setUploading(false);
      return;
    }
    setUploading(false);

    const payload = {
      title: data.productTitle,
      category: data.category,
      condition: data.condition,
      price: parseFloat(data.price),
      stockQuantity: parseInt(data.stockQuantity, 10),
      description: data.description,
      imageUrls: uploadedUrls,
      // sellerId: mockSeller.id,
      sellerId: session.user?.id,
      sellerName: session.user.name,
      status: "pending_review",
    };
    console.log("Submitting product:", payload);

    const res = await createProduct(payload);
    if (res?.insertedId || res?.success) {
      toast.success("Product submitted successfully!");
      e.target.reset();
      // redirect("/dashboard/seller");
      router.push("/dashboard/seller/my-product");
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

  if (isPending || !session) {
    return (
      <div className="min-h-screen bg-[#0d0d0e] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0e] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-[#121214] border border-zinc-900 rounded-xl p-8 shadow-2xl">
        <div className="border-b border-zinc-800 pb-6 mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            Add New Product
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Fill out your inventory fields below to launch your product catalog
            listing.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-400">
            <Briefcase size={14} className="text-zinc-500" />
            Listing profile:{" "}
            <span className="font-semibold text-zinc-300">
              {session?.user?.name}
            </span>
            <span className="text-blue-500 font-medium bg-blue-950/30 px-1.5 py-0.5 rounded border border-blue-900/50">
              {session?.user?.role}
            </span>
          </div>
        </div>

        <Form
          onSubmit={handleSubmit}
          className="space-y-8"
          validationErrors={errors}
          validationBehavior="aria"
        >
          <Fieldset className="space-y-6 w-full">
            {/* 1. Product Title */}
            <TextField
              name="productTitle"
              isInvalid={!!errors.productTitle}
              className="flex flex-col gap-1 w-full"
            >
              <Label className="text-zinc-400 font-medium text-sm">
                Product Title *
              </Label>
              <Input
                placeholder="e.g. iPhone 13 Pro Max"
                className={textInputClass}
              />
              {errors.productTitle && (
                <FieldError className="text-xs text-danger mt-1">
                  {errors.productTitle}
                </FieldError>
              )}
            </TextField>

            {/* 2. Category & Condition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                className={selectBoxClass}
                name="category"
                isInvalid={!!errors.category}
              >
                <Label className="text-zinc-400 font-medium text-sm mb-1 block">
                  Category *
                </Label>
                <Select.Trigger className={triggerClasses}>
                  <Select.Value className="text-white placeholder:text-zinc-600" />
                  <Select.Indicator />
                </Select.Trigger>
                {errors.category && (
                  <span className="text-xs text-danger mt-1">
                    {errors.category}
                  </span>
                )}
                <Select.Popover className={popoverClasses}>
                  <ListBox className="outline-none">
                    <ListBox.Item
                      id="electronics"
                      className={listItemClasses}
                      textValue="Electronics"
                    >
                      Electronics
                    </ListBox.Item>
                    <ListBox.Item
                      id="furniture"
                      className={listItemClasses}
                      textValue="Furniture"
                    >
                      Furniture
                    </ListBox.Item>
                    <ListBox.Item
                      id="fashion"
                      className={listItemClasses}
                      textValue="Fashion & Apparel"
                    >
                      Fashion & Apparel
                    </ListBox.Item>
                    <ListBox.Item
                      id="vehicles"
                      className={listItemClasses}
                      textValue="Vehicles"
                    >
                      Vehicles
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>

              <Select
                className={selectBoxClass}
                name="condition"
                isInvalid={!!errors.condition}
              >
                <Label className="text-zinc-400 font-medium text-sm mb-1 block">
                  Condition *
                </Label>
                <Select.Trigger className={triggerClasses}>
                  <Select.Value className="text-white placeholder:text-zinc-600" />
                  <Select.Indicator />
                </Select.Trigger>
                {errors.condition && (
                  <span className="text-xs text-danger mt-1">
                    {errors.condition}
                  </span>
                )}
                <Select.Popover className={popoverClasses}>
                  <ListBox className="outline-none">
                    <ListBox.Item
                      id="used"
                      className={listItemClasses}
                      textValue="Used"
                    >
                      Used
                    </ListBox.Item>
                    <ListBox.Item
                      id="like-new"
                      className={listItemClasses}
                      textValue="Like New"
                    >
                      Like New
                    </ListBox.Item>
                    <ListBox.Item
                      id="refurbished"
                      className={listItemClasses}
                      textValue="Refurbished"
                    >
                      Refurbished
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            {/* 3. Price & Stock Quantity (Fixed React Warning Here) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextField
                name="price"
                isInvalid={!!errors.price}
                className="flex flex-col gap-1 w-full"
              >
                <Label className="text-zinc-400 font-medium text-sm">
                  Price (USD) *
                </Label>
                <Input
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  className={textInputClass}
                />
                {errors.price && (
                  <FieldError className="text-xs text-danger mt-1">
                    {errors.price}
                  </FieldError>
                )}
              </TextField>

              <TextField
                name="stockQuantity"
                isInvalid={!!errors.stockQuantity}
                defaultValue="1"
                className="flex flex-col gap-1 w-full"
              >
                <Label className="text-zinc-400 font-medium text-sm">
                  Stock Quantity *
                </Label>
                <Input
                  placeholder="1"
                  type="number"
                  className={textInputClass}
                />
                {errors.stockQuantity && (
                  <FieldError className="text-xs text-danger mt-1">
                    {errors.stockQuantity}
                  </FieldError>
                )}
              </TextField>
            </div>

            {/* 4. Description */}
            <TextField
              name="description"
              isInvalid={!!errors.description}
              className="flex flex-col gap-1 w-full"
            >
              <Label className="text-zinc-400 font-medium text-sm">
                Description *
              </Label>
              <TextArea
                placeholder="Describe your product in detail..."
                rows={5}
                className={textAreaClass}
              />
              {errors.description && (
                <FieldError className="text-xs text-danger mt-1">
                  {errors.description}
                </FieldError>
              )}
            </TextField>

            {/* 5. Product Images URLs */}
            {/* <div className="space-y-4">
              <Label className="text-zinc-400 font-medium text-sm flex items-center gap-2">
                <Picture size={16} className="text-zinc-500" /> Product Images
                (URLs)
              </Label>

              <div className="flex flex-col gap-3">
                <TextField name="imageUrl1" className="w-full">
                  <Input
                    placeholder="Image URL 1 (main)"
                    className={textInputClass}
                  />
                </TextField>
                <TextField name="imageUrl2" className="w-full">
                  <Input
                    placeholder="Image URL 2 (optional)"
                    className={textInputClass}
                  />
                </TextField>
                <TextField name="imageUrl3" className="w-full">
                  <Input
                    placeholder="Image URL 3 (optional)"
                    className={textInputClass}
                  />
                </TextField>
                <p className="text-zinc-500 text-xs italic">
                  Leave blank to use a default placeholder image layout.
                </p>
              </div>
            </div> */}
            <div className="space-y-4">
              <Label className="text-zinc-400 font-medium text-sm flex items-center gap-2">
                <Picture size={16} className="text-zinc-500" /> Product Images *
              </Label>

              <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2].map((index) => (
                  <div key={index}>
                    <input
                      type="file"
                      accept="image/*"
                      id={`image-${index}`}
                      className="hidden"
                      onChange={(e) =>
                        handleImageChange(index, e.target.files[0])
                      }
                    />
                    <label
                      htmlFor={`image-${index}`}
                      className="aspect-square flex items-center justify-center rounded-lg border border-dashed border-zinc-700 bg-[#1c1c1e] hover:bg-[#242426] cursor-pointer overflow-hidden"
                    >
                      {imagePreviews[index] ? (
                        <img
                          src={imagePreviews[index]}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-zinc-500 text-xs text-center px-2">
                          {index === 0 ? "Main Image *" : `Image ${index + 1}`}
                        </span>
                      )}
                    </label>
                  </div>
                ))}
              </div>
              {errors.image && (
                <p className="text-xs text-danger">{errors.image}</p>
              )}
              <p className="text-zinc-500 text-xs italic">
                প্রথম ছবিটা main image হিসেবে ব্যবহার হবে।
              </p>
            </div>
          </Fieldset>

          <div className="rounded-xl bg-orange-500/10 border border-orange-500/20 p-4 text-xs text-orange-400">
            <strong>Note:</strong> Your listed product parameters will be
            verified and reviewed by an admin system panel operator before going
            live on the customer portal views.
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800 w-full">
            <Button
              type="button"
              variant="bordered"
              className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 rounded-lg px-6 font-medium h-11"
            >
              Cancel
            </Button>
            {/* <Button
              type="submit"
              className="bg-blue-600 text-white font-semibold hover:bg-blue-700 rounded-lg px-6 transition-colors h-11"
            >
              List Product
            </Button> */}
            <Button
              type="submit"
              isDisabled={uploading}
              className="bg-blue-600 text-white font-semibold hover:bg-blue-700 rounded-lg px-6 transition-colors h-11"
            >
              {uploading ? "Uploading images..." : "List Product"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
