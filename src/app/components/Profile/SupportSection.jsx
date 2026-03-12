"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Headphones,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  Star,
  FileText,
  Package,
  CreditCard,
  Truck,
  RotateCcw,
  Wallet,
  User,
  Wrench,
  HelpCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import CreateTicketModal from "./CreateTicketModal";
import TicketDetailModal from "./TicketDetailModal";

export default function SupportSection({ countryCode, auth }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const serverUri = process.env.NEXT_PUBLIC_SERVER_URI;
  const isGerman = countryCode === "DE";

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const statusParam = activeTab !== "all" ? `?status=${activeTab}` : "";
      const { data } = await axios.get(
        `${serverUri}/api/v1/support/tickets/my${statusParam}`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      if (data.success) {
        setTickets(data.tickets || []);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error(isGerman ? "Fehler beim Laden der Tickets" : "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.token) {
      fetchTickets();
    }
  }, [auth.token, activeTab]);

  const handleTicketCreated = () => {
    fetchTickets();
    setIsCreateModalOpen(false);
  };

  const handleTicketUpdated = () => {
    fetchTickets();
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: "bg-blue-100 text-blue-800 border-blue-200",
      in_progress: "bg-yellow-100 text-yellow-800 border-yellow-200",
      resolved: "bg-green-100 text-green-800 border-green-200",
      closed: "bg-gray-100 text-gray-800 border-gray-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return styles[status] || styles.open;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "closed":
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      low: "bg-gray-100 text-gray-700",
      medium: "bg-blue-100 text-blue-700",
      high: "bg-orange-100 text-orange-700",
      urgent: "bg-red-100 text-red-700",
    };
    return styles[priority] || styles.low;
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "order":
        return <Package className="h-4 w-4" />;
      case "payment":
        return <CreditCard className="h-4 w-4" />;
      case "shipping":
        return <Truck className="h-4 w-4" />;
      case "return":
        return <RotateCcw className="h-4 w-4" />;
      case "refund":
        return <Wallet className="h-4 w-4" />;
      case "account":
        return <User className="h-4 w-4" />;
      case "technical":
        return <Wrench className="h-4 w-4" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      order: isGerman ? "Bestellung" : "Order",
      product: isGerman ? "Produkt" : "Product",
      payment: isGerman ? "Zahlung" : "Payment",
      shipping: isGerman ? "Versand" : "Shipping",
      return: isGerman ? "Rückgabe" : "Return",
      refund: isGerman ? "Rückerstattung" : "Refund",
      account: isGerman ? "Konto" : "Account",
      technical: isGerman ? "Technisch" : "Technical",
      other: isGerman ? "Sonstiges" : "Other",
    };
    return labels[category] || category;
  };

  const openTicketDetail = (ticket) => {
    setSelectedTicket(ticket);
    setIsDetailModalOpen(true);
  };

  const getTicketStats = () => {
    return {
      total: tickets.length,
      open: tickets.filter((t) => t.status === "open").length,
      inProgress: tickets.filter((t) => t.status === "in_progress").length,
      resolved: tickets.filter((t) => t.status === "resolved").length,
    };
  };

  const stats = getTicketStats();

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Headphones className="h-5 w-5 text-[#C6080A]" />
              {isGerman ? "Support Center" : "Support Center"}
            </CardTitle>
            <CardDescription>
              {isGerman
                ? "Verwalten Sie Ihre Support-Tickets und Anfragen"
                : "Manage your support tickets and requests"}
            </CardDescription>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#C6080A] hover:bg-[#a50709]"
          >
            <Plus className="h-4 w-4 mr-2" />
            {isGerman ? "Neues Ticket" : "New Ticket"}
          </Button>
        </CardHeader>
        <CardContent>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <p className="text-sm text-blue-600 mb-1">
                  {isGerman ? "Gesamt" : "Total"}
                </p>
                <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
              </CardContent>
            </Card>
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <p className="text-sm text-yellow-600 mb-1">
                  {isGerman ? "Offen" : "Open"}
                </p>
                <p className="text-2xl font-bold text-yellow-700">{stats.open}</p>
              </CardContent>
            </Card>
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4">
                <p className="text-sm text-orange-600 mb-1">
                  {isGerman ? "In Bearbeitung" : "In Progress"}
                </p>
                <p className="text-2xl font-bold text-orange-700">
                  {stats.inProgress}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <p className="text-sm text-green-600 mb-1">
                  {isGerman ? "Gelöst" : "Resolved"}
                </p>
                <p className="text-2xl font-bold text-green-700">
                  {stats.resolved}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 mb-4">
              <TabsTrigger value="all">
                {isGerman ? "Alle" : "All"}
              </TabsTrigger>
              <TabsTrigger value="open">
                {isGerman ? "Offen" : "Open"}
              </TabsTrigger>
              <TabsTrigger value="in_progress">
                {isGerman ? "In Arbeit" : "In Progress"}
              </TabsTrigger>
              <TabsTrigger value="resolved">
                {isGerman ? "Gelöst" : "Resolved"}
              </TabsTrigger>
              <TabsTrigger value="closed">
                {isGerman ? "Geschlossen" : "Closed"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-[#C6080A]" />
                </div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-12">
                  <Headphones className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">
                    {isGerman
                      ? "Keine Tickets in dieser Kategorie"
                      : "No tickets in this category"}
                  </p>
                  <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    variant="outline"
                    className="border-[#C6080A] text-[#C6080A] hover:bg-[#C6080A] hover:text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {isGerman ? "Erstes Ticket erstellen" : "Create First Ticket"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket._id}
                      onClick={() => openTicketDetail(ticket)}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{ticket.subject}</h4>
                            <Badge className={getStatusBadge(ticket.status)}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(ticket.status)}
                                {ticket.status === "in_progress"
                                  ? isGerman
                                    ? "In Bearbeitung"
                                    : "In Progress"
                                  : ticket.status}
                              </span>
                            </Badge>
                            <Badge className={getPriorityBadge(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                            <span className="flex items-center gap-1">
                              {getCategoryIcon(ticket.category)}
                              {getCategoryLabel(ticket.category)}
                            </span>
                            <span>•</span>
                            <span>#{ticket.ticketNumber}</span>
                            <span>•</span>
                            <span>
                              {format(new Date(ticket.createdAt), "MMM d, yyyy")}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {ticket.description}
                          </p>
                          {ticket.replies && ticket.replies.length > 0 && (
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                              <MessageSquare className="h-4 w-4" />
                              {ticket.replies.length}{" "}
                              {ticket.replies.length === 1
                                ? isGerman
                                  ? "Antwort"
                                  : "reply"
                                : isGerman
                                ? "Antworten"
                                : "replies"}
                            </div>
                          )}
                        </div>
                        {ticket.rating?.score && (
                          <div className="flex items-center gap-1 ml-4">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < ticket.rating.score
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleTicketCreated}
        auth={auth}
        countryCode={countryCode}
      />

      <TicketDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedTicket(null);
        }}
        ticket={selectedTicket}
        onUpdate={handleTicketUpdated}
        auth={auth}
        countryCode={countryCode}
      />
    </>
  );
}
