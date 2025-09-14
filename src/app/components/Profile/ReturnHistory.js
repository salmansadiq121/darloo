"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronRight,
  Package,
  Calendar,
  User,
  MessageSquare,
  ImageIcon,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import Image from "next/image";
import { GiReturnArrow } from "react-icons/gi";

export default function ReturnHistory({ userId }) {
  const [returnHistory, setReturnHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedItems, setExpandedItems] = useState(new Set());

  // Mock data for demonstration since API might not be available
  useEffect(() => {
    const fetchReturnHistory = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/order/return/products?page=1&limit=30?user=${userId}`
        );
        setReturnHistory(data.returnProducts);
      } catch (error) {
        setError(error.response.data);
      } finally {
        setLoading(false);
      }
    };
    fetchReturnHistory();
  }, [userId]);

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getReasonBadgeColor = (reason) => {
    switch (reason.toLowerCase()) {
      case "wrong size":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "damaged":
        return "bg-red-100 text-red-800 border-red-200";
      case "defective":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "not as described":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-600 text-white p-6 rounded-t-lg">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <RotateCcw className="h-8 w-8" />
              Return History
            </h1>
            <p className="text-red-100 mt-2">Loading your return requests...</p>
          </div>
          <Card className="rounded-t-none border-t-0">
            <CardContent className="p-8">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Card className="border-red-200">
            <CardContent className="p-8 text-center">
              <div className="text-red-600 text-xl font-semibold">
                Error loading return history
              </div>
              <p className="text-gray-600 mt-2">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-red-600 text-white p-6 rounded-t-lg">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <RotateCcw className="h-8 w-8" />
            Return History
          </h1>
          <p className="text-red-100 mt-2">
            Manage and track all your product return requests
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>{returnHistory.length} Total Returns</span>
            </div>
          </div>
        </div>

        {/* Return History Table */}
        <Card className="rounded-t-none border-t-0">
          <CardContent className="p-0">
            {returnHistory.length === 0 ? (
              <div className="p-12 text-center">
                <RotateCcw className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No Return History
                </h3>
                <p className="text-gray-500">
                  You haven&apos;t made any return requests yet.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {returnHistory.map((returnItem) => (
                  <Collapsible
                    key={returnItem._id}
                    open={expandedItems.has(returnItem._id)}
                    onOpenChange={() => toggleExpanded(returnItem._id)}
                  >
                    <CollapsibleTrigger asChild>
                      <div className="p-6 hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            {/* Product Image */}
                            <div className="relative">
                              <img
                                src={
                                  returnItem.product.thumbnails ||
                                  "/placeholder.svg"
                                }
                                alt={returnItem.product.name}
                                className="w-16 h-16 object-cover rounded-lg border-2 border-red-100"
                              />
                              <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                                {returnItem.quantity}
                              </div>
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 line-clamp-1 w-full">
                                {returnItem.product.name}
                              </h3>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-red-600 font-bold">
                                  ${returnItem.product.price}
                                </span>
                                <Badge
                                  className={cn(
                                    "text-xs",
                                    getReasonBadgeColor(returnItem.reason)
                                  )}
                                >
                                  {returnItem?.reason}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(returnItem?.createdAt)}</span>
                              </div>
                            </div>

                            {/* Order ID
                            <div className="text-right">
                              <div className="text-sm text-gray-500">
                                Order ID
                              </div>
                              <div className="font-mono text-sm text-gray-900">
                                #{returnItem.order.slice(-8)}
                              </div>
                            </div> */}
                          </div>

                          {/* Expand Icon */}
                          <div className="ml-4">
                            {expandedItems.has(returnItem._id) ? (
                              <ChevronDown className="h-5 w-5 text-red-600" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="px-6 pb-6 bg-gray-50 border-t">
                        <div className="grid md:grid-cols-2 gap-6 mt-6">
                          {/* Customer Information */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                              <User className="h-4 w-4 text-red-600" />
                              Customer Information
                            </h4>
                            <div className="bg-white p-4 rounded-lg border">
                              <div className="space-y-2">
                                <div>
                                  <span className="text-sm text-gray-500">
                                    Name:
                                  </span>
                                  <span className="ml-2 font-medium">
                                    {returnItem.user.name}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-sm text-gray-500">
                                    Email:
                                  </span>
                                  <span className="ml-2 font-medium">
                                    {returnItem.user.email}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-sm text-gray-500">
                                    Return ID:
                                  </span>
                                  <span className="ml-2 font-mono text-sm">
                                    #{returnItem._id.slice(-8)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Return Comment */}
                            {returnItem.comment && (
                              <div>
                                <h5 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                                  <MessageSquare className="h-4 w-4 text-red-600" />
                                  Customer Comment
                                </h5>
                                <div className="bg-white p-4 rounded-lg border">
                                  <p className="text-gray-700 text-sm leading-relaxed">
                                    {returnItem.comment}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Return Images */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                              <ImageIcon className="h-4 w-4 text-red-600" />
                              Return Images ({returnItem?.images?.length})
                            </h4>
                            <div className="bg-white p-4 rounded-lg border">
                              {returnItem.images.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3">
                                  {returnItem.images.map((image, index) => (
                                    <div key={index} className="relative group">
                                      <Image
                                        src={image || "/placeholder.svg"}
                                        alt={`Return image ${index + 1}`}
                                        height={70}
                                        width={150}
                                        className="w-full h-24 object-cover rounded-lg border hover:shadow-md transition-shadow"
                                      />
                                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                                        <Button
                                          size="sm"
                                          variant="secondary"
                                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(image, "_blank");
                                          }}
                                        >
                                          View
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-8 text-gray-500">
                                  <ImageIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                  <p className="text-sm">No images provided</p>
                                </div>
                              )}
                            </div>

                            {/* Timeline */}
                            <div>
                              <h5 className="font-semibold text-gray-900 mb-2">
                                Timeline
                              </h5>
                              <div className="bg-white p-4 rounded-lg border">
                                <div className="space-y-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                    <div className="flex-1">
                                      <div className="text-sm font-medium">
                                        Return Requested
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {formatDate(returnItem.createdAt)}
                                      </div>
                                    </div>
                                  </div>
                                  {returnItem.updatedAt !==
                                    returnItem.createdAt && (
                                    <div className="flex items-center gap-3">
                                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                      <div className="flex-1">
                                        <div className="text-sm font-medium">
                                          Last Updated
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {formatDate(returnItem.updatedAt)}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* return_label */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                              <GiReturnArrow className="h-4 w-4 text-red-600" />
                              Return Instructions
                            </h4>
                            {returnItem?.return_label && (
                              <div className="bg-white p-4 rounded-lg border">
                                <strong>Return Label:</strong>
                                {returnItem?.return_label
                                  ? returnItem?.return_label
                                  : "No return label provided"}
                              </div>
                            )}
                            {returnItem?.return_instructions && (
                              <div className="bg-white p-4 rounded-lg border">
                                <strong>Return Instruction:</strong>
                                {returnItem?.return_instructions
                                  ? returnItem?.return_instructions
                                  : "No return instructions provided"}
                              </div>
                            )}
                            {returnItem?.reject_reason && (
                              <div className="bg-white p-4 rounded-lg border">
                                <strong>Return Reject Reason:</strong>
                                {returnItem?.reject_reason
                                  ? returnItem?.reject_reason
                                  : "No rejection reason provided"}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
