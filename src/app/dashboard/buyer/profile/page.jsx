"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { useRequireRole } from "@/lib/hooks/useRequireRole";
import { uploadToImgbb } from "@/lib/utils/uploadImage";

export default function ProfileSettingsPage() {
  const { session, isPending } = useRequireRole("buyer");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  React.useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setPhone(session.user.phone || "");
      setAddress(session.user.address || "");
      setPreview(session.user.image || null);
    }
  }, [session]);

  const handleImageChange = (file) => {
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = session.user.image;
      if (imageFile) {
        imageUrl = await uploadToImgbb(imageFile);
      }

      const { error } = await authClient.updateUser({
        name,
        phone,
        address,
        image: imageUrl,
      });

      if (error) {
        toast.error(error.message || "Failed to update profile");
      } else {
        toast.success("Profile updated successfully");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Please fill both password fields");
      return;
    }
    setChangingPassword(true);
    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        toast.error(error.message || "Failed to change password");
      } else {
        toast.success("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setChangingPassword(false);
    }
  };

  if (isPending) {
    return <div className="min-h-screen bg-[#0d0d0e] text-white flex items-center justify-center">Loading...</div>;
  }

  const inputClass =
    "w-full text-white bg-[#1c1c1e] border border-zinc-800 hover:bg-[#242426] focus:border-zinc-600 rounded-lg h-12 px-3 text-sm placeholder:text-zinc-600 outline-none transition-all";

  return (
    <div className="min-h-screen bg-[#0d0d0e] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="border-b border-zinc-800 pb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Profile Settings</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage your personal information.</p>
        </div>

        {/* Profile Info Form */}
        <form onSubmit={handleProfileSubmit} className="bg-[#121214] border border-zinc-900 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-zinc-800 overflow-hidden">
              {preview && <img src={preview} alt="" className="w-full h-full object-cover" />}
            </div>
            <label className="text-sm text-blue-400 hover:text-blue-300 cursor-pointer">
              Change photo
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e.target.files[0])} />
            </label>
          </div>

          <div>
            <label className="text-zinc-400 text-sm font-medium block mb-1">Full Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-zinc-400 text-sm font-medium block mb-1">Phone Number</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-zinc-400 text-sm font-medium block mb-1">Address</label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg h-11 px-6 font-semibold text-sm"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {/* Change Password Form */}
        <form onSubmit={handlePasswordSubmit} className="bg-[#121214] border border-zinc-900 rounded-xl p-6 space-y-5">
          <h2 className="font-medium">Change Password</h2>
          <div>
            <label className="text-zinc-400 text-sm font-medium block mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-zinc-400 text-sm font-medium block mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={changingPassword}
            className="border border-zinc-800 hover:bg-zinc-900 disabled:opacity-50 rounded-lg h-11 px-6 font-semibold text-sm"
          >
            {changingPassword ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}