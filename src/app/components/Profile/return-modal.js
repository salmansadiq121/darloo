"use client";
import { useState } from "react";
import { Upload, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { uploadImage } from "@/app/utils/Upload";

export default function ReturnModal({
  isOpen,
  onClose,
  onSubmit,
  orderId,
  productId,
  productName = "Product",
  productImage,
}) {
  const [returnData, setReturnData] = useState({
    order: orderId,
    product: productId,
    reason: "",
    images: [],
    comment: "",
  });
  const [loading, setLoading] = useState(false);

  const returnReasons = [
    "Product is damaged",
    "Wrong item received",
    "Wrong size",
    "Changed mind",
    "Quality issues",
    "Not as described",
    "Other",
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    uploadImage(
      file,
      (imageUrl) =>
        setReturnData((prev) => ({
          ...prev,
          images: [...prev.images, imageUrl],
        })),
      setLoading
    );
  };

  const removeImage = (index) => {
    setReturnData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!returnData.reason) {
      alert("Please select a reason for return");
      return;
    }
    onSubmit(returnData);

    // Reset form
  };

  const handleClose = () => {
    onClose();
    // Reset form on close
    setReturnData({
      order: orderId,
      product: productId,
      reason: "",
      images: [],
      comment: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Return Request
          </DialogTitle>
          <DialogDescription>
            Please provide details for your return request. We&apos;ll process
            it as soon as possible.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            {productImage && (
              <Image
                src={productImage || "/placeholder.svg"}
                alt={productName}
                width={60}
                height={60}
                className="rounded-md object-cover"
              />
            )}
            <div>
              <p className="font-medium text-sm">{productName}</p>
              <p className="text-xs text-gray-500">Order ID: {orderId}</p>
            </div>
          </div>

          {/* Return Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium">
              Reason for Return *
            </Label>
            <Select
              value={returnData.reason}
              onValueChange={(value) =>
                setReturnData((prev) => ({ ...prev, reason: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {returnReasons.map((reason) => (
                  <SelectItem key={reason} value={reason.toLowerCase()}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Additional Comments */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-sm font-medium">
              Additional Comments
            </Label>
            <Textarea
              id="comment"
              placeholder="Please provide any additional details about your return request..."
              value={returnData.comment}
              onChange={(e) =>
                setReturnData((prev) => ({ ...prev, comment: e.target.value }))
              }
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Upload Images (Minimum 1 image required)
            </Label>
            <p className="text-xs text-gray-500 mb-2">
              Upload up to 5 images to support your return request
            </p>

            <div className="space-y-3">
              {/* Upload Button */}
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
                  disabled={returnData.images.length >= 5 || loading}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload Images
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                </Button>
                <span className="text-xs text-gray-500">
                  {returnData.images.length}/5
                </span>
              </div>

              {/* Image Preview */}
              {returnData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {returnData.images.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={file || "/placeholder.svg"}
                          alt={`Return image ${index + 1}`}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-[0] cursor-pointer group-hover:opacity-[1] transition-opacity"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!returnData.reason}
            >
              Submit Return Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
