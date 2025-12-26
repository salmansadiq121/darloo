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
  Store,
  ChevronDown,
  ChevronUp,
  Box,
  Copy,
  ExternalLink,
  ShoppingBag,
  CalendarDays,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Download,
  FileText,
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
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function OrdersHistory({ userId, countryCode }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [expandedOrderId, setExpandedOrderId] = useState("");
  const [show, setShow] = useState(false);
  const [productId, setProductId] = useState("");
  const [expandedTimelines, setExpandedTimelines] = useState({});
  const isGerman = countryCode === "DE";

  const formatOrderNumber = (orderNumber) => {
    if (!orderNumber) return "N/A";
    return String(orderNumber).padStart(6, "0");
  };

  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedReturnOrder, setSelectedReturnOrder] = useState(null);
  const [selectedReturnProduct, setSelectedReturnProduct] = useState(null);

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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

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
        toast.success("Your return request has been sent.");
        fetchOrders();
        setShowReturnModal(false);
        setSelectedReturnOrder(null);
        setSelectedReturnProduct(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  const handleReturnClick = (order, product = null, sellerOrderId = null) => {
    setSelectedReturnOrder({ ...order, sellerOrderId });
    setSelectedReturnProduct(product);
    setShowReturnModal(true);
  };

  const handleOrderCancelConfirmation = (
    orderId,
    status,
    sellerOrderId = null
  ) => {
    Swal.fire({
      title: isGerman ? "Bist du sicher?" : "Are you sure?",
      text:
        status === "Cancelled"
          ? isGerman
            ? "Möchten Sie diese Bestellung stornieren?"
            : "Do you want to cancel this order?"
          : isGerman
          ? "Möchten Sie diese Bestellung zurückgeben?"
          : "Do you want to return this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText:
        status === "Cancelled"
          ? isGerman
            ? "Ja, stornieren"
            : "Yes, cancel it"
          : isGerman
          ? "Ja, zurückgeben"
          : "Yes, return it",
    }).then((result) => {
      if (result.isConfirmed) cancelOrder(orderId, status, sellerOrderId);
    });
  };

  const cancelOrder = async (orderId, status, sellerOrderId = null) => {
    try {
      const endpoint = sellerOrderId
        ? `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/order/seller-order/status/${sellerOrderId}`
        : `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/order/cancel/request/${orderId}`;
      const { data } = await axios.put(endpoint, { orderStatus: status });
      if (data) {
        toast.success(
          status === "Cancelled"
            ? "Order cancelled successfully"
            : "Return request sent"
        );
        fetchOrders();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  const toggleTimeline = (id) => {
    setExpandedTimelines((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Generate Invoice PDF
  const generateInvoicePDF = (order) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const primaryColor = [220, 38, 38]; // Red (Darloo Red)
    const secondaryColor = [185, 28, 28]; // Darker Red
    const accentColor = [250, 204, 21]; // Yellow (Darloo Yellow)
    const accentDark = [234, 179, 8]; // Darker Yellow

    // Helper functions
    const addGradientHeader = () => {
      // Header background - Red
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, pageWidth, 55, "F");

      // Yellow accent stripe at bottom of header
      doc.setFillColor(...accentColor);
      doc.rect(0, 50, pageWidth, 5, "F");

      // Decorative yellow circle
      doc.setFillColor(...accentColor);
      doc.circle(pageWidth - 15, 15, 25, "F");
      doc.setFillColor(...accentDark);
      doc.circle(pageWidth - 15, 15, 18, "F");

      // Small decorative circle
      doc.setFillColor(...accentColor);
      doc.circle(pageWidth - 50, 40, 8, "F");

      // Company Branding - DARLOO MARKET
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("DARLOO", 20, 22);
      doc.setFillColor(...accentColor);
      doc.setTextColor(...accentColor);
      doc.setFontSize(10);
      doc.text("MARKET", 20, 30);

      // Invoice Title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.text("INVOICE", 20, 45);

      // Invoice Number on right
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...accentColor);
      doc.text(
        `#${formatOrderNumber(order?.orderNumber)}`,
        pageWidth - 45,
        30,
        { align: "right" }
      );
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(
        format(new Date(order.createdAt), "MMMM dd, yyyy"),
        pageWidth - 45,
        40,
        { align: "right" }
      );
    };

    const addSection = (title, yPos) => {
      // Yellow accent bar on left
      doc.setFillColor(...accentColor);
      doc.rect(15, yPos - 6, 4, 10, "F");
      // Light red background
      doc.setFillColor(254, 242, 242);
      doc.roundedRect(19, yPos - 6, pageWidth - 34, 10, 2, 2, "F");
      doc.setTextColor(...primaryColor);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(title, 25, yPos);
      return yPos + 15;
    };

    // Add Header
    addGradientHeader();

    // Billing/Shipping Info Section
    let yPos = 70;

    // Two column layout for addresses
    const colWidth = (pageWidth - 40) / 2;

    // Bill To Section - Light yellow background with red accent
    doc.setFillColor(254, 252, 232); // Light yellow
    doc.roundedRect(15, yPos, colWidth, 50, 3, 3, "F");
    doc.setFillColor(...primaryColor);
    doc.rect(15, yPos, 4, 50, "F"); // Red left border
    doc.setTextColor(...primaryColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(isGerman ? "RECHNUNGSADRESSE" : "BILL TO", 24, yPos + 10);

    doc.setTextColor(55, 65, 81);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const customerName =
      `${order.shippingAddress?.firstName || ""} ${
        order.shippingAddress?.lastName || ""
      }`.trim() ||
      order.user?.name ||
      "Customer";
    doc.text(customerName, 24, yPos + 22);
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text(
      order.shippingAddress?.email || order.user?.email || "",
      24,
      yPos + 30
    );
    doc.text(order.shippingAddress?.phone || "", 24, yPos + 38);

    // Ship To Section - Light red background with yellow accent
    doc.setFillColor(254, 242, 242); // Light red
    doc.roundedRect(15 + colWidth + 10, yPos, colWidth, 50, 3, 3, "F");
    doc.setFillColor(...accentColor);
    doc.rect(15 + colWidth + 10, yPos, 4, 50, "F"); // Yellow left border
    doc.setTextColor(...primaryColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(
      isGerman ? "LIEFERADRESSE" : "SHIP TO",
      29 + colWidth + 10,
      yPos + 10
    );

    doc.setTextColor(55, 65, 81);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const addressLines = [
      order.shippingAddress?.address,
      `${order.shippingAddress?.city || ""}, ${
        order.shippingAddress?.state || ""
      } ${order.shippingAddress?.postalCode || ""}`.trim(),
      order.shippingAddress?.country,
    ].filter(Boolean);

    addressLines.forEach((line, idx) => {
      doc.text(line, 29 + colWidth + 10, yPos + 22 + idx * 8);
    });

    yPos += 60;

    // Order Details Section Header
    yPos = addSection(isGerman ? "BESTELLDETAILS" : "ORDER DETAILS", yPos);

    // Products Table
    const hasSellerOrders = order.sellerOrders?.length > 0;
    const products = hasSellerOrders
      ? order.sellerOrders.flatMap(
          (so) =>
            so.products?.map((p) => ({
              ...p,
              sellerName: so.sellerName,
              status: so.orderStatus,
            })) || []
        )
      : order.products || [];

    const tableData = products.map((product, idx) => {
      const productData = product?.product || product;
      const productName = productData?.name || "Product";
      const quantity = product?.quantity || 1;
      const price = parseFloat(product?.price || productData?.price || 0);
      const subtotal = price * quantity;

      return [
        (idx + 1).toString(),
        productName.length > 35
          ? productName.substring(0, 35) + "..."
          : productName,
        hasSellerOrders ? product.sellerName || "-" : "-",
        quantity.toString(),
        `€${price.toFixed(2)}`,
        `€${subtotal.toFixed(2)}`,
      ];
    });

    autoTable(doc, {
      startY: yPos,
      head: [
        [
          "#",
          isGerman ? "Produkt" : "Product",
          isGerman ? "Verkäufer" : "Seller",
          isGerman ? "Menge" : "Qty",
          isGerman ? "Preis" : "Price",
          isGerman ? "Summe" : "Total",
        ],
      ],
      body: tableData,
      theme: "plain",
      styles: {
        fontSize: 9,
        cellPadding: 5,
        textColor: [55, 65, 81],
        lineColor: [254, 226, 226], // Light red border
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [...primaryColor], // Red header
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [254, 252, 232], // Light yellow
      },
      columnStyles: {
        0: { cellWidth: 12, halign: "center" },
        1: { cellWidth: 60 },
        2: { cellWidth: 35 },
        3: { cellWidth: 18, halign: "center" },
        4: { cellWidth: 25, halign: "right" },
        5: { cellWidth: 30, halign: "right" },
      },
      margin: { left: 15, right: 15 },
    });

    yPos = doc.lastAutoTable.finalY + 15;

    // Payment Summary Section
    const summaryStartX = pageWidth - 90;
    const summaryWidth = 75;

    // Light yellow background with red border
    doc.setFillColor(254, 252, 232);
    doc.roundedRect(
      summaryStartX - 5,
      yPos - 5,
      summaryWidth + 10,
      70,
      3,
      3,
      "F"
    );
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.roundedRect(
      summaryStartX - 5,
      yPos - 5,
      summaryWidth + 10,
      70,
      3,
      3,
      "S"
    );

    // Calculate totals
    const subtotal =
      parseFloat(order.totalAmount) - parseFloat(order.shippingFee || 0);
    const shipping = parseFloat(order.shippingFee || 0);
    const discount = parseFloat(order.discount || 0);
    const total = parseFloat(order.totalAmount);

    const summaryItems = [
      {
        label: isGerman ? "Zwischensumme" : "Subtotal",
        value: `€${subtotal.toFixed(2)}`,
        bold: false,
      },
      {
        label: isGerman ? "Versand" : "Shipping",
        value: `€${shipping.toFixed(2)}`,
        bold: false,
      },
    ];

    if (discount > 0) {
      summaryItems.push({
        label: isGerman ? "Rabatt" : "Discount",
        value: `-€${discount.toFixed(2)}`,
        bold: false,
        color: [22, 163, 74],
      }); // Green for discount
    }

    let summaryY = yPos + 5;
    summaryItems.forEach((item) => {
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(item.label, summaryStartX, summaryY);

      if (item.color) {
        doc.setTextColor(...item.color);
      } else {
        doc.setTextColor(55, 65, 81);
      }
      doc.text(item.value, summaryStartX + summaryWidth, summaryY, {
        align: "right",
      });
      summaryY += 10;
    });

    // Yellow divider line
    doc.setDrawColor(...accentColor);
    doc.setLineWidth(1);
    doc.line(summaryStartX, summaryY, summaryStartX + summaryWidth, summaryY);
    summaryY += 10;

    // Total with red background
    doc.setFillColor(...primaryColor);
    doc.roundedRect(
      summaryStartX - 2,
      summaryY - 6,
      summaryWidth + 4,
      16,
      2,
      2,
      "F"
    );

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(isGerman ? "GESAMT" : "TOTAL", summaryStartX + 2, summaryY + 4);
    doc.text(
      `€${total.toFixed(2)}`,
      summaryStartX + summaryWidth - 2,
      summaryY + 4,
      { align: "right" }
    );

    // Payment Info on left side with red heading
    doc.setFillColor(...accentColor);
    doc.rect(15, yPos - 3, 4, 30, "F"); // Yellow accent bar
    doc.setTextColor(...primaryColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(
      isGerman ? "ZAHLUNGSINFORMATIONEN" : "PAYMENT INFORMATION",
      24,
      yPos
    );

    doc.setTextColor(55, 65, 81);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      `${isGerman ? "Methode" : "Method"}: ${order.paymentMethod || "N/A"}`,
      24,
      yPos + 12
    );

    // Payment status with color coding
    const paymentStatusColor =
      order.paymentStatus === "Completed" ? [22, 163, 74] : [...accentDark];
    doc.text(`${isGerman ? "Status" : "Status"}: `, 24, yPos + 22);
    doc.setTextColor(...paymentStatusColor);
    doc.setFont("helvetica", "bold");
    doc.text(order.paymentStatus || "Pending", 45, yPos + 22);

    // Footer with Darloo branding
    const footerY = doc.internal.pageSize.getHeight() - 30;

    // Red footer bar
    doc.setFillColor(...primaryColor);
    doc.rect(0, footerY - 5, pageWidth, 35, "F");

    // Yellow accent stripe
    doc.setFillColor(...accentColor);
    doc.rect(0, footerY - 5, pageWidth, 3, "F");

    // Darloo branding in footer
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("DARLOO", 20, footerY + 12);
    doc.setTextColor(...accentColor);
    doc.setFontSize(8);
    doc.text("MARKET", 20, footerY + 18);

    // Thank you message
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      isGerman
        ? "Vielen Dank für Ihren Einkauf!"
        : "Thank you for shopping with us!",
      pageWidth / 2,
      footerY + 10,
      { align: "center" }
    );
    doc.setFontSize(8);
    doc.setTextColor(254, 226, 226);
    doc.text(
      isGerman
        ? "Bei Fragen wenden Sie sich bitte an unseren Kundenservice."
        : "For questions, please contact our customer support.",
      pageWidth / 2,
      footerY + 18,
      { align: "center" }
    );

    // Generated timestamp on right
    doc.setFontSize(7);
    doc.setTextColor(254, 226, 226);
    doc.text(
      `${format(new Date(), "MMM dd, yyyy")}`,
      pageWidth - 20,
      footerY + 15,
      { align: "right" }
    );

    // Save PDF
    doc.save(
      `Invoice_${formatOrderNumber(order?.orderNumber)}_${format(
        new Date(order.createdAt),
        "yyyyMMdd"
      )}.pdf`
    );
    toast.success(
      isGerman
        ? "Rechnung heruntergeladen!"
        : "Invoice downloaded successfully!"
    );
  };

  const getStatusConfig = (status) => {
    const s = status?.toLowerCase();
    const configs = {
      pending: {
        icon: Clock,
        gradient: "from-amber-500 via-orange-500 to-amber-600",
        bg: "bg-gradient-to-r from-amber-50 to-orange-50",
        text: "text-amber-700",
        border: "border-amber-200",
        glow: "shadow-amber-200/50",
        pulse: "bg-amber-500",
      },
      processing: {
        icon: RefreshCw,
        gradient: "from-blue-500 via-indigo-500 to-blue-600",
        bg: "bg-gradient-to-r from-blue-50 to-indigo-50",
        text: "text-blue-700",
        border: "border-blue-200",
        glow: "shadow-blue-200/50",
        pulse: "bg-blue-500",
      },
      packing: {
        icon: PiPackageDuotone,
        gradient: "from-violet-500 via-purple-500 to-violet-600",
        bg: "bg-gradient-to-r from-violet-50 to-purple-50",
        text: "text-violet-700",
        border: "border-violet-200",
        glow: "shadow-violet-200/50",
        pulse: "bg-violet-500",
      },
      shipped: {
        icon: Truck,
        gradient: "from-cyan-500 via-teal-500 to-cyan-600",
        bg: "bg-gradient-to-r from-cyan-50 to-teal-50",
        text: "text-cyan-700",
        border: "border-cyan-200",
        glow: "shadow-cyan-200/50",
        pulse: "bg-cyan-500",
      },
      delivered: {
        icon: Check,
        gradient: "from-emerald-500 via-green-500 to-emerald-600",
        bg: "bg-gradient-to-r from-emerald-50 to-green-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        glow: "shadow-emerald-200/50",
        pulse: "bg-emerald-500",
      },
      cancelled: {
        icon: XCircle,
        gradient: "from-red-500 via-rose-500 to-red-600",
        bg: "bg-gradient-to-r from-red-50 to-rose-50",
        text: "text-red-700",
        border: "border-red-200",
        glow: "shadow-red-200/50",
        pulse: "bg-red-500",
      },
      returned: {
        icon: RotateCcw,
        gradient: "from-orange-500 via-amber-500 to-orange-600",
        bg: "bg-gradient-to-r from-orange-50 to-amber-50",
        text: "text-orange-700",
        border: "border-orange-200",
        glow: "shadow-orange-200/50",
        pulse: "bg-orange-500",
      },
    };
    return configs[s] || configs.pending;
  };

  // Progress Steps Component
  const ProgressSteps = ({ currentStatus }) => {
    const steps = ["Pending", "Processing", "Packing", "Shipped", "Delivered"];
    const currentIndex = steps.findIndex(
      (s) => s.toLowerCase() === currentStatus?.toLowerCase()
    );
    const isCancelled = currentStatus?.toLowerCase() === "cancelled";
    const isReturned = currentStatus?.toLowerCase() === "returned";

    if (isCancelled || isReturned) {
      return (
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full ${
            isCancelled ? "bg-red-100" : "bg-orange-100"
          }`}
        >
          {isCancelled ? (
            <XCircle className="w-4 h-4 text-red-600" />
          ) : (
            <RotateCcw className="w-4 h-4 text-orange-600" />
          )}
          <span
            className={`text-[13px] font-semibold ${
              isCancelled ? "text-red-700" : "text-orange-700"
            }`}
          >
            {isCancelled
              ? isGerman
                ? "Storniert"
                : "Cancelled"
              : isGerman
              ? "Zurückgegeben"
              : "Returned"}
          </span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1 w-full max-w-md">
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          return (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${
                    isCompleted
                      ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-200/50"
                      : "bg-slate-200 text-slate-500"
                  } ${isCurrent ? "ring-4 ring-emerald-200 scale-110" : ""}`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <span
                  className={`text-[10px] mt-1 font-medium ${
                    isCompleted ? "text-emerald-700" : "text-slate-400"
                  }`}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-1 rounded-full transition-all duration-500 ${
                    index < currentIndex ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Timeline Component
  const Timeline = ({ timeline, id }) => {
    const isExpanded = expandedTimelines[id];
    const displayTimeline = isExpanded ? timeline : timeline?.slice(0, 3);

    return (
      <div className="relative">
        <div className="space-y-4">
          {displayTimeline?.map((item, idx) => {
            const config = getStatusConfig(item.status);
            const StatusIcon = config.icon;
            return (
              <div key={idx} className="flex gap-4 group">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg ${config.glow} group-hover:scale-110 transition-transform`}
                  >
                    <StatusIcon className="w-5 h-5 text-white" />
                  </div>
                  {idx < displayTimeline.length - 1 && (
                    <div className="w-0.5 h-full min-h-[40px] bg-gradient-to-b from-slate-300 to-transparent mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div
                    className={`p-3 rounded-xl ${config.bg} border ${config.border} group-hover:shadow-md transition-shadow`}
                  >
                    <p
                      className={`text-[14px] font-bold ${config.text} capitalize`}
                    >
                      {item.status}
                    </p>
                    <p className="text-[12px] text-slate-500 mt-1 flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      {format(
                        new Date(item.date),
                        "EEEE, MMM dd, yyyy • h:mm a"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {timeline?.length > 3 && (
          <button
            onClick={() => toggleTimeline(id)}
            className="flex items-center gap-2 text-[13px] text-primary font-semibold hover:underline mt-2 ml-14"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />{" "}
                {isGerman ? "Weniger anzeigen" : "Show less"}
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />{" "}
                {isGerman
                  ? `+${timeline.length - 3} mehr anzeigen`
                  : `Show ${timeline.length - 3} more`}
              </>
            )}
          </button>
        )}
      </div>
    );
  };

  // Product Card Component
  const ProductCard = ({ product, orderStatus, onReview }) => {
    const productData = product?.product || product;
    const productImage =
      product?.image || productData?.thumbnails || "/placeholder.svg";
    const productName = productData?.name || "Product";
    const productPrice = product?.price || productData?.price || 0;
    const pId = productData?._id;

    return (
      <div className="group relative bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex items-center gap-4 p-4">
          <div
            className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-slate-100 flex-shrink-0 cursor-pointer group-hover:border-primary/30 transition-colors"
            onClick={() => pId && router.push(`/products/${pId}`)}
          >
            <Image
              src={productImage}
              alt={productName}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <ExternalLink className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p
              className="text-[15px] font-bold text-slate-900 line-clamp-2 cursor-pointer hover:text-primary transition-colors"
              onClick={() => pId && router.push(`/products/${pId}`)}
            >
              {productName}
            </p>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <span className="text-[18px] font-extrabold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                €{parseFloat(productPrice).toFixed(2)}
              </span>
              <span className="text-[13px] text-slate-600 bg-slate-100 px-3 py-1 rounded-full font-medium">
                × {product?.quantity || 1}
              </span>
              {product?.sizes?.length > 0 && (
                <span className="text-[12px] px-3 py-1 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 font-semibold">
                  {product.sizes.join(", ")}
                </span>
              )}
              {product?.colors?.length > 0 && (
                <span className="text-[12px] px-3 py-1 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 font-semibold">
                  {product.colors.join(", ")}
                </span>
              )}
            </div>
          </div>

          {orderStatus === "Delivered" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReview(pId)}
              className="gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 hover:border-amber-400 hover:from-amber-100 hover:to-yellow-100 text-amber-700 font-semibold transition-all"
            >
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              {isGerman ? "Bewerten" : "Review"}
            </Button>
          )}
        </div>
      </div>
    );
  };

  // Seller Order Card - Shows all products from a seller grouped together
  const SellerOrderCard = ({ sellerOrder, parentOrder, index }) => {
    const products = sellerOrder?.products || [];
    const hasTracking = sellerOrder?.tracking?.[0]?.trackingId;
    const timelineId = `seller-order-${sellerOrder?._id}`;
    const config = getStatusConfig(sellerOrder?.orderStatus);
    const StatusIcon = config.icon;
    const [showTimeline, setShowTimeline] = useState(false);

    // Calculate seller order total
    const sellerTotal = products.reduce((sum, p) => {
      const price = parseFloat(p?.price || p?.product?.price || 0);
      const qty = p?.quantity || 1;
      return sum + price * qty;
    }, 0);

    return (
      <div className="relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
        {/* Seller Order Header - Status Bar */}
        <div
          className={`relative px-4 py-3 bg-gradient-to-r ${config.gradient} overflow-hidden`}
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <StatusIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[14px] font-bold text-white">
                    {sellerOrder?.orderStatus || "Pending"}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-medium">
                    {products.length}{" "}
                    {products.length === 1
                      ? isGerman
                        ? "Artikel"
                        : "item"
                      : isGerman
                      ? "Artikel"
                      : "items"}
                  </span>
                  {hasTracking && (
                    <span className="text-[12px] text-white/80 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" />
                      {sellerOrder?.tracking[0]?.shippingCarrier}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Store className="w-3.5 h-3.5 text-white/70" />
                  <span className="text-[12px] text-white/80">
                    {sellerOrder?.sellerName || "Seller"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {hasTracking && (
                <button
                  onClick={() =>
                    copyToClipboard(sellerOrder?.tracking[0]?.trackingId)
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors text-[12px] font-medium text-white"
                >
                  <span>{sellerOrder?.tracking[0]?.trackingId}</span>
                  <Copy className="w-3 h-3" />
                </button>
              )}
              <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-[13px] font-bold text-white">
                €{sellerTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="p-4 space-y-3">
          {products.map((product, pIndex) => {
            const productData = product?.product || product;
            const productImage =
              product?.image || productData?.thumbnails || "/placeholder.svg";
            const productName = product?.name || productData?.name || "Product";
            const productPrice = product?.price || productData?.price || 0;
            const pId = productData?._id || product?.product;

            return (
              <div
                key={pId || pIndex}
                className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all"
              >
                {/* Product Image */}
                <div
                  className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 cursor-pointer group"
                  onClick={() => pId && router.push(`/products/${pId}`)}
                >
                  <Image
                    src={productImage}
                    alt={productName}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[13px] font-semibold text-slate-900 line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => pId && router.push(`/products/${pId}`)}
                  >
                    {productName}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-[14px] font-bold text-primary">
                      €{parseFloat(productPrice).toFixed(2)}
                    </span>
                    <span className="text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      × {product?.quantity || 1}
                    </span>
                    {product?.sizes?.length > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-medium">
                        {product.sizes.join(", ")}
                      </span>
                    )}
                    {product?.colors?.length > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 font-medium">
                        {product.colors.join(", ")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Actions */}
                <div className="flex flex-col gap-1 flex-shrink-0">
                  {sellerOrder?.orderStatus === "Delivered" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setProductId(pId);
                        setShow(true);
                      }}
                      className="gap-1 text-[10px] h-7 px-2 border-amber-200 text-amber-700 hover:bg-amber-50"
                    >
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {isGerman ? "Bewerten" : "Review"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Delivery Estimate */}
          {sellerOrder?.estimatedDelivery &&
            sellerOrder?.orderStatus !== "Delivered" &&
            sellerOrder?.orderStatus !== "Cancelled" && (
              <div className="flex items-center gap-1.5 pt-2 text-[12px] text-slate-500">
                <CalendarDays className="w-3.5 h-3.5" />
                <span>
                  {isGerman ? "Lieferung in" : "Delivery in"}{" "}
                  {sellerOrder.estimatedDelivery.min}-
                  {sellerOrder.estimatedDelivery.max}{" "}
                  {isGerman ? "Tagen" : "days"}
                </span>
              </div>
            )}

          {/* Order Actions */}
          <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
            {(sellerOrder?.orderStatus === "Pending" ||
              sellerOrder?.orderStatus === "Processing") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleOrderCancelConfirmation(
                    parentOrder._id,
                    "Cancelled",
                    sellerOrder._id
                  )
                }
                className="gap-1.5 text-[11px] h-8 border-red-200 text-red-600 hover:bg-red-50"
              >
                <XCircle className="w-3.5 h-3.5" />
                {isGerman ? "Bestellung stornieren" : "Cancel Order"}
              </Button>
            )}
            {sellerOrder?.orderStatus === "Delivered" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleReturnClick(parentOrder, null, sellerOrder._id)
                }
                className="gap-1.5 text-[11px] h-8 border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {isGerman ? "Rückgabe beantragen" : "Request Return"}
              </Button>
            )}
          </div>

          {/* Progress Steps */}
          <div className="pt-4 border-t border-slate-100">
            <ProgressSteps currentStatus={sellerOrder?.orderStatus} />
          </div>

          {/* Expandable Timeline */}
          {sellerOrder?.timeline?.length > 0 && (
            <div className="pt-3">
              <button
                onClick={() => setShowTimeline(!showTimeline)}
                className="flex items-center gap-2 text-[13px] text-primary font-medium hover:underline"
              >
                {showTimeline ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                {isGerman ? "Bestellverlauf" : "Order Timeline"}
              </button>
              {showTimeline && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <Timeline timeline={sellerOrder.timeline} id={timelineId} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Shipping & Discount Info Footer */}
        {(sellerOrder?.shippingFee > 0 || sellerOrder?.couponDiscount > 0) && (
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 space-y-2 text-[13px]">
            {sellerOrder?.shippingFee > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Truck className="w-4 h-4" />
                  {isGerman ? "Versandkosten" : "Shipping Fee"}
                </span>
                <span className="font-semibold text-slate-700">
                  €{sellerOrder?.shippingFee?.toFixed(2)}
                </span>
              </div>
            )}
            {sellerOrder?.couponDiscount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-green-500" />
                  {isGerman ? "Rabatt" : "Discount"}
                  {sellerOrder?.couponCode && (
                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
                      {sellerOrder.couponCode}
                    </span>
                  )}
                </span>
                <span className="font-semibold text-green-600">
                  -€{sellerOrder?.couponDiscount?.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Get overall status from seller orders (most advanced status)
  const getOverallStatus = (sellerOrders) => {
    if (!sellerOrders || sellerOrders.length === 0) return "Pending";

    const statusOrder = [
      "Delivered",
      "Shipped",
      "Packing",
      "Processing",
      "Pending",
      "Cancelled",
      "Returned",
    ];

    // Find the most advanced status
    for (const status of statusOrder) {
      if (sellerOrders.some((so) => so.orderStatus === status)) {
        return status;
      }
    }
    return "Pending";
  };

  // Main Order Card Component
  const OrderCard = ({ order }) => {
    const hasSellerOrders = order.sellerOrders?.length > 0;
    const isMultiVendor = order.orderType === "multi" || hasSellerOrders;
    const isExpanded = expandedOrderId === order._id;

    // Get status counts from seller orders
    const statusCounts = hasSellerOrders
      ? order.sellerOrders.reduce((acc, so) => {
          acc[so.orderStatus] = (acc[so.orderStatus] || 0) + 1;
          return acc;
        }, {})
      : {};

    return (
      <div className="relative bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-br from-slate-50 via-white to-slate-50" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-32 translate-x-32" />

        {/* Order Header */}
        <div className="relative p-6 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="flex items-start gap-5">
              {/* Order Icon */}
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-xl shadow-primary/25">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-[20px] font-extrabold text-slate-900">
                    #{formatOrderNumber(order?.orderNumber)}
                  </h2>
                  {hasSellerOrders && (
                    <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-700 text-[12px] font-bold flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      {order.sellerOrders?.length || 0}{" "}
                      {isGerman ? "Artikel" : "Items"}
                    </div>
                  )}
                  {/* Status Summary Pills */}
                  {hasSellerOrders &&
                    Object.entries(statusCounts).map(([status, count]) => {
                      const config = getStatusConfig(status);
                      return (
                        <div
                          key={status}
                          className={`px-3 py-1 rounded-full ${config.bg} ${config.text} text-[11px] font-bold flex items-center gap-1.5 border ${config.border}`}
                        >
                          <span>{count}</span>
                          <span>{status}</span>
                        </div>
                      );
                    })}
                </div>

                <div className="flex items-center gap-4 mt-3 flex-wrap">
                  <span className="flex items-center gap-2 text-[14px] text-slate-500">
                    <CalendarDays className="w-4 h-4" />
                    {format(new Date(order.createdAt), "MMMM dd, yyyy")}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[18px] font-extrabold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    €{order.totalAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Invoice Download Button */}
              <Button
                onClick={() => generateInvoicePDF(order)}
                variant="outline"
                className="gap-2 font-semibold border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all group"
              >
                <div className="relative">
                  <FileText className="w-4 h-4 group-hover:hidden" />
                  <Download className="w-4 h-4 hidden group-hover:block" />
                </div>
                {isGerman ? "Rechnung" : "Invoice"}
              </Button>
              <Button
                onClick={() =>
                  setExpandedOrderId((prev) =>
                    prev === order._id ? "" : order._id
                  )
                }
                variant={isExpanded ? "default" : "outline"}
                className={`gap-2 font-semibold transition-all ${
                  isExpanded
                    ? "bg-gradient-to-r from-primary to-primary/90 shadow-lg shadow-primary/25"
                    : ""
                }`}
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                {isGerman ? "Details" : "View Details"}
              </Button>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="relative">
            <div className="p-6 space-y-6 bg-gradient-to-b from-slate-50/50 to-white">
              {/* Seller Orders - Each seller has one order with all their products */}
              {hasSellerOrders ? (
                <div className="space-y-4">
                  <h4 className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
                    <Store className="w-5 h-5 text-primary" />
                    {isGerman ? "Verkäufer-Bestellungen" : "Seller Orders"} (
                    {order.sellerOrders.length})
                  </h4>
                  <div className="space-y-4">
                    {order.sellerOrders.map((sellerOrder, idx) => (
                      <SellerOrderCard
                        key={sellerOrder._id || idx}
                        sellerOrder={sellerOrder}
                        parentOrder={order}
                        index={idx}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                /* Legacy Single Vendor Products (for old orders) */
                <div className="space-y-4">
                  <h4 className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                    {isGerman ? "Bestellte Artikel" : "Order Items"}
                  </h4>
                  <div className="space-y-3">
                    {order.products?.map((product, idx) => (
                      <ProductCard
                        key={idx}
                        product={product}
                        orderStatus="Pending"
                        onReview={(pId) => {
                          setProductId(pId);
                          setShow(true);
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Order Info Grid */}
              <div className="grid md:grid-cols-2 gap-5">
                {/* Shipping Address */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-200/50">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <h5 className="text-[15px] font-bold text-slate-900">
                      {isGerman ? "Lieferadresse" : "Shipping Address"}
                    </h5>
                  </div>
                  <div className="text-[14px] text-slate-700 space-y-2">
                    <p className="font-bold text-slate-900 text-[16px]">
                      {order.user?.name}
                    </p>
                    <p>{order.shippingAddress?.address}</p>
                    <p>
                      {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.state}{" "}
                      {order.shippingAddress?.postalCode}
                    </p>
                    <p>{order.shippingAddress?.country}</p>
                    {order.user?.number && (
                      <p className="pt-2 mt-2 border-t border-blue-200 font-semibold">
                        {order.user.number}
                      </p>
                    )}
                  </div>
                </div>

                {/* Payment Info */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-200/50">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <h5 className="text-[15px] font-bold text-slate-900">
                      {isGerman ? "Zahlungsdetails" : "Payment Details"}
                    </h5>
                  </div>
                  <div className="space-y-3 text-[14px]">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">
                        {isGerman ? "Methode" : "Method"}
                      </span>
                      <span className="font-bold text-slate-900">
                        {order.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">
                        {isGerman ? "Status" : "Status"}
                      </span>
                      <Badge
                        className={
                          order.paymentStatus === "Completed"
                            ? "bg-emerald-500"
                            : "bg-amber-500"
                        }
                      >
                        {order.paymentStatus}
                      </Badge>
                    </div>
                    <Separator className="bg-emerald-200" />
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">
                        {isGerman ? "Zwischensumme" : "Subtotal"}
                      </span>
                      <span className="font-semibold">
                        €
                        {(
                          parseFloat(order.totalAmount) -
                          parseFloat(order.shippingFee || 0) +
                          parseFloat(order.discount || 0)
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">
                        {isGerman ? "Versand" : "Shipping"}
                      </span>
                      <span className="font-semibold">
                        €{parseFloat(order.shippingFee || 0).toFixed(2)}
                      </span>
                    </div>
                    {/* Coupon Discount */}
                    {(order.discount > 0 || order.couponCode) && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-green-500" />
                            {isGerman ? "Rabatt" : "Discount"}
                            {order.couponCode && (
                              <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
                                {order.couponCode}
                              </span>
                            )}
                          </span>
                          <span className="font-semibold text-green-600">
                            -€{parseFloat(order.discount || 0).toFixed(2)}
                          </span>
                        </div>
                      </>
                    )}
                    <Separator className="bg-emerald-200" />
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[16px] font-bold text-slate-900">
                        {isGerman ? "Gesamt" : "Total"}
                      </span>
                      <span className="text-[20px] font-extrabold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                        €{order.totalAmount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tracking for single vendor */}
              {!isMultiVendor && order.tracking?.[0]?.trackingId && (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-500 text-white">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Truck className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h5 className="text-[15px] font-bold">
                          {isGerman
                            ? "Sendungsverfolgung"
                            : "Track Your Package"}
                        </h5>
                        <p className="text-[13px] text-white/80 mt-0.5">
                          {order.tracking[0].shippingCarrier &&
                            `${order.tracking[0].shippingCarrier} • `}
                          {order.tracking[0].trackingId}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(order.tracking[0].trackingId)
                      }
                      className="flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors font-semibold"
                    >
                      <Copy className="w-4 h-4" />
                      {isGerman ? "Kopieren" : "Copy ID"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Filter orders based on seller order statuses
  const filterOrders = (status) => {
    if (status === "all") return orders;
    // Filter orders that have at least one seller order with the given status
    return orders.filter((order) => {
      if (order.sellerOrders && order.sellerOrders.length > 0) {
        return order.sellerOrders.some((so) => so.orderStatus === status);
      }
      // Legacy orders without seller orders
      return false;
    });
  };

  // Count orders by status (based on seller orders)
  const getStatusCount = (status) => {
    if (status === "all") return orders.length;
    // Count orders that have at least one seller order with the given status
    return orders.filter((order) => {
      if (order.sellerOrders && order.sellerOrders.length > 0) {
        return order.sellerOrders.some((so) => so.orderStatus === status);
      }
      return false;
    }).length;
  };

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-xl shadow-primary/25">
            <ShoppingBag className="w-7 h-7 text-white" />
          </div>
          <div>
            <CardTitle className="text-[22px] font-extrabold">
              {isGerman ? "Bestellverlauf" : "Orders History"}
            </CardTitle>
            <CardDescription className="text-[14px] mt-1">
              {isGerman
                ? "Verwalten und verfolgen Sie Ihre Bestellungen"
                : "View, track, and manage all your orders"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0">
        <Tabs defaultValue="all">
          <TabsList className="flex items-center justify-start gap-1.5 py-1 h-10 w-full mb-8 overflow-x-auto shidden bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 p-2 rounded-2xl border border-slate-200/60 shadow-sm">
            {[
              {
                value: "all",
                label: isGerman ? "Alle" : "All",
                icon: Package,
                color: "slate",
              },
              {
                value: "Pending",
                label: isGerman ? "Ausstehend" : "Pending",
                icon: Clock,
                color: "amber",
              },
              {
                value: "Processing",
                label: isGerman ? "Bearbeitung" : "Processing",
                icon: RefreshCw,
                color: "blue",
              },
              {
                value: "Packing",
                label: isGerman ? "Verpacken" : "Packing",
                icon: Box,
                color: "violet",
              },
              {
                value: "Shipped",
                label: isGerman ? "Versendet" : "Shipped",
                icon: Truck,
                color: "cyan",
              },
              {
                value: "Delivered",
                label: isGerman ? "Geliefert" : "Delivered",
                icon: Check,
                color: "emerald",
              },
              {
                value: "Cancelled",
                label: isGerman ? "Storniert" : "Cancelled",
                icon: XCircle,
                color: "rose",
              },
              {
                value: "Returned",
                label: isGerman ? "Retourniert" : "Returned",
                icon: RotateCcw,
                color: "orange",
              },
            ].map((tab) => {
              const count = getStatusCount(tab.value);
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="group relative text-[12px] cursor-pointer min-w-fit px-4 py-2 min-h-9 rounded-full font-semibold flex items-center gap-2 transition-all duration-300
                    bg-white/60 hover:bg-white border border-transparent hover:border-slate-200 text-slate-600 hover:text-slate-800 hover:shadow-md
                    data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-rose-600
                    data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-red-500/30
                    data-[state=active]:border-red-400 data-[state=active]:scale-[1.02]"
                >
                  {/* Active indicator dot */}
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 opacity-0 group-data-[state=active]:opacity-100 animate-pulse shadow-lg shadow-red-500/50" />

                  {/* Icon with background */}
                  <span className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100/80 group-hover:bg-slate-200/80 group-data-[state=active]:bg-white/20 transition-all duration-300">
                    <tab.icon className="w-3.5 h-3.5 group-data-[state=active]:text-white" />
                  </span>

                  {/* Label */}
                  <span className="hidden sm:inline whitespace-nowrap">
                    {tab.label}
                  </span>

                  {/* Count badge */}
                  {count > 0 && (
                    <span
                      className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold transition-all duration-300
                      bg-red-100 text-red-600 group-data-[state=active]:bg-white/25 group-data-[state=active]:text-white"
                    >
                      {count}
                    </span>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {[
            "all",
            "Pending",
            "Processing",
            "Packing",
            "Shipped",
            "Delivered",
            "Cancelled",
            "Returned",
          ].map((status) => (
            <TabsContent key={status} value={status} className="space-y-5 mt-0">
              {isLoading ? (
                <OrderCardSkeleton />
              ) : filterOrders(status).length > 0 ? (
                filterOrders(status).map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-6">
                    <Package className="w-12 h-12 text-slate-400" />
                  </div>
                  <p className="text-[18px] font-bold text-slate-700">
                    {isGerman
                      ? "Keine Bestellungen gefunden"
                      : "No orders found"}
                  </p>
                  <p className="text-[14px] text-slate-500 mt-2 max-w-sm">
                    {isGerman
                      ? "Beginnen Sie mit dem Einkaufen, um Ihre Bestellungen hier zu sehen!"
                      : "Start shopping to see your orders here. Your order history will appear once you make a purchase."}
                  </p>
                  <Button
                    className="mt-6 gap-2 bg-gradient-to-r from-primary to-primary/90 shadow-lg shadow-primary/25"
                    onClick={() => router.push("/products")}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {isGerman ? "Jetzt einkaufen" : "Start Shopping"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>

      {/* Review Modal */}
      {show && (
        <AddReviewModal
          setShow={setShow}
          productId={productId}
          setProductId={setProductId}
          countryCode={countryCode}
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
          countryCode={countryCode}
        />
      )}
    </Card>
  );
}
