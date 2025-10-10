"use client";
import { useEffect, useState } from "react";
import {
  Check,
  Clock,
  Package,
  RefreshCw,
  Star,
  Truck,
  XCircle,
  AlertCircle,
  MapPin,
  CreditCard,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { format } from "date-fns";
import { PiPackageDuotone } from "react-icons/pi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import OrderCardSkeleton from "./OrderLoadingSkelton";
import AddReviewModal from "./ReviewModal";
import ReturnModal from "./return-modal";
import { Separator } from "@/components/ui/separator";

export default function OrdersHistory({ userId }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [orderId, setOrderId] = useState("");
  const [show, setShow] = useState(false);
  const [productId, setProductId] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState(null);
  const [returnData, setReturnData] = useState({
    order: "",
    product: "",
    reason: "",
    images: [],
    comment: "",
  });
  const returnReasons = [
    "product is damaged",
    "wrong item received",
    "wrong size",
    " changed mind",
    "other",
  ];

  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedReturnOrder, setSelectedReturnOrder] = useState(null);
  const [selectedReturnProduct, setSelectedReturnProduct] = useState(null);

  // Fetch Orders
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/order/user/orders/${userId}`
      );
      setOrders(data.orders);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  // Get Tracking Data
  const getTrackingData = async (trackingNumber) => {
    setLoading(true);
    setError(null);
    setTrackingData(null);

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/order/track?trackingNumber=${trackingNumber}`
      );
      const data = await res.json();

      if (data) {
        setTrackingData(data.details);
      } else {
        setError(data.message || "Tracking failed");
      }
    } catch (err) {
      console.error("❌ Error fetching tracking data:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trackingNumber) {
      getTrackingData(trackingNumber);
    }
  }, [trackingNumber]);

  // Handle Return
  const handleReturn = async (returnFormData) => {
    try {
      if (returnFormData.images.length === 0) {
        toast.error("Please upload at least one image");
        return;
      }
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/order/return/request/${returnFormData.order}`,
        returnFormData
      );

      if (data) {
        toast.success(
          "Your return request has been sent. We will contact you shortly.",
          { position: "top-left" }
        );
        fetchOrders();
        setShowReturnModal(false);
        setSelectedReturnOrder(null);
        setSelectedReturnProduct(null);
      } else {
        toast.error(data?.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error submitting return request:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  // Handle Return Click
  const handleReturnClick = (order, product = null) => {
    setSelectedReturnOrder(order);
    setSelectedReturnProduct(product);
    setShowReturnModal(true);
  };

  // Cancel Order
  const handleOrderCancelConfirmation = (orderId, status) => {
    Swal.fire({
      title: "Are you sure?",
      text:
        status === "Cancelled"
          ? "Do you want to cancel this order?"
          : "Do you want to return this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText:
        status === "Cancelled" ? "Yes, cancel order" : "Yes, return order",
    }).then((result) => {
      if (result.isConfirmed) {
        cancelOrder(orderId, status);
      }
    });
  };
  const cancelOrder = async (orderId, status) => {
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/order/cancel/request/${orderId}`,
        {
          orderStatus: status,
        }
      );
      if (data) {
        toast.success(
          status === "Cancelled"
            ? "Your order cancel request has been sent."
            : "Your order return request has been sent."
        );
        setOrderId("");
        fetchOrders();
      } else {
        toast.error(data?.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "processing":
        return <RefreshCw className="h-5 w-5 text-blue-500" />;
      case "packing":
        return <PiPackageDuotone className="h-5 w-5 text-lime-500" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-purple-500" />;
      case "delivered":
        return <Check className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "returned":
        return <Package className="h-5 w-5 text-orange-500" />;
      case "review":
        return <Star className="h-5 w-5 text-amber-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      processing: { color: "bg-blue-100 text-blue-800 border-blue-200" },
      packing: { color: "bg-lime-100 text-lime-800 border-lime-200" },
      shipped: { color: "bg-purple-100 text-purple-800 border-purple-200" },
      delivered: { color: "bg-green-100 text-green-800 border-green-200" },
      cancelled: { color: "bg-red-100 text-red-800 border-red-200" },
      returned: { color: "bg-orange-100 text-orange-800 border-orange-200" },
      review: { color: "bg-amber-100 text-amber-800 border-amber-200" },
    };

    return (
      <Badge
        variant="outline"
        className={`${statusConfig[status.toLowerCase()]?.color} capitalize`}
      >
        {status}
      </Badge>
    );
  };

  const OrderTimeline = ({ timeline }) => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Order Timeline
        </h3>
        <div className="relative space-y-6 pl-6">
          {/* Timeline line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border" />

          {timeline?.map((item, index) => (
            <div key={item._id} className="relative flex items-start gap-4">
              {/* Timeline dot */}
              <div className="absolute -left-6 flex h-4 w-4 items-center justify-center">
                <div
                  className={`h-3 w-3 rounded-full border-2 ${
                    index === timeline.length - 1
                      ? "bg-primary border-primary"
                      : "bg-muted border-border"
                  }`}
                />
              </div>

              {/* Timeline content */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status.toLowerCase())}
                  <p className="font-medium text-foreground capitalize">
                    {item.status}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(item.date), "MMM dd, yyyy • h:mm a")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const OrderDetailsSection = ({ order }) => {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {/* Shipping Information */}
        <div className="space-y-3 rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Shipping Address</h3>
          </div>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{order?.user?.name}</p>
            <p>{order?.shippingAddress?.address}</p>
            <p>
              {order?.shippingAddress?.city}, {order?.shippingAddress?.state}{" "}
              {order?.shippingAddress?.postalCode}
            </p>
            <p>{order?.shippingAddress?.country}</p>
            {order?.user?.number && (
              <p className="pt-1 font-medium text-foreground">
                Phone: {order?.user?.number}
              </p>
            )}
          </div>
        </div>

        {/* Payment Information */}
        <div className="space-y-3 rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Payment Details</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method:</span>
              <span className="font-medium text-foreground">
                {order?.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Status:</span>
              <Badge
                variant={
                  order?.paymentStatus === "Completed" ? "default" : "secondary"
                }
              >
                {order?.paymentStatus}
              </Badge>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium text-foreground">
                €
                {(
                  Number.parseFloat(order?.totalAmount) -
                  Number.parseFloat(order?.shippingFee || 0)
                ).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping Fee:</span>
              <span className="font-medium text-foreground">
                €{order?.shippingFee || "0.00"}
              </span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-base">
              <span className="font-semibold text-foreground">Total:</span>
              <span className="font-bold text-primary">
                €{order?.totalAmount}
              </span>
            </div>
          </div>
        </div>

        {/* Order Information */}
        {(order?.trackingId || order?.shippingCarrier) && (
          <div className="space-y-3 rounded-lg border bg-card p-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">
                Tracking Information
              </h3>
            </div>
            <div className="grid gap-2 text-sm md:grid-cols-2">
              {order?.trackingId && (
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Tracking ID:</span>
                  <span className="font-mono font-medium text-foreground">
                    {order?.trackingId}
                  </span>
                </div>
              )}
              {order?.shippingCarrier && (
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Carrier:</span>
                  <span className="font-medium text-foreground">
                    {order?.shippingCarrier}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>Orders History</CardTitle>
        <CardDescription>View and manage your orders</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="relative flex items-center justify-start gap-4 w-full   mb-6 overflow-x-auto shidden">
            <TabsTrigger
              value="all"
              className="text-xs md:text-sm min-w-fit cursor-pointer"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="Pending"
              className="text-xs md:text-sm min-w-fit px-2 cursor-pointer"
            >
              Pending
            </TabsTrigger>
            <TabsTrigger
              value="Processing"
              className="text-xs md:text-sm min-w-fit px-2 cursor-pointer"
            >
              Processing
            </TabsTrigger>
            <TabsTrigger
              value="Packing"
              className="text-xs md:text-sm min-w-fit px-2 cursor-pointer"
            >
              Packing
            </TabsTrigger>
            <TabsTrigger
              value="Shipped"
              className="text-xs md:text-sm min-w-fit px-2 cursor-pointer"
            >
              Shipped
            </TabsTrigger>
            <TabsTrigger
              value="Delivered"
              className="text-xs md:text-sm min-w-fit px-2 cursor-pointer"
            >
              Delivered
            </TabsTrigger>
            <TabsTrigger
              value="Cancelled"
              className="text-xs md:text-sm min-w-fit px-2 cursor-pointer"
            >
              Cancelled
            </TabsTrigger>
            <TabsTrigger
              value="Returned"
              className="text-xs md:text-sm min-w-fit px-2 cursor-pointer"
            >
              Returned
            </TabsTrigger>
            <TabsTrigger
              value="Reviewed"
              className="text-xs md:text-sm min-w-fit px-2 cursor-pointer"
            >
              Review
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {isLoading ? (
              <OrderCardSkeleton />
            ) : (
              orders?.map((order, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-4 p-4 border rounded-lg"
                >
                  <div className="flex flex-col md:flex-row items-start justify-between">
                    <div className="flex items-start gap-4 mb-4 md:mb-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        {getStatusIcon(order?.orderStatus?.toLowerCase())}
                      </div>
                      <div>
                        <div className="flex items-start sm:items-center flex-col-reverse sm:flex-row  gap-2">
                          <h3 className="font-medium">{order?._id}</h3>
                          {getStatusBadge(order?.orderStatus)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(order?.createdAt, "dd MM, yyyy")}
                        </p>
                        <p className="text-[15px] font-medium mt-1">
                          €{order?.totalAmount}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                      <Button
                        onClick={() => {
                          setOrderId((prev) =>
                            prev === order?._id ? "" : order?._id
                          );
                          setTrackingNumber(order?.trackingId);
                        }}
                        variant="outline"
                        size="sm"
                        className="text-xs cursor-pointer"
                      >
                        View Details
                      </Button>

                      {order?.orderStatus === "Delivered" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs flex items-center gap-1 text-orange-600 bg-transparent"
                          onClick={() => handleReturnClick(order)}
                        >
                          <Package className="h-3 w-3" />
                          Return
                        </Button>
                      )}
                      {(order?.orderStatus === "Pending" ||
                        order?.orderStatus === "Processing") && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs flex items-center gap-1 text-red-600 bg-transparent"
                          onClick={() =>
                            handleOrderCancelConfirmation(
                              order?._id,
                              "Cancelled"
                            )
                          }
                        >
                          <XCircle className="h-3 w-3" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                  {orderId === order?._id && (
                    <div className="flex flex-col gap-6 w-full overflow-hidden mt-4">
                      {/* Timeline Section */}
                      {order?.timeline && order.timeline.length > 0 && (
                        <div className="rounded-lg border bg-muted/30 p-4">
                          <OrderTimeline timeline={order.timeline} />
                        </div>
                      )}

                      {/* Shipping and Payment Details */}
                      <OrderDetailsSection order={order} />

                      {/* Products Section */}
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-foreground">
                          Order Items
                        </h3>
                        <div className="flex flex-col gap-3">
                          {order?.products?.map((product) => (
                            <div
                              key={product?._id}
                              className="flex flex-col sm:items-center justify-between sm:flex-row gap-5 p-3 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-all duration-300"
                            >
                              <div
                                className="flex items-center gap-3"
                                onClick={() =>
                                  router.push(
                                    `/products/${product?.product?._id}`
                                  )
                                }
                              >
                                <Image
                                  src={
                                    product?.product?.thumbnails ||
                                    "/placeholder.svg" ||
                                    "/placeholder.svg"
                                  }
                                  alt={product?.product?.name}
                                  width={80}
                                  height={70}
                                  className="rounded-md h-[70px] w-[80px] object-cover border"
                                />
                                <div>
                                  <p className="text-base font-medium line-clamp-1 w-full text-foreground">
                                    {product?.product?.name}
                                  </p>
                                  <div className="flex items-center gap-6 mt-1">
                                    <p className="text-sm font-semibold text-primary">
                                      €{product?.price}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      Qty: {product?.quantity}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              {order?.orderStatus === "Delivered" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setProductId(product?.product?._id);
                                    setShow(true);
                                  }}
                                  className="text-xs flex items-center gap-1 cursor-pointer group hover:text-amber-600 hover:border-amber-600 transition-all duration-300"
                                >
                                  <Star className="h-3 w-3 group-hover:text-amber-600 transition-all duration-300" />
                                  Review
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Comments Section */}
                      {order?.comments.length > 0 && (
                        <div className="space-y-3 rounded-lg border bg-card p-4">
                          <h3 className="text-lg font-semibold text-foreground">
                            Comments
                          </h3>
                          <div className="flex flex-col gap-4">
                            {order?.comments?.map((comment, index) => (
                              <div
                                key={index}
                                className="flex flex-col gap-2 border-b border-border pb-3 last:border-0"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                    <Image
                                      src={
                                        comment?.user?.avatar ||
                                        "/placeholder.svg" ||
                                        "/placeholder.svg"
                                      }
                                      width={40}
                                      height={40}
                                      alt="User avatar"
                                      className="object-cover w-full h-full"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <h4 className="text-sm font-medium text-foreground">
                                        {comment.user?.name || "Admin"}
                                      </h4>
                                      <span className="text-xs text-muted-foreground">
                                        {comment?.createdAt
                                          ? format(
                                              new Date(comment?.createdAt),
                                              "MMM dd, yyyy • h:mm a"
                                            )
                                          : "N/A"}
                                      </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {comment?.question}
                                    </p>

                                    {comment?.image && (
                                      <div className="mt-2 group">
                                        <div className="relative group cursor-pointer overflow-hidden w-fit">
                                          <div className="w-full max-w-[200px] h-auto rounded-md overflow-hidden border">
                                            <Image
                                              src={
                                                comment?.image ||
                                                "/placeholder.svg" ||
                                                "/placeholder.svg"
                                              }
                                              width={200}
                                              height={150}
                                              alt="Comment attachment"
                                              className="object-cover w-full h-full"
                                            />
                                          </div>
                                          <a
                                            href={comment?.image}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="absolute z-20 inset-0 rounded-lg bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center"
                                          >
                                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                                              View
                                            </span>
                                          </a>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
            {orders?.length === 0 && (
              <div className="w-full min-h-[40vh] flex items-center justify-center flex-col gap-2">
                <video
                  src="/no-items-13843399-11127022.mp4"
                  autoPlay
                  loop
                  muted
                />
                <p className="text-center text-muted-foreground">
                  You haven&apos;t placed any orders yet.
                </p>
              </div>
            )}
          </TabsContent>

          {[
            "Pending",
            "Processing",
            "Packing",
            "Shipped",
            "Delivered",
            "Cancelled",
            "Returned",
            "Reviewed",
          ].map((status) => (
            <TabsContent key={status} value={status} className="space-y-4">
              {orders
                .filter((order) => {
                  if (status === "Reviewed") {
                    return (
                      order?.orderStatus === "Delivered" &&
                      order?.isReviewed !== true
                    );
                  }
                  return order?.orderStatus === status;
                })
                .map((order) => (
                  <>
                    <div
                      key={order?._id}
                      className="flex flex-col gap-4 p-4 border rounded-lg"
                    >
                      <div className="flex flex-col md:flex-row items-start justify-between">
                        <div className="flex items-start gap-4 mb-4 md:mb-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                            {getStatusIcon(order?.orderStatus.toLowerCase())}
                          </div>
                          <div>
                            <div className="flex items-start sm:items-center flex-col-reverse sm:flex-row  gap-2">
                              <h3 className="font-medium">{order?._id}</h3>
                              {getStatusBadge(order?.orderStatus)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {format(order?.createdAt, "dd MM, yyyy")}
                            </p>
                            <p className="text-sm font-medium mt-1">
                              €{order?.totalAmount}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 w-full md:w-auto">
                          <Button
                            onClick={() => {
                              setOrderId((prev) =>
                                prev === order?._id ? "" : order?._id
                              );
                            }}
                            variant="outline"
                            size="sm"
                            className="text-xs cursor-pointer"
                          >
                            View Details
                          </Button>

                          {order?.orderStatus === "Delivered" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs flex items-center gap-1 text-orange-600 bg-transparent"
                              onClick={() => handleReturnClick(order)}
                            >
                              <Package className="h-3 w-3" />
                              Return
                            </Button>
                          )}
                          {(order?.orderStatus === "Pending" ||
                            order?.orderStatus === "Processing") && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs flex items-center gap-1 text-red-600 bg-transparent"
                              onClick={() =>
                                handleOrderCancelConfirmation(
                                  order?._id,
                                  "Cancelled"
                                )
                              }
                            >
                              <XCircle className="h-3 w-3" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>

                      {orderId === order?._id && (
                        <div className="flex flex-col gap-6 w-full overflow-hidden mt-4">
                          {/* Timeline Section */}
                          {order?.timeline && order.timeline.length > 0 && (
                            <div className="rounded-lg border bg-muted/30 p-4">
                              <OrderTimeline timeline={order.timeline} />
                            </div>
                          )}

                          {/* Shipping and Payment Details */}
                          <OrderDetailsSection order={order} />

                          {/* Products Section */}
                          <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-foreground">
                              Order Items
                            </h3>
                            <div className="flex flex-col gap-3">
                              {order?.products?.map((product) => (
                                <div
                                  key={product?._id}
                                  className="flex flex-col sm:items-center justify-between sm:flex-row gap-5 p-3 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-all duration-300"
                                >
                                  <div
                                    className="flex items-center gap-3"
                                    onClick={() =>
                                      router.push(
                                        `/products/${product?.product?._id}`
                                      )
                                    }
                                  >
                                    <Image
                                      src={
                                        product?.product?.thumbnails ||
                                        "/placeholder.svg" ||
                                        "/placeholder.svg"
                                      }
                                      alt={product?.product?.name}
                                      width={80}
                                      height={70}
                                      className="rounded-md h-[70px] w-[80px] object-cover border"
                                    />
                                    <div>
                                      <p className="text-base font-medium line-clamp-1 w-full text-foreground">
                                        {product?.product?.name}
                                      </p>
                                      <div className="flex items-center gap-6 mt-1">
                                        <p className="text-sm font-semibold text-primary">
                                          €{product?.price}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          Qty: {product?.quantity}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  {order?.orderStatus === "Delivered" && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setProductId(product?.product?._id);
                                        setShow(true);
                                      }}
                                      className="text-xs flex items-center gap-1 cursor-pointer group hover:text-amber-600 hover:border-amber-600 transition-all duration-300"
                                    >
                                      <Star className="h-3 w-3 group-hover:text-amber-600 transition-all duration-300" />
                                      Review
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Comments Section */}
                          {order?.comments.length > 0 && (
                            <div className="space-y-3 rounded-lg border bg-card p-4">
                              <h3 className="text-lg font-semibold text-foreground">
                                Comments
                              </h3>
                              <div className="flex flex-col gap-4">
                                {order?.comments?.map((comment, index) => (
                                  <div
                                    key={index}
                                    className="flex flex-col gap-2 border-b border-border pb-3 last:border-0"
                                  >
                                    <div className="flex items-start gap-3">
                                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                        <Image
                                          src={
                                            comment?.user?.avatar ||
                                            "/placeholder.svg" ||
                                            "/placeholder.svg"
                                          }
                                          width={40}
                                          height={40}
                                          alt="User avatar"
                                          className="object-cover w-full h-full"
                                        />
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                          <h4 className="text-sm font-medium text-foreground">
                                            {comment.user?.name || "Admin"}
                                          </h4>
                                          <span className="text-xs text-muted-foreground">
                                            {comment?.createdAt
                                              ? format(
                                                  new Date(comment?.createdAt),
                                                  "MMM dd, yyyy • h:mm a"
                                                )
                                              : "N/A"}
                                          </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">
                                          {comment?.question}
                                        </p>

                                        {comment?.image && (
                                          <div className="mt-2 group">
                                            <div className="relative group cursor-pointer overflow-hidden w-fit">
                                              <div className="w-full max-w-[200px] h-auto rounded-md overflow-hidden border">
                                                <Image
                                                  src={
                                                    comment?.image ||
                                                    "/placeholder.svg" ||
                                                    "/placeholder.svg"
                                                  }
                                                  width={200}
                                                  height={150}
                                                  alt="Comment attachment"
                                                  className="object-cover w-full h-full"
                                                />
                                              </div>
                                              <a
                                                href={comment?.image}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="absolute z-20 inset-0 rounded-lg bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center"
                                              >
                                                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                                                  View
                                                </span>
                                              </a>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>

      {/* Add Review Modal */}
      {show && (
        <AddReviewModal
          setShow={setShow}
          productId={productId}
          setProductId={setProductId}
        />
      )}

      {/* Return Modal */}
      {showReturnModal && selectedReturnOrder && (
        <ReturnModal
          isOpen={showReturnModal}
          onClose={() => {
            setShowReturnModal(false);
            setSelectedReturnOrder(null);
            setSelectedReturnProduct(null);
          }}
          onSubmit={handleReturn}
          orderId={selectedReturnOrder._id}
          productId={
            selectedReturnProduct?._id ||
            selectedReturnOrder.products[0]?.product?._id
          }
          productName={
            selectedReturnProduct?.name ||
            selectedReturnOrder.products[0]?.product?.name
          }
          productImage={
            selectedReturnProduct?.thumbnails ||
            selectedReturnOrder.products[0]?.product?.thumbnails
          }
        />
      )}
    </Card>
  );
}
