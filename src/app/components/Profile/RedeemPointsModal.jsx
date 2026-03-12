"use client";

import React, { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Ticket,
  Percent,
  Euro,
  ArrowRight,
  CheckCircle,
  Copy,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function RedeemPointsModal({
  isOpen,
  onClose,
  onSuccess,
  program,
  auth,
  countryCode,
}) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [discountType, setDiscountType] = useState("percentage");
  const [points, setPoints] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [redemptionResult, setRedemptionResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState({});

  const isGerman = countryCode === "DE";
  const serverUri = process.env.NEXT_PUBLIC_SERVER_URI;
  const availablePoints = program?.points || 0;

  // Conversion rate: 100 points = €1 or 10% discount
  const MIN_POINTS = 100;
  const POINTS_TO_EURO_RATE = 100; // 100 points = €1
  const POINTS_TO_PERCENT_RATE = 50; // 50 points = 1%

  const validateStep1 = () => {
    const newErrors = {};
    const pointsNum = parseInt(points);

    if (!points || isNaN(pointsNum) || pointsNum <= 0) {
      newErrors.points = isGerman ? "Bitte geben Sie Punkte ein" : "Please enter points";
    } else if (pointsNum < MIN_POINTS) {
      newErrors.points = isGerman
        ? `Mindestens ${MIN_POINTS} Punkte erforderlich`
        : `Minimum ${MIN_POINTS} points required`;
    } else if (pointsNum > availablePoints) {
      newErrors.points = isGerman
        ? "Nicht genügend Punkte"
        : "Not enough points";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateDiscount = () => {
    const pointsNum = parseInt(points) || 0;
    if (discountType === "percentage") {
      return Math.floor(pointsNum / POINTS_TO_PERCENT_RATE);
    } else {
      return (pointsNum / POINTS_TO_EURO_RATE).toFixed(2);
    }
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2) {
      handleRedeem();
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleRedeem = async () => {
    try {
      setLoading(true);
      const pointsNum = parseInt(points);
      const discountVal = parseFloat(discountValue) || calculateDiscount();

      const { data } = await axios.post(
        `${serverUri}/api/v1/rewards/redeem`,
        {
          points: pointsNum,
          discountType,
          discountValue: discountVal,
        },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );

      if (data.success) {
        setRedemptionResult(data.redemption);
        setStep(3);
        onSuccess();
        toast.success(
          isGerman
            ? "Gutschein erfolgreich erstellt!"
            : "Coupon created successfully!"
        );
      }
    } catch (error) {
      console.error("Error redeeming points:", error);
      toast.error(
        error.response?.data?.message ||
          (isGerman ? "Fehler beim Einlösen" : "Failed to redeem points")
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success(isGerman ? "Code kopiert!" : "Code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setStep(1);
    setPoints("");
    setDiscountValue("");
    setDiscountType("percentage");
    setRedemptionResult(null);
    setErrors({});
    onClose();
  };

  const presetOptions = [
    { points: 100, label: "100 pts", discount: "2% / €1" },
    { points: 250, label: "250 pts", discount: "5% / €2.50" },
    { points: 500, label: "500 pts", discount: "10% / €5" },
    { points: 1000, label: "1000 pts", discount: "20% / €10" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-[#C6080A]" />
            {isGerman ? "Punkte einlösen" : "Redeem Points"}
          </DialogTitle>
          <DialogDescription>
            {step === 1 &&
              (isGerman
                ? "Wählen Sie, wie viele Punkte Sie einlösen möchten"
                : "Choose how many points to redeem")}
            {step === 2 &&
              (isGerman
                ? "Überprüfen Sie Ihre Auswahl"
                : "Review your selection")}
            {step === 3 &&
              (isGerman
                ? "Ihr Gutschein wurde erstellt!"
                : "Your coupon has been created!")}
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step
                  ? "w-8 bg-[#C6080A]"
                  : s < step
                  ? "w-2 bg-green-500"
                  : "w-2 bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Select Points */}
        {step === 1 && (
          <div className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-700">
                {isGerman
                  ? `Verfügbare Punkte: ${availablePoints.toLocaleString()}`
                  : `Available points: ${availablePoints.toLocaleString()}`}
              </AlertDescription>
            </Alert>

            {/* Preset Options */}
            <div className="grid grid-cols-2 gap-3">
              {presetOptions.map((option) => (
                <button
                  key={option.points}
                  onClick={() => {
                    setPoints(option.points.toString());
                    setErrors({});
                  }}
                  disabled={availablePoints < option.points}
                  className={`p-3 border-2 rounded-lg text-left transition-all ${
                    points === option.points.toString()
                      ? "border-[#C6080A] bg-red-50"
                      : availablePoints < option.points
                      ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="font-semibold">{option.label}</p>
                  <p className="text-xs text-gray-500">{option.discount}</p>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="points">
                {isGerman ? "Oder geben Sie einen Betrag ein" : "Or enter custom amount"}
              </Label>
              <Input
                id="points"
                type="number"
                min={MIN_POINTS}
                max={availablePoints}
                step={50}
                placeholder={isGerman ? "Punkte eingeben" : "Enter points"}
                value={points}
                onChange={(e) => {
                  setPoints(e.target.value);
                  setErrors({});
                }}
                className={errors.points ? "border-red-500" : ""}
              />
              {errors.points && (
                <p className="text-sm text-red-500">{errors.points}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{isGerman ? "Gutschein-Typ" : "Coupon Type"}</Label>
              <div className="flex gap-3">
                <button
                  onClick={() => setDiscountType("percentage")}
                  className={`flex-1 p-3 border-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                    discountType === "percentage"
                      ? "border-[#C6080A] bg-red-50"
                      : "border-gray-200"
                  }`}
                >
                  <Percent className="h-4 w-4" />
                  {isGerman ? "Prozent" : "Percentage"}
                </button>
                <button
                  onClick={() => setDiscountType("fixed")}
                  className={`flex-1 p-3 border-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                    discountType === "fixed"
                      ? "border-[#C6080A] bg-red-50"
                      : "border-gray-200"
                  }`}
                >
                  <Euro className="h-4 w-4" />
                  {isGerman ? "Festbetrag" : "Fixed Amount"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Review */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {isGerman ? "Einzulösende Punkte" : "Points to redeem"}
                </span>
                <span className="font-semibold">{parseInt(points).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {isGerman ? "Gutschein-Typ" : "Coupon type"}
                </span>
                <span className="font-medium capitalize">
                  {discountType === "percentage"
                    ? isGerman
                      ? "Prozent"
                      : "Percentage"
                    : isGerman
                    ? "Festbetrag"
                    : "Fixed"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {isGerman ? "Rabatt" : "Discount"}
                </span>
                <span className="font-bold text-[#C6080A]">
                  {discountType === "percentage"
                    ? `${calculateDiscount()}%`
                    : `€${calculateDiscount()}`}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="text-gray-600">
                  {isGerman ? "Verbleibende Punkte" : "Remaining points"}
                </span>
                <span className="font-semibold">
                  {(availablePoints - parseInt(points)).toLocaleString()}
                </span>
              </div>
            </div>

            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertDescription className="text-yellow-700 text-sm">
                {isGerman
                  ? "Gutscheine sind 30 Tage gültig und können nur einmal verwendet werden."
                  : "Coupons are valid for 30 days and can only be used once."}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && redemptionResult && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {isGerman ? "Gutschein erstellt!" : "Coupon Created!"}
              </h3>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
              <p className="text-sm text-gray-600 mb-2">
                {isGerman ? "Ihr Gutschein-Code" : "Your coupon code"}
              </p>
              <div className="flex items-center gap-3">
                <code className="flex-1 bg-white px-4 py-3 rounded-lg font-mono text-lg font-bold text-[#C6080A] border-2 border-dashed border-[#C6080A]">
                  {redemptionResult.coupon?.code}
                </code>
                <Button
                  onClick={() => copyToClipboard(redemptionResult.coupon?.code)}
                  variant="outline"
                  className="border-[#C6080A] text-[#C6080A] hover:bg-[#C6080A] hover:text-white"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{isGerman ? "Rabatt" : "Discount"}</span>
                <span className="font-medium">
                  {redemptionResult.discountType === "percentage"
                    ? `${redemptionResult.discountValue}%`
                    : `€${redemptionResult.discountAmount}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{isGerman ? "Gültig bis" : "Valid until"}</span>
                <span className="font-medium">
                  {format(new Date(redemptionResult.coupon?.expiryDate), "MMM d, yyyy")}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-500 text-center">
              {isGerman
                ? "Der Code wurde auch an Ihre E-Mail gesendet."
                : "The code has also been sent to your email."}
            </p>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex justify-between mt-6">
          {step > 1 && step < 3 ? (
            <Button variant="outline" onClick={handleBack} disabled={loading}>
              {isGerman ? "Zurück" : "Back"}
            </Button>
          ) : (
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              {step === 3 ? (isGerman ? "Schließen" : "Close") : isGerman ? "Abbrechen" : "Cancel"}
            </Button>
          )}

          {step < 3 && (
            <Button
              onClick={handleNext}
              className="bg-[#C6080A] hover:bg-[#a50709]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isGerman ? "Wird verarbeitet..." : "Processing..."}
                </>
              ) : step === 1 ? (
                <>
                  {isGerman ? "Weiter" : "Next"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  <Ticket className="h-4 w-4 mr-2" />
                  {isGerman ? "Gutschein erstellen" : "Create Coupon"}
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
