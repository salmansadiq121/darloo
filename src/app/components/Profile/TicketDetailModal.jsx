"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Send,
  X,
  Clock,
  CheckCircle,
  Star,
  Paperclip,
  Download,
  AlertCircle,
  MessageSquare,
  User,
} from "lucide-react";
import toast from "react-hot-toast";

export default function TicketDetailModal({
  isOpen,
  onClose,
  ticket,
  onUpdate,
  auth,
  countryCode,
}) {
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [ticketData, setTicketData] = useState(ticket);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isRating, setIsRating] = useState(false);
  const messagesEndRef = useRef(null);

  const isGerman = countryCode === "DE";
  const serverUri = process.env.NEXT_PUBLIC_SERVER_URI;

  useEffect(() => {
    if (ticket) {
      setTicketData(ticket);
      fetchTicketDetails();
    }
  }, [ticket]);

  useEffect(() => {
    scrollToBottom();
  }, [ticketData?.replies]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchTicketDetails = async () => {
    if (!ticket?._id) return;
    try {
      const { data } = await axios.get(
        `${serverUri}/api/v1/support/tickets/${ticket._id}`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      if (data.success) {
        setTicketData(data.ticket);
      }
    } catch (error) {
      console.error("Error fetching ticket details:", error);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${serverUri}/api/v1/support/tickets/${ticketData._id}/reply`,
        { message: replyText },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );

      if (data.success) {
        setTicketData(data.ticket);
        setReplyText("");
        onUpdate();
        toast.success(isGerman ? "Antwort gesendet" : "Reply sent");
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error(
        error.response?.data?.message ||
          (isGerman ? "Fehler beim Senden" : "Failed to send reply")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRateTicket = async () => {
    if (rating === 0) {
      toast.error(isGerman ? "Bitte wählen Sie eine Bewertung" : "Please select a rating");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${serverUri}/api/v1/support/tickets/${ticketData._id}/rate`,
        { score: rating, feedback },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );

      if (data.success) {
        setTicketData(data.ticket);
        setIsRating(false);
        onUpdate();
        toast.success(
          isGerman ? "Bewertung gespeichert" : "Rating saved. Thank you!"
        );
      }
    } catch (error) {
      console.error("Error rating ticket:", error);
      toast.error(
        error.response?.data?.message ||
          (isGerman ? "Fehler beim Bewerten" : "Failed to submit rating")
      );
    } finally {
      setLoading(false);
    }
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

  const getStatusLabel = (status) => {
    const labels = {
      open: isGerman ? "Offen" : "Open",
      in_progress: isGerman ? "In Bearbeitung" : "In Progress",
      resolved: isGerman ? "Gelöst" : "Resolved",
      closed: isGerman ? "Geschlossen" : "Closed",
      cancelled: isGerman ? "Storniert" : "Cancelled",
    };
    return labels[status] || status;
  };

  const canReply = ticketData?.status !== "closed" && ticketData?.status !== "cancelled";
  const canRate = ticketData?.status === "resolved" && !ticketData?.rating?.score;

  if (!ticketData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-lg font-semibold mb-1">
                {ticketData.subject}
              </DialogTitle>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>#{ticketData.ticketNumber}</span>
                <span>•</span>
                <span>
                  {format(new Date(ticketData.createdAt), "MMM d, yyyy")}
                </span>
              </div>
            </div>
            <Badge className={getStatusBadge(ticketData.status)}>
              {getStatusLabel(ticketData.status)}
            </Badge>
          </div>
        </DialogHeader>

        {/* Ticket Info */}
        <div className="py-4 border-b">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">{isGerman ? "Kategorie" : "Category"}:</span>
              <span className="ml-2 font-medium capitalize">
                {ticketData.category}
              </span>
            </div>
            <div>
              <span className="text-gray-500">{isGerman ? "Priorität" : "Priority"}:</span>
              <span className="ml-2 font-medium capitalize">
                {ticketData.priority}
              </span>
            </div>
            {ticketData.order && (
              <div>
                <span className="text-gray-500">{isGerman ? "Bestellung" : "Order"}:</span>
                <span className="ml-2 font-medium">
                  #{ticketData.order.orderNumber}
                </span>
              </div>
            )}
            {ticketData.assignedTo && (
              <div>
                <span className="text-gray-500">{isGerman ? "Zugewiesen an" : "Assigned to"}:</span>
                <span className="ml-2 font-medium">
                  {ticketData.assignedTo.name}
                </span>
              </div>
            )}
          </div>

          {ticketData.resolution && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800 font-medium mb-1">
                <CheckCircle className="h-4 w-4" />
                {isGerman ? "Lösung" : "Resolution"}
              </div>
              <p className="text-sm text-green-700">{ticketData.resolution}</p>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 max-h-[400px]">
          {/* Original Message */}
          <div className="flex gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={ticketData.user?.avatar} />
              <AvatarFallback className="bg-[#C6080A] text-white">
                {ticketData.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{ticketData.user?.name || "You"}</span>
                <span className="text-xs text-gray-500">
                  {format(new Date(ticketData.createdAt), "MMM d, HH:mm")}
                </span>
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="text-sm whitespace-pre-wrap">{ticketData.description}</p>
              </div>

              {/* Attachments */}
              {ticketData.attachments && ticketData.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {ticketData.attachments.map((att, idx) => (
                    <a
                      key={idx}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                    >
                      <Paperclip className="h-3 w-3" />
                      {att.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Replies */}
          {ticketData.replies?.map((reply, index) => (
            <div key={index} className="flex gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={reply.sender?.avatar} />
                <AvatarFallback
                  className={
                    reply.senderType === "admin"
                      ? "bg-blue-600 text-white"
                      : "bg-[#C6080A] text-white"
                  }
                >
                  {reply.senderType === "admin" ? "S" : reply.sender?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">
                    {reply.sender?.name ||
                      (reply.senderType === "admin" ? "Support" : "You")}
                  </span>
                  {reply.senderType === "admin" && (
                    <Badge variant="secondary" className="text-xs">
                      {isGerman ? "Support" : "Support"}
                    </Badge>
                  )}
                  <span className="text-xs text-gray-500">
                    {format(new Date(reply.createdAt || ticketData.createdAt), "MMM d, HH:mm")}
                  </span>
                </div>
                <div
                  className={`rounded-lg p-3 ${
                    reply.senderType === "admin"
                      ? "bg-blue-50 border border-blue-100"
                      : "bg-gray-100"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{reply.message}</p>
                </div>

                {reply.attachments && reply.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {reply.attachments.map((att, idx) => (
                      <a
                        key={idx}
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                      >
                        <Paperclip className="h-3 w-3" />
                        {att.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Rating Section */}
          {canRate && !isRating && (
            <div className="flex justify-center py-4">
              <Button
                onClick={() => setIsRating(true)}
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50"
              >
                <Star className="h-4 w-4 mr-2" />
                {isGerman ? "Ticket bewerten" : "Rate this ticket"}
              </Button>
            </div>
          )}

          {isRating && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm font-medium mb-3">
                {isGerman
                  ? "Wie zufrieden sind Sie mit der Lösung?"
                  : "How satisfied are you with the resolution?"}
              </p>
              <div className="flex gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={
                  isGerman
                    ? "Optional: Ihr Feedback..."
                    : "Optional: Your feedback..."
                }
                className="w-full p-2 border rounded-lg text-sm mb-3"
                rows={2}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleRateTicket}
                  disabled={loading || rating === 0}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Star className="h-4 w-4 mr-1" />
                      {isGerman ? "Bewertung senden" : "Submit Rating"}
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setIsRating(false)}
                  variant="outline"
                  size="sm"
                >
                  {isGerman ? "Abbrechen" : "Cancel"}
                </Button>
              </div>
            </div>
          )}

          {/* Show Rating if exists */}
          {ticketData.rating?.score && (
            <div className="flex justify-center py-4">
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700">
                  {isGerman ? "Bewertet mit" : "Rated"}
                </span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < ticketData.rating.score
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Reply Input */}
        {canReply && (
          <div className="border-t pt-4">
            <div className="flex gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={auth.user?.avatar} />
                <AvatarFallback className="bg-[#C6080A] text-white">
                  {auth.user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={
                    isGerman
                      ? "Ihre Antwort schreiben..."
                      : "Write your reply..."
                  }
                  className="min-h-[80px] mb-2"
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {replyText.length}/1000
                  </span>
                  <Button
                    onClick={handleSendReply}
                    disabled={!replyText.trim() || loading}
                    className="bg-[#C6080A] hover:bg-[#a50709]"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        {isGerman ? "Senden" : "Send"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!canReply && ticketData.status !== "resolved" && (
          <div className="border-t pt-4 text-center">
            <p className="text-sm text-gray-500">
              {ticketData.status === "closed"
                ? isGerman
                  ? "Dieses Ticket ist geschlossen."
                  : "This ticket is closed."
                : isGerman
                ? "Dieses Ticket kann nicht mehr beantwortet werden."
                : "This ticket can no longer be replied to."}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
