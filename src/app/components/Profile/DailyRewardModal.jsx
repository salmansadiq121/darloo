"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Gift, Calendar, Star, TrendingUp, CheckCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { format, differenceInHours } from "date-fns";

export default function DailyRewardModal({
  isOpen,
  onClose,
  onSuccess,
  program,
  auth,
  countryCode,
}) {
  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [claimData, setClaimData] = useState(null);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });

  const isGerman = countryCode === "DE";
  const serverUri = process.env.NEXT_PUBLIC_SERVER_URI;

  const streak = program?.dailyReward?.streak || 0;
  const lastClaimed = program?.dailyReward?.lastClaimed;

  // Calculate reward based on streak
  const basePoints = 5;
  const streakBonus = Math.min(streak * 2, 20);
  const nextReward = basePoints + streakBonus;

  // Check if can claim
  const canClaim = () => {
    if (!lastClaimed) return true;
    const hoursSinceLastClaim = differenceInHours(new Date(), new Date(lastClaimed));
    return hoursSinceLastClaim >= 24;
  };

  // Countdown timer
  useEffect(() => {
    if (!lastClaimed || canClaim()) return;

    const updateCountdown = () => {
      const lastClaimedDate = new Date(lastClaimed);
      const nextClaimTime = new Date(lastClaimedDate.getTime() + 24 * 60 * 60 * 1000);
      const now = new Date();
      const diff = nextClaimTime - now;

      if (diff <= 0) {
        setCountdown({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [lastClaimed]);

  const handleClaim = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${serverUri}/api/v1/rewards/daily-claim`,
        {},
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );

      if (data.success) {
        setClaimed(true);
        setClaimData(data);
        onSuccess(data);
        toast.success(
          isGerman
            ? `Glückwunsch! ${data.pointsAwarded} Punkte erhalten!`
            : `Congratulations! You received ${data.pointsAwarded} points!`
        );
      }
    } catch (error) {
      console.error("Error claiming daily reward:", error);
      const message =
        error.response?.data?.message ||
        (isGerman ? "Fehler beim Abholen" : "Failed to claim reward");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setClaimed(false);
    setClaimData(null);
    onClose();
  };

  const getStreakMessage = () => {
    if (streak === 0) return isGerman ? "Starte deine Streak!" : "Start your streak!";
    if (streak < 3) return isGerman ? "Guter Anfang!" : "Good start!";
    if (streak < 7) return isGerman ? "Super Streak!" : "Great streak!";
    if (streak < 14) return isGerman ? "Beeindruckend!" : "Impressive!";
    return isGerman ? "Unglaublich!" : "Amazing!";
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 justify-center text-2xl">
            <Gift className="h-6 w-6 text-yellow-500" />
            {isGerman ? "Tägliche Belohnung" : "Daily Reward"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isGerman
              ? "Komme jeden Tag zurück für mehr Punkte!"
              : "Come back every day for more points!"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {!claimed ? (
            <>
              {/* Streak Display */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mb-4 shadow-lg">
                  <div className="text-center text-white">
                    <div className="text-3xl font-bold">{streak}</div>
                    <div className="text-xs">{isGerman ? "Tage" : "days"}</div>
                  </div>
                </div>
                <p className="text-lg font-medium text-gray-800">
                  {getStreakMessage()}
                </p>
                {streak > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {isGerman ? "Aktuelle Streak" : "Current streak"}: {streak}{" "}
                    {streak === 1 ? (isGerman ? "Tag" : "day") : isGerman ? "Tage" : "days"}
                  </p>
                )}
              </div>

              {/* Reward Info */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600">{isGerman ? "Basis-Belohnung" : "Base reward"}</span>
                  <span className="font-semibold">+{basePoints} pts</span>
                </div>
                {streak > 0 && (
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600 flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      {isGerman ? "Streak-Bonus" : "Streak bonus"}
                    </span>
                    <span className="font-semibold text-green-600">+{streakBonus} pts</span>
                  </div>
                )}
                <div className="border-t border-yellow-200 pt-3 flex items-center justify-between">
                  <span className="font-medium">{isGerman ? "Gesamt" : "Total"}</span>
                  <span className="text-2xl font-bold text-yellow-600">+{nextReward} pts</span>
                </div>
              </div>

              {/* Next Rewards Preview */}
              <div className="space-y-2 mb-6">
                <p className="text-sm text-gray-500 text-center">
                  {isGerman ? "Nächste Belohnungen" : "Next rewards"}
                </p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((day) => {
                    const futureStreak = streak + day;
                    const futureBonus = Math.min(futureStreak * 2, 20);
                    const futureReward = basePoints + futureBonus;
                    const isTomorrow = day === 1;

                    return (
                      <div
                        key={day}
                        className={`text-center p-2 rounded-lg ${
                          isTomorrow
                            ? "bg-yellow-100 border-2 border-yellow-400"
                            : "bg-gray-100"
                        }`}
                      >
                        <div className="text-xs text-gray-500">
                          {isTomorrow
                            ? isGerman
                              ? "Morgen"
                              : "Tomorrow"
                            : `+${day}`}
                        </div>
                        <div className="text-sm font-semibold">{futureReward}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Countdown or Claim Button */}
              {canClaim() ? (
                <Button
                  onClick={handleClaim}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white text-lg py-6"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      {isGerman ? "Wird abgeholt..." : "Claiming..."}
                    </>
                  ) : (
                    <>
                      <Gift className="h-5 w-5 mr-2" />
                      {isGerman ? "Belohnung abholen" : "Claim Reward"}
                    </>
                  )}
                </Button>
              ) : (
                <div className="text-center">
                  <div className="bg-gray-100 rounded-lg p-4 mb-3">
                    <p className="text-sm text-gray-500 mb-2">
                      {isGerman ? "Nächste Belohnung verfügbar in" : "Next reward available in"}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-700">
                      <Clock className="h-5 w-5" />
                      <span>
                        {String(countdown.hours).padStart(2, "0")}:
                        {String(countdown.minutes).padStart(2, "0")}:
                        {String(countdown.seconds).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    {isGerman
                      ? "Komme morgen zurück für mehr Punkte!"
                      : "Come back tomorrow for more points!"}
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Success State */
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {isGerman ? "Glückwunsch!" : "Congratulations!"}
              </h3>
              <p className="text-gray-600 mb-4">
                {isGerman
                  ? `Du hast ${claimData?.pointsAwarded || nextReward} Punkte erhalten!`
                  : `You received ${claimData?.pointsAwarded || nextReward} points!`}
              </p>
              <div className="bg-yellow-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center gap-2 text-yellow-700">
                  <Star className="h-5 w-5" />
                  <span className="font-semibold">
                    {isGerman ? "Neue Streak" : "New streak"}: {claimData?.streak || streak + 1}{" "}
                    {isGerman ? "Tage" : "days"}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                {isGerman
                  ? `Gesamtpunkte: ${claimData?.totalPoints || program?.points + nextReward}`
                  : `Total points: ${claimData?.totalPoints || program?.points + nextReward}`}
              </p>
              <Button onClick={handleClose} className="bg-[#C6080A] hover:bg-[#a50709]">
                {isGerman ? "Super!" : "Awesome!"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
