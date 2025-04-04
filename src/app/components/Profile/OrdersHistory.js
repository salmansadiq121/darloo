import React, { useState } from "react";
import {
  Check,
  Clock,
  Package,
  RefreshCw,
  Star,
  Truck,
  XCircle,
  AlertCircle,
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

export default function OrdersHistory() {
  const [orders] = useState([
    {
      id: "ORD-7895",
      date: "Mar 24, 2025",
      total: "€129.99",
      status: "delivered",
      items: [
        { name: "Product A", quantity: 1, price: "€79.99" },
        { name: "Product B", quantity: 2, price: "€25.00" },
      ],
    },
    {
      id: "ORD-6543",
      date: "Mar 18, 2025",
      total: "€59.99",
      status: "shipped",
      items: [{ name: "Product C", quantity: 1, price: "€59.99" }],
    },
    {
      id: "ORD-5421",
      date: "Mar 10, 2025",
      total: "€149.99",
      status: "processing",
      items: [{ name: "Product D", quantity: 1, price: "€149.99" }],
    },
    {
      id: "ORD-4321",
      date: "Mar 5, 2025",
      total: "€89.99",
      status: "pending",
      items: [{ name: "Product E", quantity: 1, price: "€89.99" }],
    },
    {
      id: "ORD-3210",
      date: "Feb 28, 2025",
      total: "€199.99",
      status: "cancelled",
      items: [{ name: "Product F", quantity: 1, price: "€199.99" }],
    },
    {
      id: "ORD-2109",
      date: "Feb 20, 2025",
      total: "€79.99",
      status: "returned",
      items: [{ name: "Product G", quantity: 1, price: "€79.99" }],
    },
    {
      id: "ORD-1098",
      date: "Feb 15, 2025",
      total: "€129.99",
      status: "review",
      items: [{ name: "Product H", quantity: 1, price: "€129.99" }],
    },
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "processing":
        return <RefreshCw className="h-5 w-5 text-blue-500" />;
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
      shipped: { color: "bg-purple-100 text-purple-800 border-purple-200" },
      delivered: { color: "bg-green-100 text-green-800 border-green-200" },
      cancelled: { color: "bg-red-100 text-red-800 border-red-200" },
      returned: { color: "bg-orange-100 text-orange-800 border-orange-200" },
      review: { color: "bg-amber-100 text-amber-800 border-amber-200" },
    };

    return (
      <Badge
        variant="outline"
        className={`${statusConfig[status]?.color} capitalize`}
      >
        {status}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders History</CardTitle>
        <CardDescription>View and manage your orders</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-4 md:grid-cols-8 mb-6">
            <TabsTrigger value="all" className="text-xs md:text-sm">
              All
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs md:text-sm">
              Pending
            </TabsTrigger>
            <TabsTrigger value="processing" className="text-xs md:text-sm">
              Processing
            </TabsTrigger>
            <TabsTrigger value="shipped" className="text-xs md:text-sm">
              Shipped
            </TabsTrigger>
            <TabsTrigger value="delivered" className="text-xs md:text-sm">
              Delivered
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="text-xs md:text-sm">
              Cancelled
            </TabsTrigger>
            <TabsTrigger value="returned" className="text-xs md:text-sm">
              Returned
            </TabsTrigger>
            <TabsTrigger value="review" className="text-xs md:text-sm">
              Review
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col md:flex-row items-start justify-between p-4 border rounded-lg"
              >
                <div className="flex items-start gap-4 mb-4 md:mb-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{order.id}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.date}
                    </p>
                    <p className="text-sm font-medium mt-1">{order.total}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  <Button variant="outline" size="sm" className="text-xs">
                    View Details
                  </Button>
                  {order.status === "delivered" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs flex items-center gap-1"
                    >
                      <Star className="h-3 w-3" />
                      Review
                    </Button>
                  )}
                  {order.status === "delivered" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs flex items-center gap-1 text-orange-600"
                    >
                      <Package className="h-3 w-3" />
                      Return
                    </Button>
                  )}
                  {(order.status === "pending" ||
                    order.status === "processing") && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs flex items-center gap-1 text-red-600"
                    >
                      <XCircle className="h-3 w-3" />
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>

          {[
            "pending",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
            "returned",
            "review",
          ].map((status) => (
            <TabsContent key={status} value={status} className="space-y-4">
              {orders
                .filter((order) => order.status === status)
                .map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col md:flex-row items-start justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-start gap-4 mb-4 md:mb-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        {getStatusIcon(order.status)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{order.id}</h3>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {order.date}
                        </p>
                        <p className="text-sm font-medium mt-1">
                          {order.total}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                      <Button variant="outline" size="sm" className="text-xs">
                        View Details
                      </Button>
                      {order.status === "delivered" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs flex items-center gap-1"
                        >
                          <Star className="h-3 w-3" />
                          Review
                        </Button>
                      )}
                      {order.status === "delivered" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs flex items-center gap-1 text-orange-600"
                        >
                          <Package className="h-3 w-3" />
                          Return
                        </Button>
                      )}
                      {(order.status === "pending" ||
                        order.status === "processing") && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs flex items-center gap-1 text-red-600"
                        >
                          <XCircle className="h-3 w-3" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
