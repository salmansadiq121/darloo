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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Landmark, CreditCard, AlertCircle, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function WalletWithdrawalModal({
  isOpen,
  onClose,
  onSuccess,
  wallet,
  auth,
  countryCode,
}) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [amount, setAmount] = useState("");
  const [formData, setFormData] = useState({
    accountHolderName: "",
    accountNumber: "",
    bankName: "",
    ifscCode: "",
    paypalEmail: "",
  });
  const [errors, setErrors] = useState({});

  const isGerman = countryCode === "DE";
  const serverUri = process.env.NEXT_PUBLIC_SERVER_URI;
  const MIN_WITHDRAWAL = 10;
  const availableBalance = wallet?.balance || 0;

  const validateStep1 = () => {
    const newErrors = {};
    const parsedAmount = parseFloat(amount);

    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = isGerman
        ? "Bitte geben Sie einen gültigen Betrag ein"
        : "Please enter a valid amount";
    } else if (parsedAmount < MIN_WITHDRAWAL) {
      newErrors.amount = isGerman
        ? `Mindestauszahlung beträgt €${MIN_WITHDRAWAL}`
        : `Minimum withdrawal is €${MIN_WITHDRAWAL}`;
    } else if (parsedAmount > availableBalance) {
      newErrors.amount = isGerman
        ? "Betrag übersteigt verfügbares Guthaben"
        : "Amount exceeds available balance";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (paymentMethod === "bank_transfer") {
      if (!formData.accountHolderName.trim()) {
        newErrors.accountHolderName = isGerman
          ? "Kontoinhaber erforderlich"
          : "Account holder name required";
      }
      if (!formData.accountNumber.trim()) {
        newErrors.accountNumber = isGerman
          ? "Kontonummer erforderlich"
          : "Account number required";
      }
      if (!formData.bankName.trim()) {
        newErrors.bankName = isGerman
          ? "Bankname erforderlich"
          : "Bank name required";
      }
    } else if (paymentMethod === "paypal") {
      if (!formData.paypalEmail.trim()) {
        newErrors.paypalEmail = isGerman
          ? "PayPal E-Mail erforderlich"
          : "PayPal email required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.paypalEmail)) {
        newErrors.paypalEmail = isGerman
          ? "Ungültige E-Mail-Adresse"
          : "Invalid email address";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const paymentMethodData = {
        type: paymentMethod,
        details:
          paymentMethod === "bank_transfer"
            ? {
                accountHolderName: formData.accountHolderName,
                accountNumber: formData.accountNumber,
                bankName: formData.bankName,
                ifscCode: formData.ifscCode,
              }
            : {
                paypalEmail: formData.paypalEmail,
              },
      };

      const { data } = await axios.post(
        `${serverUri}/api/v1/wallet/withdrawals`,
        {
          amount: parseFloat(amount),
          paymentMethod: paymentMethodData,
        },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );

      if (data.success) {
        toast.success(
          isGerman
            ? "Auszahlungsantrag erfolgreich erstellt"
            : "Withdrawal request created successfully"
        );
        onSuccess();
        resetForm();
      }
    } catch (error) {
      console.error("Error creating withdrawal:", error);
      toast.error(
        error.response?.data?.message ||
          (isGerman
            ? "Fehler beim Erstellen der Auszahlung"
            : "Failed to create withdrawal")
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setAmount("");
    setPaymentMethod("bank_transfer");
    setFormData({
      accountHolderName: "",
      accountNumber: "",
      bankName: "",
      ifscCode: "",
      paypalEmail: "",
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === 3 ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <>
                {paymentMethod === "bank_transfer" ? (
                  <Landmark className="h-5 w-5 text-[#C6080A]" />
                ) : (
                  <CreditCard className="h-5 w-5 text-[#C6080A]" />
                )}
              </>
            )}
            {isGerman ? "Auszahlung beantragen" : "Request Withdrawal"}
          </DialogTitle>
          <DialogDescription>
            {step === 1 &&
              (isGerman
                ? "Geben Sie den Betrag ein, den Sie auszahlen möchten"
                : "Enter the amount you want to withdraw")}
            {step === 2 &&
              (isGerman
                ? "Wählen Sie Ihre bevorzugte Auszahlungsmethode"
                : "Select your preferred withdrawal method")}
            {step === 3 &&
              (isGerman
                ? "Überprüfen Sie Ihre Auszahlungsdetails"
                : "Review your withdrawal details")}
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

        {/* Step 1: Amount */}
        {step === 1 && (
          <div className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-700">
                {isGerman
                  ? `Verfügbares Guthaben: €${availableBalance.toFixed(2)}`
                  : `Available Balance: €${availableBalance.toFixed(2)}`}
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="amount">
                {isGerman ? "Betrag (€)" : "Amount (€)"}
              </Label>
              <Input
                id="amount"
                type="number"
                min={MIN_WITHDRAWAL}
                max={availableBalance}
                step="0.01"
                placeholder={isGerman ? "Betrag eingeben" : "Enter amount"}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={errors.amount ? "border-red-500" : ""}
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount}</p>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setAmount(Math.floor(availableBalance / 4).toString())}
                className="flex-1"
              >
                25%
              </Button>
              <Button
                variant="outline"
                onClick={() => setAmount(Math.floor(availableBalance / 2).toString())}
                className="flex-1"
              >
                50%
              </Button>
              <Button
                variant="outline"
                onClick={() => setAmount(Math.floor(availableBalance).toString())}
                className="flex-1"
              >
                {isGerman ? "Max" : "Max"}
              </Button>
            </div>

            <p className="text-sm text-gray-500">
              {isGerman
                ? `Mindestauszahlung: €${MIN_WITHDRAWAL}`
                : `Minimum withdrawal: €${MIN_WITHDRAWAL}`}
            </p>
          </div>
        )}

        {/* Step 2: Payment Method */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{isGerman ? "Zahlungsmethode" : "Payment Method"}</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">
                    <span className="flex items-center gap-2">
                      <Landmark className="h-4 w-4" />
                      {isGerman ? "Banküberweisung" : "Bank Transfer"}
                    </span>
                  </SelectItem>
                  <SelectItem value="paypal">
                    <span className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      PayPal
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {paymentMethod === "bank_transfer" ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accountHolderName">
                    {isGerman ? "Kontoinhaber" : "Account Holder Name"}
                  </Label>
                  <Input
                    id="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={(e) =>
                      setFormData({ ...formData, accountHolderName: e.target.value })
                    }
                    placeholder={isGerman ? "Vollständiger Name" : "Full Name"}
                    className={errors.accountHolderName ? "border-red-500" : ""}
                  />
                  {errors.accountHolderName && (
                    <p className="text-sm text-red-500">{errors.accountHolderName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber">
                    {isGerman ? "IBAN / Kontonummer" : "IBAN / Account Number"}
                  </Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, accountNumber: e.target.value })
                    }
                    placeholder={isGerman ? "Kontonummer eingeben" : "Enter account number"}
                    className={errors.accountNumber ? "border-red-500" : ""}
                  />
                  {errors.accountNumber && (
                    <p className="text-sm text-red-500">{errors.accountNumber}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bankName">
                    {isGerman ? "Bankname" : "Bank Name"}
                  </Label>
                  <Input
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) =>
                      setFormData({ ...formData, bankName: e.target.value })
                    }
                    placeholder={isGerman ? "Bankname eingeben" : "Enter bank name"}
                    className={errors.bankName ? "border-red-500" : ""}
                  />
                  {errors.bankName && (
                    <p className="text-sm text-red-500">{errors.bankName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ifscCode">
                    {isGerman ? "BIC/SWIFT (optional)" : "BIC/SWIFT (optional)"}
                  </Label>
                  <Input
                    id="ifscCode"
                    value={formData.ifscCode}
                    onChange={(e) =>
                      setFormData({ ...formData, ifscCode: e.target.value })
                    }
                    placeholder={isGerman ? "BIC/SWIFT-Code" : "BIC/SWIFT Code"}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paypalEmail">PayPal Email</Label>
                  <Input
                    id="paypalEmail"
                    type="email"
                    value={formData.paypalEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, paypalEmail: e.target.value })
                    }
                    placeholder="email@example.com"
                    className={errors.paypalEmail ? "border-red-500" : ""}
                  />
                  {errors.paypalEmail && (
                    <p className="text-sm text-red-500">{errors.paypalEmail}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {isGerman ? "Auszahlungsbetrag" : "Withdrawal Amount"}
                </span>
                <span className="font-semibold">€{parseFloat(amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {isGerman ? "Gebühren" : "Fees"}
                </span>
                <span className="font-semibold text-green-600">€0.00</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-medium">
                  {isGerman ? "Nettobetrag" : "Net Amount"}
                </span>
                <span className="font-bold text-lg">€{parseFloat(amount).toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">
                {isGerman ? "Zahlungsmethode" : "Payment Method"}
              </p>
              <p className="text-sm text-gray-600 capitalize">
                {paymentMethod === "bank_transfer"
                  ? isGerman
                    ? "Banküberweisung"
                    : "Bank Transfer"
                  : "PayPal"}
              </p>
              {paymentMethod === "bank_transfer" ? (
                <div className="mt-2 text-sm text-gray-600">
                  <p>{formData.accountHolderName}</p>
                  <p>{formData.bankName}</p>
                  <p className="font-mono">{formData.accountNumber}</p>
                </div>
              ) : (
                <p className="mt-2 text-sm text-gray-600">{formData.paypalEmail}</p>
              )}
            </div>

            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-700 text-sm">
                {isGerman
                  ? "Auszahlungen werden innerhalb von 1-3 Werktagen bearbeitet."
                  : "Withdrawals are processed within 1-3 business days."}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex justify-between mt-6">
          {step > 1 ? (
            <Button variant="outline" onClick={handleBack} disabled={loading}>
              {isGerman ? "Zurück" : "Back"}
            </Button>
          ) : (
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              {isGerman ? "Abbrechen" : "Cancel"}
            </Button>
          )}

          {step < 3 ? (
            <Button
              onClick={handleNext}
              className="bg-[#C6080A] hover:bg-[#a50709]"
              disabled={loading}
            >
              {isGerman ? "Weiter" : "Next"}
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-[#C6080A] hover:bg-[#a50709]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isGerman ? "Wird verarbeitet..." : "Processing..."}
                </>
              ) : isGerman ? (
                "Auszahlung beantragen"
              ) : (
                "Request Withdrawal"
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
