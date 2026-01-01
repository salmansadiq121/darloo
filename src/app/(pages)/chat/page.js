"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  ArrowLeft,
  Store,
  Package,
  ImageIcon,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  Clock,
  X,
  MessageCircle,
  User,
  ShoppingBag,
  ExternalLink,
  File,
  Mic,
  Info,
  Trash2,
  Copy,
  Reply,
  Forward,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MainLayout from "@/app/components/Layout/Layout";
import { useAuth } from "@/app/content/authContent";
import axios from "axios";
import toast from "react-hot-toast";
import socketIO from "socket.io-client";
import { format, isToday, isYesterday, formatDistanceToNow } from "date-fns";
import { TbFileDownload } from "react-icons/tb";
import { fileType } from "@/app/utils/UploadChatFile";

// Message Loader Skeleton
const MessageLoader = () => (
  <div className="space-y-4 p-4">
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
      >
        {i % 2 !== 0 && <Skeleton className="w-8 h-8 rounded-full mr-2" />}
        <div
          className={`space-y-2 ${i % 2 === 0 ? "items-end" : "items-start"}`}
        >
          <Skeleton
            className={`h-16 ${i % 2 === 0 ? "w-48" : "w-56"} rounded-2xl`}
          />
          <Skeleton className="h-3 w-16" />
        </div>
        {i % 2 === 0 && <Skeleton className="w-8 h-8 rounded-full ml-2" />}
      </div>
    ))}
  </div>
);

// Emoji data
const emojis = [
  "😊",
  "😂",
  "❤️",
  "👍",
  "🙏",
  "🔥",
  "😍",
  "😎",
  "🤔",
  "😢",
  "😡",
  "🎉",
  "👋",
  "🤝",
  "👏",
  "🙌",
  "🤷‍♂️",
  "🤦‍♀️",
  "💯",
  "🚀",
  "✅",
  "😘",
  "🥰",
  "😭",
  "😱",
  "🤗",
  "😴",
  "🤩",
  "😇",
  "🥺",
  "👌",
  "✌️",
  "🤞",
  "👀",
  "💪",
  "🎁",
  "💰",
  "📦",
  "🛒",
  "⭐",
];

// Quick questions for sellers
const quickQuestions = [
  "Is this item available?",
  "What's the delivery time?",
  "Can you offer a discount?",
  "Do you have other colors?",
  "Is this price negotiable?",
];

// Loading fallback component
function ChatPageLoading() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto h-[calc(100vh-80px)]">
          <div className="flex h-full bg-white rounded-none md:rounded-2xl md:mt-4 shadow-lg overflow-hidden">
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mx-auto mb-4" />
                <p className="text-gray-500">Loading chat...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Main chat content component that uses useSearchParams
function ChatPageContent() {
  const { auth } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sellerId = searchParams.get("sellerId");
  const productId = searchParams.get("productId");

  // State
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageSearchQuery, setMessageSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [showMessageSearch, setShowMessageSearch] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [productSearchResults, setProductSearchResults] = useState([]);
  const [isSearchingProducts, setIsSearchingProducts] = useState(false);
  const [attachedProduct, setAttachedProduct] = useState(null);

  // Refs
  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const initialMessagesLoad = useRef(true);
  const selectedChatRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Initialize socket connection
  useEffect(() => {
    if (!auth?.user?._id) return;

    const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
    if (!ENDPOINT) return;

    socketRef.current = socketIO(ENDPOINT, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      query: { userID: auth.user._id },
    });

    socketRef.current.on("connect", () => {
      console.log("Chat socket connected");
      setSocketConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      setSocketConnected(false);
    });

    // Listen for new messages in the current chat room
    socketRef.current.on("fetchMessages", (data) => {
      console.log("Received fetchMessages event:", data);
      // Add the new message directly if it's for the current chat
      if (data?.chatId && data?.message) {
        const currentChat = selectedChatRef.current;
        // Only add if message is for the currently selected chat
        if (currentChat?._id === data.chatId) {
          setMessages((prev) => {
            // Check if message already exists
            const exists = prev.some((m) => m._id === data.message._id);
            if (exists) return prev;
            return [...prev, data.message];
          });
        }
      }
    });

    // Listen for chat list updates (for latest message in sidebar)
    socketRef.current.on("chatListUpdate", () => {
      fetchChats();
    });

    // Listen for typing events
    socketRef.current.on("typing", () => setIsTyping(true));
    socketRef.current.on("stopTyping", () => setIsTyping(false));

    // Listen for user status updates
    socketRef.current.on("newUserData", (data) => {
      // Update chat list with new online status
      setChats((prevChats) =>
        prevChats.map((chat) => ({
          ...chat,
          users: chat.users.map((user) =>
            user._id === data.userID
              ? { ...user, isOnline: data.isOnline }
              : user
          ),
        }))
      );
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [auth?.user?._id]);

  // Keep ref in sync with selectedChat
  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  // Join chat room when selected
  useEffect(() => {
    if (selectedChat?._id && socketRef.current) {
      socketRef.current.emit("join chat", selectedChat._id);
    }
  }, [selectedChat?._id]);

  // Fetch user chats
  const fetchChats = useCallback(async () => {
    if (!auth?.token) return;

    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/chat/user/all`,
        {
          headers: { Authorization: auth.token },
        }
      );

      if (data?.success) {
        setChats(data.chats || []);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setIsLoading(false);
    }
  }, [auth?.token]);

  // Create or get seller chat on page load
  useEffect(() => {
    const initializeChat = async () => {
      if (!auth?.token) {
        setIsLoading(false);
        return;
      }

      await fetchChats();

      // If sellerId is provided, create/get chat with seller
      if (sellerId) {
        try {
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/chat/seller/create`,
            { sellerId, productId },
            { headers: { Authorization: auth.token } }
          );

          if (data?.success && data?.chat) {
            setSelectedChat(data.chat);
            setShowMobileChat(true);
            fetchMessages(data.chat._id);

            // If it's a new chat, refresh the chat list
            if (data.isNew) {
              fetchChats();
            }
          }
        } catch (error) {
          console.error("Error creating seller chat:", error);
          toast.error(
            error?.response?.data?.message || "Failed to start chat with seller"
          );
        }
      }
    };

    initializeChat();
  }, [auth?.token, sellerId, productId, fetchChats]);

  // Fetch messages for selected chat
  const fetchMessages = async (chatId) => {
    if (!chatId) return;

    if (initialMessagesLoad.current) {
      setIsMessagesLoading(true);
    }

    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/messages/all/${chatId}`
      );

      if (data?.success) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      if (initialMessagesLoad.current) {
        setIsMessagesLoading(false);
        initialMessagesLoad.current = false;
      }
    }
  };

  // Search products for attachment
  const searchProducts = async (query) => {
    if (!query || query.length < 2) {
      setProductSearchResults([]);
      return;
    }

    setIsSearchingProducts(true);
    try {
      const { data } = await axios.get(
        `${
          process.env.NEXT_PUBLIC_SERVER_URI
        }/api/v1/products/search/${encodeURIComponent(query)}`
      );
      if (data?.success) {
        setProductSearchResults(data.products || []);
      }
    } catch (error) {
      console.error("Error searching products:", error);
      setProductSearchResults([]);
    } finally {
      setIsSearchingProducts(false);
    }
  };

  // Debounced product search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (productSearchQuery) {
        searchProducts(productSearchQuery);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [productSearchQuery]);

  // Select product for attachment
  const handleSelectProduct = (product) => {
    setAttachedProduct(product);
    setShowProductPicker(false);
    setProductSearchQuery("");
    setProductSearchResults([]);
  };

  // Remove attached product
  const removeAttachedProduct = () => {
    setAttachedProduct(null);
  };

  // Send message
  const handleSendMessage = async (e, quickQuestion = null) => {
    if (e) e.preventDefault();

    const messageContent = quickQuestion || newMessage.trim();
    if (
      (!messageContent && !attachedProduct) ||
      !selectedChat?._id ||
      isSending
    )
      return;

    const currentAttachedProduct = attachedProduct;
    setNewMessage("");
    setAttachedProduct(null);
    setIsSending(true);
    setShowEmojiPicker(false);

    // Stop typing indicator
    if (socketRef.current && selectedChat?._id) {
      socketRef.current.emit("stopTyping", selectedChat._id);
      setTyping(false);
    }

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/messages/send`,
        {
          content:
            messageContent ||
            (currentAttachedProduct
              ? `Check out this product: ${currentAttachedProduct.name}`
              : ""),
          chatId: selectedChat._id,
          contentType: currentAttachedProduct ? "product" : "text",
          productId: currentAttachedProduct?._id || null,
        },
        { headers: { Authorization: auth.token } }
      );

      if (data?.success && data?.message) {
        // Add message to local state immediately
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === data.message._id);
          if (exists) return prev;
          return [...prev, data.message];
        });

        // Emit socket event for real-time update to other users
        if (socketRef.current) {
          socketRef.current.emit("NewMessageAdded", {
            chatId: selectedChat._id,
            message: data.message,
          });
        }

        // Update chat list locally
        fetchChats();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
      setNewMessage(messageContent);
      setAttachedProduct(currentAttachedProduct);
    } finally {
      setIsSending(false);
    }
  };

  // Handle file upload
  const handleSendFiles = async (content, mediaType) => {
    if (!selectedChat?._id) return;

    setIsUploading(true);
    setShowAttachments(false);

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/messages/send`,
        {
          content: content,
          contentType: mediaType,
          chatId: selectedChat._id,
        },
        { headers: { Authorization: auth.token } }
      );

      if (data?.success && data?.message) {
        // Add message to local state immediately
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === data.message._id);
          if (exists) return prev;
          return [...prev, data.message];
        });

        // Emit socket event for real-time update
        if (socketRef.current) {
          socketRef.current.emit("NewMessageAdded", {
            chatId: selectedChat._id,
            message: data.message,
          });
        }

        fetchChats();
        toast.success("File sent successfully!");
      }
    } catch (error) {
      console.error("Error sending file:", error);
      toast.error("Failed to send file");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle typing
  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!socketRef.current || !selectedChat?._id) return;

    // Typing indicator logic
    if (!typing) {
      setTyping(true);
      socketRef.current.emit("typing", selectedChat._id);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (socketRef.current && selectedChat?._id) {
        socketRef.current.emit("stopTyping", selectedChat._id);
        setTyping(false);
      }
    }, 1500);
  };

  // Select chat
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setShowMobileChat(true);
    initialMessagesLoad.current = true;
    fetchMessages(chat._id);
  };

  // Get other user in chat
  const getOtherUser = (chat) => {
    if (!chat?.users || !auth?.user?._id) return null;
    return chat.users.find((u) => u._id !== auth.user._id);
  };

  // Format message date for grouping
  const formatMessageDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return format(date, "MMMM dd, yyyy");
    }
  };

  // Format message time
  const formatMessageTime = (date) => {
    return format(new Date(date), "HH:mm");
  };

  // Format chat time
  const formatChatTime = (date) => {
    if (!date) return "";
    const msgDate = new Date(date);
    if (isToday(msgDate)) {
      return format(msgDate, "HH:mm");
    } else if (isYesterday(msgDate)) {
      return "Yesterday";
    }
    return format(msgDate, "dd/MM");
  };

  // Group messages by date
  const groupedMessages = messages
    ?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    ?.reduce((groups, message) => {
      const date = formatMessageDate(message?.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date]?.push(message);
      return groups;
    }, {});

  // Filter chats by search
  const filteredChats = chats.filter((chat) => {
    if (!searchQuery) return true;
    const otherUser = getOtherUser(chat);
    const query = searchQuery.toLowerCase();
    return (
      chat.chatName?.toLowerCase().includes(query) ||
      otherUser?.name?.toLowerCase().includes(query) ||
      chat.seller?.storeName?.toLowerCase().includes(query)
    );
  });

  // Copy message to clipboard
  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content);
    toast.success("Message copied!");
    setSelectedMessage(null);
  };

  // Check if user is logged in
  if (!auth?.user) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Sign in to Chat
            </h2>
            <p className="text-gray-600 mb-6">
              Please sign in to access your messages and chat with sellers.
            </p>
            <Button
              onClick={() => router.push("/authentication")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
            >
              Sign In
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto h-[calc(100vh-80px)]">
          <div className="flex h-full bg-white rounded-none md:rounded-2xl md:mt-4 shadow-lg overflow-hidden">
            {/* Chat List Sidebar */}
            <div
              className={`w-full md:w-[380px] border-r border-gray-200 flex flex-col bg-white ${
                showMobileChat ? "hidden md:flex" : "flex"
              }`}
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-emerald-600 to-teal-600">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-bold text-white flex items-center gap-2">
                    <MessageCircle className="w-6 h-6" />
                    Chats
                  </h1>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <MoreVertical className="w-5 h-5 text-white" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Menu</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <p className="text-emerald-100 text-sm mt-1">
                  {chats.length} conversation{chats.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Search */}
              <div className="p-3 bg-gray-50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search or start new chat..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white border-0 shadow-sm rounded-lg focus-visible:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Chat List */}
              <ScrollArea className="flex-1">
                {isLoading ? (
                  <div className="p-4 space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-32 mb-2" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredChats.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <MessageCircle className="w-12 h-12 mb-3 opacity-50" />
                    <p className="font-medium">No conversations yet</p>
                    <p className="text-sm">Start chatting with sellers</p>
                  </div>
                ) : (
                  <div>
                    {filteredChats.map((chat) => {
                      const otherUser = getOtherUser(chat);
                      const isSelected = selectedChat?._id === chat._id;
                      const unread =
                        chat.unreadCount?.get?.(auth.user._id) ||
                        chat.unreadCount?.[auth.user._id] ||
                        0;

                      return (
                        <motion.div
                          key={chat._id}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelectChat(chat)}
                          className={`px-4 py-3 cursor-pointer transition-all border-b border-gray-100 ${
                            isSelected ? "bg-emerald-50" : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                              {chat.chatType === "user_to_seller" &&
                              chat.seller?.storeLogo ? (
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-100">
                                  <Image
                                    src={chat.seller.storeLogo}
                                    alt={chat.seller.storeName}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <Avatar className="w-12 h-12">
                                  <AvatarImage src={otherUser?.avatar} />
                                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-semibold">
                                    {otherUser?.name?.charAt(0) ||
                                      chat.chatName?.charAt(0) ||
                                      "U"}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              {otherUser?.isOnline && (
                                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                              )}
                            </div>

                            {/* Chat Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-0.5">
                                <h3 className="font-semibold text-gray-900 truncate text-[15px]">
                                  {chat.chatType === "user_to_seller"
                                    ? chat.seller?.storeName || chat.chatName
                                    : otherUser?.name || chat.chatName}
                                </h3>
                                <span
                                  className={`text-xs ${
                                    unread > 0
                                      ? "text-emerald-600 font-semibold"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {formatChatTime(
                                    chat.latestMessage?.createdAt ||
                                      chat.updatedAt
                                  )}
                                </span>
                              </div>

                              <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-500 truncate flex-1 pr-2">
                                  {chat.latestMessage?.contentType === "text"
                                    ? chat.latestMessage?.content
                                    : chat.latestMessage?.contentType ===
                                      "Image"
                                    ? "📷 Photo"
                                    : chat.latestMessage?.contentType ===
                                      "Video"
                                    ? "🎥 Video"
                                    : chat.latestMessage?.contentType ===
                                      "Audio"
                                    ? "🎵 Audio"
                                    : chat.latestMessage?.contentType
                                    ? "📎 File"
                                    : "No messages yet"}
                                </p>

                                {/* Unread Badge */}
                                {unread > 0 && (
                                  <span className="min-w-[20px] h-5 flex items-center justify-center bg-emerald-500 text-white text-xs font-bold rounded-full px-1.5">
                                    {unread > 99 ? "99+" : unread}
                                  </span>
                                )}
                              </div>

                              {/* Product Badge */}
                              {chat.product && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Package className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-500 truncate">
                                    {chat.product.name}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Chat Area */}
            <div
              className={`flex-1 flex flex-col bg-[#e5ddd5] ${
                !showMobileChat ? "hidden md:flex" : "flex"
              }`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8c8c8' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            >
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="px-4 py-3 bg-gray-100 border-b border-gray-200 flex items-center gap-3">
                    {/* Back Button (Mobile) */}
                    <button
                      onClick={() => setShowMobileChat(false)}
                      className="md:hidden p-1.5 hover:bg-gray-200 rounded-full"
                    >
                      <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>

                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {selectedChat.chatType === "user_to_seller" &&
                      selectedChat.seller?.storeLogo ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={selectedChat.seller.storeLogo}
                            alt={selectedChat.seller.storeName}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <Avatar className="w-10 h-10">
                          <AvatarImage
                            src={getOtherUser(selectedChat)?.avatar}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                            {getOtherUser(selectedChat)?.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-gray-900 truncate text-[15px]">
                        {selectedChat.chatType === "user_to_seller"
                          ? selectedChat.seller?.storeName
                          : getOtherUser(selectedChat)?.name}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {isTyping ? (
                          <span className="text-emerald-600">typing...</span>
                        ) : getOtherUser(selectedChat)?.isOnline ? (
                          <span className="text-emerald-600">online</span>
                        ) : (
                          "offline"
                        )}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() =>
                                setShowMessageSearch(!showMessageSearch)
                              }
                              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            >
                              <Search className="w-5 h-5 text-gray-600" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Search messages</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {selectedChat.chatType === "user_to_seller" &&
                        selectedChat.seller?.storeSlug && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link
                                  href={`/store/${selectedChat.seller.storeSlug}`}
                                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                >
                                  <Store className="w-5 h-5 text-gray-600" />
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent>Visit Store</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => setShowChatInfo(true)}
                          >
                            <Info className="w-4 h-4 mr-2" />
                            Contact info
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Search className="w-4 h-4 mr-2" />
                            Search messages
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Product Context Banner */}
                  {selectedChat.product && (
                    <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-100 flex items-center gap-3">
                      {selectedChat.product.thumbnail && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-emerald-200 flex-shrink-0">
                          <Image
                            src={selectedChat.product.thumbnail}
                            alt={selectedChat.product.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {selectedChat.product.name}
                        </p>
                        <p className="text-xs text-emerald-600">
                          Chatting about this product
                        </p>
                      </div>
                      <Link
                        href={`/products/${selectedChat.product._id}`}
                        className="text-xs text-emerald-600 hover:underline flex items-center gap-1 flex-shrink-0"
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  )}

                  {/* Quick Questions */}
                  {messages.length === 0 && !isMessagesLoading && (
                    <div className="px-4 py-3 bg-white/80 border-b">
                      <p className="text-xs text-gray-500 mb-2 font-medium">
                        Quick Questions:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {quickQuestions.map((question, index) => (
                          <button
                            key={index}
                            onClick={() => handleSendMessage(null, question)}
                            className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-colors"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Messages */}
                  <div
                    ref={messageContainerRef}
                    className="flex-1 overflow-y-auto px-4 py-2"
                    style={{ maxHeight: "calc(100vh - 280px)" }}
                  >
                    {isMessagesLoading ? (
                      <MessageLoader />
                    ) : Object.keys(groupedMessages || {}).length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <div className="w-20 h-20 bg-white/80 rounded-full flex items-center justify-center mb-4 shadow-sm">
                          <MessageCircle className="w-10 h-10 text-emerald-300" />
                        </div>
                        <p className="font-medium text-gray-700">
                          No messages yet
                        </p>
                        <p className="text-sm text-gray-500">
                          Send a message to start the conversation
                        </p>
                      </div>
                    ) : (
                      Object.entries(groupedMessages).map(
                        ([date, dateMessages]) => (
                          <div key={date}>
                            {/* Date Separator */}
                            <div className="flex justify-center my-4">
                              <span className="text-xs bg-white/90 text-gray-600 px-3 py-1 rounded-lg shadow-sm">
                                {date}
                              </span>
                            </div>

                            {/* Messages for this date */}
                            {dateMessages.map((message, index) => {
                              const isMine =
                                message.sender?._id === auth.user._id;
                              const showAvatar =
                                !isMine &&
                                (index === 0 ||
                                  dateMessages[index - 1]?.sender?._id !==
                                    message.sender?._id);

                              return (
                                <motion.div
                                  key={message._id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className={`flex mb-1 ${
                                    isMine ? "justify-end" : "justify-start"
                                  }`}
                                >
                                  {/* Avatar for other user */}
                                  {!isMine && showAvatar && (
                                    <Avatar className="w-8 h-8 mr-2 mt-auto flex-shrink-0">
                                      <AvatarImage
                                        src={message.sender?.avatar}
                                      />
                                      <AvatarFallback className="text-xs bg-gray-300">
                                        {message.sender?.name?.charAt(0) || "U"}
                                      </AvatarFallback>
                                    </Avatar>
                                  )}
                                  {!isMine && !showAvatar && (
                                    <div className="w-8 mr-2 flex-shrink-0" />
                                  )}

                                  {/* Message Bubble */}
                                  <div
                                    className={`max-w-[75%] md:max-w-[65%] rounded-lg px-3 py-2 shadow-sm ${
                                      isMine
                                        ? "bg-[#dcf8c6] rounded-tr-none"
                                        : "bg-white rounded-tl-none"
                                    }`}
                                  >
                                    {/* Message Content */}
                                    {message.contentType === "product" &&
                                    message.product ? (
                                      <div className="min-w-[200px] max-w-[260px]">
                                        <Link
                                          href={`/products/${message.product._id}`}
                                          className="block border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all bg-white"
                                        >
                                          {/* Product Image - check thumbnails, images.gallery, variations */}
                                          {(() => {
                                            const productImage =
                                              message.product.thumbnails ||
                                              message.product.images
                                                ?.gallery?.[0]?.url ||
                                              message.product.variations?.[0]
                                                ?.imageURL;
                                            return productImage ? (
                                              <div className="relative w-full h-36 bg-gradient-to-br from-gray-100 to-gray-50">
                                                <Image
                                                  src={productImage}
                                                  alt={
                                                    message.product.name ||
                                                    "Product"
                                                  }
                                                  fill
                                                  className="object-cover"
                                                />
                                                {/* Product badge */}
                                                <div className="absolute top-2 left-2">
                                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-medium text-gray-700 shadow-sm">
                                                    <Package className="w-3 h-3 text-emerald-500" />
                                                    Product
                                                  </span>
                                                </div>
                                              </div>
                                            ) : (
                                              <div className="w-full h-36 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                                                <div className="text-center">
                                                  <Package className="w-10 h-10 text-gray-300 mx-auto mb-1" />
                                                  <span className="text-xs text-gray-400">
                                                    No image
                                                  </span>
                                                </div>
                                              </div>
                                            );
                                          })()}
                                          <div className="p-3">
                                            <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
                                              {message.product.name ||
                                                "Product"}
                                            </p>
                                            <div className="flex items-center justify-between mt-2">
                                              <p className="text-base font-bold text-emerald-600">
                                                €
                                                {message.product.price?.toFixed(
                                                  2
                                                ) || "0.00"}
                                              </p>
                                              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                                <ExternalLink className="w-3 h-3" />
                                                View
                                              </span>
                                            </div>
                                          </div>
                                        </Link>
                                        {message.content &&
                                          message.content !==
                                            `Check out this product: ${message.product.name}` && (
                                            <p className="text-sm text-gray-900 mt-2 whitespace-pre-wrap break-words">
                                              {message.content}
                                            </p>
                                          )}
                                      </div>
                                    ) : message.contentType === "text" ? (
                                      <p className="text-sm text-gray-900 whitespace-pre-wrap break-words">
                                        {message.content}
                                      </p>
                                    ) : message.contentType === "Image" ? (
                                      <a
                                        href={message.content}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                      >
                                        <Image
                                          src={message.content}
                                          alt="Sent image"
                                          width={250}
                                          height={200}
                                          className="rounded-lg max-w-full h-auto object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                        />
                                      </a>
                                    ) : message.contentType === "Video" ? (
                                      <video
                                        controls
                                        className="rounded-lg max-w-full"
                                        style={{ maxHeight: "250px" }}
                                      >
                                        <source
                                          src={message.content}
                                          type="video/mp4"
                                        />
                                        Your browser does not support video.
                                      </video>
                                    ) : message.contentType === "Audio" ? (
                                      <audio
                                        controls
                                        className="w-full max-w-[250px]"
                                      >
                                        <source
                                          src={message.content}
                                          type="audio/mpeg"
                                        />
                                        Your browser does not support audio.
                                      </audio>
                                    ) : (
                                      <a
                                        href={message.content}
                                        download
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 py-2 px-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                      >
                                        <TbFileDownload className="h-5 w-5 text-emerald-600" />
                                        <span className="text-sm text-gray-700">
                                          Download File
                                        </span>
                                      </a>
                                    )}

                                    {/* Time & Read Receipt */}
                                    <div
                                      className={`flex items-center justify-end gap-1 mt-1`}
                                    >
                                      <span className="text-[10px] text-gray-500">
                                        {formatMessageTime(message.createdAt)}
                                      </span>
                                      {isMine && (
                                        <>
                                          {message.read ? (
                                            <CheckCheck className="w-4 h-4 text-blue-500" />
                                          ) : (
                                            <Check className="w-4 h-4 text-gray-400" />
                                          )}
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        )
                      )
                    )}

                    {/* Typing Indicator */}
                    <AnimatePresence>
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="flex mb-2 justify-start"
                        >
                          <div className="w-8 mr-2" />
                          <div className="bg-white rounded-lg rounded-tl-none px-4 py-3 shadow-sm">
                            <div className="flex space-x-1">
                              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" />
                              <div
                                className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              />
                              <div
                                className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.4s" }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="px-3 py-2 bg-gray-100 mt-8">
                    {/* Attached Product Preview */}
                    {attachedProduct && (
                      <div className="mb-2 bg-white rounded-lg p-2 flex items-center gap-3 border border-emerald-200">
                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          {attachedProduct.thumbnail ? (
                            <Image
                              src={attachedProduct.thumbnail}
                              alt={attachedProduct.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {attachedProduct.name}
                          </p>
                          <p className="text-xs text-emerald-600 font-semibold">
                            ${attachedProduct.price?.toFixed(2)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={removeAttachedProduct}
                          className="p-1 hover:bg-gray-100 rounded-full"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    )}

                    <form
                      onSubmit={handleSendMessage}
                      className="flex items-center gap-2"
                    >
                      {/* Emoji Picker */}
                      <Popover
                        open={showEmojiPicker}
                        onOpenChange={setShowEmojiPicker}
                      >
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
                          >
                            <Smile className="w-6 h-6 text-gray-500" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-72 p-2"
                          side="top"
                          align="start"
                        >
                          <div className="grid grid-cols-8 gap-1">
                            {emojis.map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center text-xl"
                                onClick={() => {
                                  setNewMessage((prev) => prev + emoji);
                                  setShowEmojiPicker(false);
                                }}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>

                      {/* Attachments */}
                      <Popover
                        open={showAttachments}
                        onOpenChange={setShowAttachments}
                      >
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
                            disabled={isUploading}
                          >
                            <Paperclip
                              className={`w-6 h-6 ${
                                isUploading
                                  ? "text-gray-300 animate-pulse"
                                  : "text-gray-500"
                              }`}
                            />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-48 p-2"
                          side="top"
                          align="start"
                        >
                          <div className="flex flex-col space-y-1">
                            <label className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                              <ImageIcon className="w-5 h-5 text-purple-500" />
                              <span className="text-sm">Image</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files[0]) {
                                    fileType(
                                      e.target.files[0],
                                      handleSendFiles,
                                      setIsUploading
                                    );
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                            <label className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                              <File className="w-5 h-5 text-blue-500" />
                              <span className="text-sm">Document</span>
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip"
                                onChange={(e) => {
                                  if (e.target.files[0]) {
                                    fileType(
                                      e.target.files[0],
                                      handleSendFiles,
                                      setIsUploading
                                    );
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                            <label className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                              <Video className="w-5 h-5 text-red-500" />
                              <span className="text-sm">Video</span>
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => {
                                  if (e.target.files[0]) {
                                    fileType(
                                      e.target.files[0],
                                      handleSendFiles,
                                      setIsUploading
                                    );
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setShowAttachments(false);
                                setShowProductPicker(true);
                              }}
                              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors w-full text-left"
                            >
                              <ShoppingBag className="w-5 h-5 text-emerald-500" />
                              <span className="text-sm">Product</span>
                            </button>
                          </div>
                        </PopoverContent>
                      </Popover>

                      {/* Product Share Button */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={() => setShowProductPicker(true)}
                              className="p-2 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
                            >
                              <ShoppingBag className="w-6 h-6 text-emerald-500" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Share Product</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* Product Picker Modal */}
                      <Popover
                        open={showProductPicker}
                        onOpenChange={setShowProductPicker}
                      >
                        <PopoverTrigger asChild>
                          <span></span>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-80 p-0"
                          side="top"
                          align="start"
                        >
                          <div className="p-3 border-b">
                            <h4 className="font-semibold text-sm mb-2">
                              Attach a Product
                            </h4>
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input
                                type="text"
                                placeholder="Search products..."
                                value={productSearchQuery}
                                onChange={(e) =>
                                  setProductSearchQuery(e.target.value)
                                }
                                className="pl-9 h-9 text-sm"
                              />
                            </div>
                          </div>
                          <ScrollArea className="max-h-64">
                            {isSearchingProducts ? (
                              <div className="p-4 space-y-3">
                                {[1, 2, 3].map((i) => (
                                  <div
                                    key={i}
                                    className="flex items-center gap-3"
                                  >
                                    <Skeleton className="w-12 h-12 rounded" />
                                    <div className="flex-1">
                                      <Skeleton className="h-4 w-32 mb-1" />
                                      <Skeleton className="h-3 w-20" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : productSearchResults.length === 0 ? (
                              <div className="p-4 text-center text-gray-500 text-sm">
                                {productSearchQuery.length < 2
                                  ? "Type to search products..."
                                  : "No products found"}
                              </div>
                            ) : (
                              <div className="p-2">
                                {productSearchResults.map((product) => (
                                  <button
                                    key={product._id}
                                    type="button"
                                    onClick={() => handleSelectProduct(product)}
                                    className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors text-left"
                                  >
                                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                      {product.thumbnail ? (
                                        <Image
                                          src={product.thumbnail}
                                          alt={product.name}
                                          width={48}
                                          height={48}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                          <Package className="w-6 h-6 text-gray-400" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">
                                        {product.name}
                                      </p>
                                      <p className="text-xs text-emerald-600 font-semibold">
                                        ${product.price?.toFixed(2)}
                                      </p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </ScrollArea>
                        </PopoverContent>
                      </Popover>

                      {/* Text Input */}
                      <div className="flex-1">
                        <Input
                          type="text"
                          placeholder="Type a message"
                          value={newMessage}
                          onChange={handleTyping}
                          className="bg-white border-0 rounded-full shadow-sm focus-visible:ring-emerald-500"
                          disabled={isSending || isUploading}
                        />
                      </div>

                      {/* Send Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={
                          (!newMessage.trim() && !attachedProduct) ||
                          isSending ||
                          isUploading
                        }
                        className={`p-2.5 rounded-full transition-all flex-shrink-0 ${
                          newMessage.trim() || attachedProduct
                            ? "bg-emerald-500 text-white shadow-md hover:bg-emerald-600"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        {isSending || isUploading ? (
                          <Clock className="w-5 h-5 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </motion.button>
                    </form>
                  </div>
                </>
              ) : (
                /* No Chat Selected */
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="w-40 h-40 mx-auto mb-6 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full opacity-50" />
                      <div className="absolute inset-4 bg-white rounded-full shadow-lg flex items-center justify-center">
                        <MessageCircle className="w-16 h-16 text-emerald-300" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-light text-gray-700 mb-2">
                      WhatsApp Clone
                    </h2>
                    <p className="text-gray-500 max-w-sm">
                      Send and receive messages with sellers. Click on a chat to
                      start messaging.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Default export with Suspense boundary for useSearchParams
export default function ChatPage() {
  return (
    <Suspense fallback={<ChatPageLoading />}>
      <ChatPageContent />
    </Suspense>
  );
}
