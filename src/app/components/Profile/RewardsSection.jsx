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
import { Progress } from "@/components/ui/progress";
import {
  Gift,
  Star,
  Trophy,
  Zap,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Clock,
  Ticket,
  Sparkles,
  TrendingUp,
  Award,
  Crown,
} from "lucide-react";
import toast from "react-hot-toast";
import DailyRewardModal from "./DailyRewardModal";
import RedeemPointsModal from "./RedeemPointsModal";

export default function RewardsSection({ countryCode, auth }) {
  const [program, setProgram] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isDailyModalOpen, setIsDailyModalOpen] = useState(false);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);

  const serverUri = process.env.NEXT_PUBLIC_SERVER_URI;
  const isGerman = countryCode === "DE";

  const fetchRewardsData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${serverUri}/api/v1/rewards/me`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (data.success) {
        setProgram(data.program);
        setTransactions(data.recentTransactions || []);
        setRedemptions(data.activeRedemptions || []);
      }
    } catch (error) {
      console.error("Error fetching rewards:", error);
      toast.error(isGerman ? "Fehler beim Laden der Belohnungen" : "Failed to load rewards");
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get(`${serverUri}/api/v1/rewards/events`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (data.success) {
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    if (auth.token) {
      fetchRewardsData();
      fetchEvents();
    }
  }, [auth.token]);

  const handleDailyClaim = () => {
    setIsDailyModalOpen(true);
  };

  const handleRedeem = () => {
    setIsRedeemModalOpen(true);
  };

  const handleDailySuccess = (data) => {
    setProgram((prev) => ({
      ...prev,
      points: data.totalPoints,
      dailyReward: {
        ...prev?.dailyReward,
        lastClaimed: new Date(),
        streak: data.streak,
      },
    }));
    fetchRewardsData();
  };

  const handleRedeemSuccess = () => {
    fetchRewardsData();
  };

  const getTierIcon = (tier) => {
    switch (tier) {
      case "bronze":
        return <Award className="h-6 w-6 text-amber-700" />;
      case "silver":
        return <Award className="h-6 w-6 text-gray-400" />;
      case "gold":
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case "platinum":
        return <Crown className="h-6 w-6 text-blue-400" />;
      case "diamond":
        return <Crown className="h-6 w-6 text-purple-500" />;
      default:
        return <Award className="h-6 w-6 text-amber-700" />;
    }
  };

  const getTierColor = (tier) => {
    const colors = {
      bronze: "bg-amber-100 text-amber-800 border-amber-200",
      silver: "bg-gray-100 text-gray-800 border-gray-200",
      gold: "bg-yellow-100 text-yellow-800 border-yellow-200",
      platinum: "bg-blue-100 text-blue-800 border-blue-200",
      diamond: "bg-purple-100 text-purple-800 border-purple-200",
    };
    return colors[tier] || colors.bronze;
  };

  const getTierProgress = () => {
    if (!program) return { current: 0, next: 100, progress: 0 };
    const tiers = {
      bronze: { next: "silver", threshold: 100 },
      silver: { next: "gold", threshold: 500 },
      gold: { next: "platinum", threshold: 2000 },
      platinum: { next: "diamond", threshold: 10000 },
      diamond: { next: null, threshold: null },
    };

    const currentTier = tiers[program.tier];
    if (!currentTier.next) {
      return { current: program.tierPoints, next: program.nextTierPoints, progress: 100 };
    }

    const progress = Math.min(
      100,
      Math.round((program.tierPoints / program.nextTierPoints) * 100)
    );
    return {
      current: program.tierPoints,
      next: program.nextTierPoints,
      progress,
    };
  };

  const tierProgress = getTierProgress();

  const getTransactionIcon = (type) => {
    switch (type) {
      case "earned":
      case "bonus":
      case "daily_reward":
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case "redeemed":
      case "expired":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      default:
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case "earned":
      case "bonus":
      case "daily_reward":
        return "text-green-600";
      case "redeemed":
      case "expired":
        return "text-red-600";
      default:
        return "text-blue-600";
    }
  };

  const canClaimDaily = () => {
    if (!program?.dailyReward?.lastClaimed) return true;
    const lastClaimed = new Date(program.dailyReward.lastClaimed);
    const now = new Date();
    const hoursSinceLastClaim = (now - lastClaimed) / (1000 * 60 * 60);
    return hoursSinceLastClaim >= 24;
  };

  const getNextClaimTime = () => {
    if (!program?.dailyReward?.lastClaimed) return null;
    const lastClaimed = new Date(program.dailyReward.lastClaimed);
    const nextClaim = new Date(lastClaimed.getTime() + 24 * 60 * 60 * 1000);
    return nextClaim;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{isGerman ? "Belohnungen" : "Rewards"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-[#C6080A]" />
              {isGerman ? "Meine Belohnungen" : "My Rewards"}
            </CardTitle>
            <CardDescription>
              {isGerman
                ? "Verdienen und Einlösen von Punkten für Rabatte"
                : "Earn and redeem points for discounts"}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleDailyClaim}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              disabled={!canClaimDaily()}
            >
              <Calendar className="h-4 w-4 mr-2" />
              {isGerman ? "Tägliche Belohnung" : "Daily Reward"}
            </Button>
            <Button
              onClick={handleRedeem}
              className="bg-[#C6080A] hover:bg-[#a50709]"
              disabled={!program || program.points <= 0}
            >
              <Ticket className="h-4 w-4 mr-2" />
              {isGerman ? "Einlösen" : "Redeem"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">
                {isGerman ? "Übersicht" : "Overview"}
              </TabsTrigger>
              <TabsTrigger value="transactions">
                {isGerman ? "Transaktionen" : "Transactions"}
              </TabsTrigger>
              <TabsTrigger value="coupons">
                {isGerman ? "Gutscheine" : "Coupons"}
              </TabsTrigger>
              <TabsTrigger value="events">
                {isGerman ? "Events" : "Events"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Points & Tier Card */}
              <div className="bg-gradient-to-br from-[#C6080A] to-[#a50709] rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-white/80 text-sm mb-1">
                      {isGerman ? "Verfügbare Punkte" : "Available Points"}
                    </p>
                    <h3 className="text-4xl font-bold">
                      {program?.points?.toLocaleString() || "0"}
                    </h3>
                  </div>
                  <div className="text-right">
                    <Badge className={`${getTierColor(program?.tier)} text-base px-3 py-1`}>
                      <span className="flex items-center gap-1">
                        {getTierIcon(program?.tier)}
                        {program?.tier?.toUpperCase()}
                      </span>
                    </Badge>
                  </div>
                </div>

                {/* Tier Progress */}
                {program?.tier !== "diamond" && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/80">
                        {isGerman ? "Fortschritt zum nächsten Level" : "Progress to next tier"}
                      </span>
                      <span className="font-medium">
                        {tierProgress.current} / {tierProgress.next}
                      </span>
                    </div>
                    <Progress value={tierProgress.progress} className="h-2 bg-white/20" />
                    <p className="text-xs text-white/60 mt-1">
                      {tierProgress.progress}% {isGerman ? "abgeschlossen" : "completed"}
                    </p>
                  </div>
                )}

                {program?.tier === "diamond" && (
                  <div className="mt-4 flex items-center gap-2 text-yellow-300">
                    <Crown className="h-5 w-5" />
                    <span className="font-medium">
                      {isGerman ? "Maximales Level erreicht!" : "Maximum tier achieved!"}
                    </span>
                  </div>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <p className="text-sm text-green-600 mb-1">
                      {isGerman ? "Gesamt verdient" : "Total Earned"}
                    </p>
                    <p className="text-xl font-bold text-green-700">
                      {program?.totalEarned?.toLocaleString() || "0"}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-4">
                    <p className="text-sm text-red-600 mb-1">
                      {isGerman ? "Eingelöst" : "Redeemed"}
                    </p>
                    <p className="text-xl font-bold text-red-700">
                      {program?.totalRedeemed?.toLocaleString() || "0"}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <p className="text-sm text-blue-600 mb-1">
                      {isGerman ? "Streak" : "Streak"}
                    </p>
                    <p className="text-xl font-bold text-blue-700">
                      {program?.dailyReward?.streak || "0"}{" "}
                      {isGerman ? "Tage" : "days"}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4">
                    <p className="text-sm text-purple-600 mb-1">
                      {isGerman ? "Max Streak" : "Max Streak"}
                    </p>
                    <p className="text-xl font-bold text-purple-700">
                      {program?.dailyReward?.maxStreak || "0"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Daily Reward Status */}
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-full">
                        <Calendar className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {isGerman ? "Tägliche Belohnung" : "Daily Reward"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {canClaimDaily() ? (
                            <span className="text-green-600">
                              {isGerman ? "Bereit zum Abholen!" : "Ready to claim!"}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {isGerman
                                ? `Nächste Belohnung: ${format(getNextClaimTime(), "HH:mm")}`
                                : `Next reward: ${format(getNextClaimTime(), "HH:mm")}`}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleDailyClaim}
                      disabled={!canClaimDaily()}
                      size="sm"
                      className="bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                      {canClaimDaily()
                        ? isGerman
                          ? "Abholen"
                          : "Claim"
                        : isGerman
                        ? "Warten"
                        : "Wait"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Tier Benefits */}
              <div>
                <h4 className="font-semibold mb-3">
                  {isGerman ? "Level-Vorteile" : "Tier Benefits"}
                </h4>
                <div className="space-y-2">
                  {[
                    { tier: "bronze", points: "1x", benefit: isGerman ? "Basis-Punkte" : "Base points" },
                    { tier: "silver", points: "1.1x", benefit: isGerman ? "10% Bonus" : "10% bonus" },
                    { tier: "gold", points: "1.25x", benefit: isGerman ? "25% Bonus + Gratis Versand" : "25% bonus + Free shipping" },
                    { tier: "platinum", points: "1.5x", benefit: isGerman ? "50% Bonus + Priorität Support" : "50% bonus + Priority support" },
                    { tier: "diamond", points: "2x", benefit: isGerman ? "100% Bonus + Exklusive Deals" : "100% bonus + Exclusive deals" },
                  ].map((t) => (
                    <div
                      key={t.tier}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        program?.tier === t.tier
                          ? "bg-red-50 border border-red-200"
                          : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {getTierIcon(t.tier)}
                        <div>
                          <p className={`font-medium capitalize ${program?.tier === t.tier ? "text-[#C6080A]" : ""}`}>
                            {t.tier}
                          </p>
                          <p className="text-xs text-gray-500">{t.benefit}</p>
                        </div>
                      </div>
                      <Badge variant={program?.tier === t.tier ? "default" : "secondary"}>
                        {t.points}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="transactions">
              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#C6080A]/20 to-orange-500/20 rounded-full blur-xl animate-pulse"></div>
                      <div className="relative p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full border-2 border-dashed border-gray-300">
                        <RefreshCw className="h-12 w-12 text-gray-400 animate-spin" style={{ animationDuration: '3s' }} />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {isGerman ? "Noch keine Transaktionen" : "No Transactions Yet"}
                    </h3>
                    <p className="text-sm text-gray-500 text-center max-w-sm mb-4">
                      {isGerman 
                        ? "Starten Sie mit dem Daily Check-in oder tätigen Sie einen Einkauf, um Punkte zu verdienen!"
                        : "Start with daily check-in or make a purchase to earn points!"}
                    </p>
                    <Button
                      onClick={handleDailyClaim}
                      className="bg-gradient-to-r from-[#C6080A] to-orange-500 hover:from-[#a50709] hover:to-orange-600 text-white"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      {isGerman ? "Erste Punkte sammeln" : "Earn First Points"}
                    </Button>
                  </div>
                ) : (
                  transactions.map((tx) => (
                    <div
                      key={tx._id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-100 rounded-full">
                          {getTransactionIcon(tx.type)}
                        </div>
                        <div>
                          <p className="font-medium capitalize">{tx.type.replace("_", " ")}</p>
                          <p className="text-sm text-gray-500">{tx.description || "No description"}</p>
                          <p className="text-xs text-gray-400">
                            {format(new Date(tx.createdAt), "MMM d, yyyy HH:mm")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${getTransactionColor(tx.type)}`}>
                          {tx.points > 0 ? "+" : ""}
                          {tx.points}
                        </p>
                        <p className="text-xs text-gray-500">
                          {isGerman ? "Guthaben" : "Balance"}: {tx.balanceAfter}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="coupons">
              <div className="space-y-4">
                {redemptions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-emerald-500/30 rounded-full blur-xl animate-pulse"></div>
                      <div className="relative p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-full border-2 border-dashed border-green-300">
                        <Ticket className="h-12 w-12 text-green-500 animate-bounce" style={{ animationDuration: '2s' }} />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {isGerman ? "Keine aktiven Gutscheine" : "No Active Coupons"}
                    </h3>
                    <p className="text-sm text-gray-500 text-center max-w-sm mb-4">
                      {isGerman 
                        ? "Lösen Sie Ihre Punkte in Rabatt-Gutscheine um, die Sie beim Checkout verwenden können!"
                        : "Redeem your points for discount coupons to use at checkout!"}
                    </p>
                    <Button
                      onClick={handleRedeem}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      {isGerman ? "Punkte einlösen" : "Redeem Points"}
                    </Button>
                  </div>
                ) : (
                  redemptions.map((redemption) => (
                    <div
                      key={redemption._id}
                      className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Ticket className="h-5 w-5 text-green-600" />
                          <span className="font-bold text-lg font-mono">
                            {redemption.coupon?.code}
                          </span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {redemption.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {redemption.discountType === "percentage"
                          ? `${redemption.discountValue}% OFF`
                          : `€${redemption.discountAmount} OFF`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {isGerman ? "Gültig bis" : "Valid until"}:{" "}
                        {format(new Date(redemption.coupon?.expiryDate), "MMM d, yyyy")}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {isGerman ? "Eingelöst mit" : "Redeemed with"} {redemption.pointsUsed}{" "}
                        {isGerman ? "Punkten" : "points"}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="events">
              <div className="space-y-4">
                {events.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-pink-500/30 rounded-full blur-xl animate-pulse"></div>
                      <div className="relative p-6 bg-gradient-to-br from-purple-50 to-pink-100 rounded-full border-2 border-dashed border-purple-300">
                        <Sparkles className="h-12 w-12 text-purple-500 animate-pulse" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {isGerman ? "Keine aktiven Events" : "No Active Events"}
                    </h3>
                    <p className="text-sm text-gray-500 text-center max-w-sm mb-4">
                      {isGerman 
                        ? "Bleiben Sie dran! Bald gibt es spannende Bonus-Events und Sonderaktionen!"
                        : "Stay tuned! Exciting bonus events and special promotions coming soon!"}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-purple-600 bg-purple-50 px-4 py-2 rounded-full">
                      <Clock className="h-4 w-4 animate-pulse" />
                      <span>{isGerman ? "Demnächst verfügbar" : "Coming soon"}</span>
                    </div>
                  </div>
                ) : (
                  events.map((event) => (
                    <div
                      key={event._id}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-yellow-500" />
                            {event.name}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              {event.points} {isGerman ? "Punkte" : "points"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {isGerman ? "Endet" : "Ends"}:{" "}
                              {format(new Date(event.endDate), "MMM d")}
                            </span>
                          </div>
                        </div>
                        <Badge variant="secondary">{event.type}</Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <DailyRewardModal
        isOpen={isDailyModalOpen}
        onClose={() => setIsDailyModalOpen(false)}
        onSuccess={handleDailySuccess}
        program={program}
        auth={auth}
        countryCode={countryCode}
      />

      <RedeemPointsModal
        isOpen={isRedeemModalOpen}
        onClose={() => setIsRedeemModalOpen(false)}
        onSuccess={handleRedeemSuccess}
        program={program}
        auth={auth}
        countryCode={countryCode}
      />
    </>
  );
}
