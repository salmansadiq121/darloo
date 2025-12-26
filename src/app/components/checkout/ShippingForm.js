"use client";
import React, { useState } from "react";
import {
  MapPin,
  User,
  Mail,
  Phone,
  Edit2,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

export default function ShippingForm({
  user,
  shippingAddress,
  onAddressChange,
  onSave,
  isEditing: externalIsEditing,
  setIsEditing: setExternalIsEditing,
}) {
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const isEditing =
    externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;
  const setIsEditing = setExternalIsEditing || setInternalIsEditing;

  const [formData, setFormData] = useState({
    firstName: user?.name || shippingAddress?.firstName || "",
    lastName: user?.lastName || shippingAddress?.lastName || "",
    email: user?.email || shippingAddress?.email || "",
    phone: user?.number || shippingAddress?.phone || "",
    address: user?.address || shippingAddress?.address || "",
    city: user?.city || shippingAddress?.city || "",
    state: user?.state || shippingAddress?.state || "",
    postalCode: user?.postalCode || shippingAddress?.postalCode || "",
    country: user?.country || shippingAddress?.country || "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name required";
    if (!formData.email.trim()) newErrors.email = "Email required";
    if (!formData.phone.trim()) newErrors.phone = "Phone required";
    if (!formData.address.trim()) newErrors.address = "Address required";
    if (!formData.city.trim()) newErrors.city = "City required";
    if (!formData.country.trim()) newErrors.country = "Country required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave?.(formData);
      onAddressChange?.(formData);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.name || shippingAddress?.firstName || "",
      lastName: user?.lastName || shippingAddress?.lastName || "",
      email: user?.email || shippingAddress?.email || "",
      phone: user?.number || shippingAddress?.phone || "",
      address: user?.address || shippingAddress?.address || "",
      city: user?.city || shippingAddress?.city || "",
      state: user?.state || shippingAddress?.state || "",
      postalCode: user?.postalCode || shippingAddress?.postalCode || "",
      country: user?.country || shippingAddress?.country || "",
    });
    setErrors({});
    setIsEditing(false);
  };

  const inputClasses = (fieldName) =>
    `w-full px-3 py-2 text-sm border rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-red-500 ${
      errors[fieldName]
        ? "border-red-500 bg-red-50"
        : "border-gray-200 bg-white"
    } ${!isEditing ? "bg-gray-50 cursor-default" : ""}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-500" />
          <h3 className="font-semibold text-gray-800">Shipping Information</h3>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
            >
              <Check className="w-4 h-4" />
              Save
            </button>
          </div>
        )}
      </div>

      {/* Form */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              First Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                readOnly={!isEditing}
                className={`${inputClasses("firstName")} pl-9`}
                placeholder="John"
              />
            </div>
            {errors.firstName && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              readOnly={!isEditing}
              className={inputClasses("lastName")}
              placeholder="Doe"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Email *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                readOnly={!isEditing}
                className={`${inputClasses("email")} pl-9`}
                placeholder="john@example.com"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Phone *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                readOnly={!isEditing}
                className={`${inputClasses("phone")} pl-9`}
                placeholder="+1 234 567 890"
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.phone}
              </p>
            )}
          </div>

          {/* Address - Full Width */}
          <div className="sm:col-span-2">
            <label className="block text-xs text-gray-500 mb-1">
              Street Address *
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              readOnly={!isEditing}
              className={inputClasses("address")}
              placeholder="123 Main Street, Apt 4B"
            />
            {errors.address && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.address}
              </p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">City *</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              readOnly={!isEditing}
              className={inputClasses("city")}
              placeholder="New York"
            />
            {errors.city && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.city}
              </p>
            )}
          </div>

          {/* State */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              State/Province
            </label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
              readOnly={!isEditing}
              className={inputClasses("state")}
              placeholder="NY"
            />
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Postal Code
            </label>
            <input
              type="text"
              value={formData.postalCode}
              onChange={(e) =>
                setFormData({ ...formData, postalCode: e.target.value })
              }
              readOnly={!isEditing}
              className={inputClasses("postalCode")}
              placeholder="10001"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Country *
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              readOnly={!isEditing}
              className={inputClasses("country")}
              placeholder="United States"
            />
            {errors.country && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.country}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
