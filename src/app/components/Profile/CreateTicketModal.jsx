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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Package,
  CreditCard,
  Truck,
  RotateCcw,
  Wallet,
  User,
  Wrench,
  HelpCircle,
  AlertTriangle,
  Upload,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

export default function CreateTicketModal({
  isOpen,
  onClose,
  onSuccess,
  auth,
  countryCode,
}) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    priority: "medium",
    description: "",
    order: "",
    product: "",
  });
  const [attachments, setAttachments] = useState([]);
  const [errors, setErrors] = useState({});

  const isGerman = countryCode === "DE";
  const serverUri = process.env.NEXT_PUBLIC_SERVER_URI;

  const categories = [
    { value: "order", label: isGerman ? "Bestellung" : "Order", icon: Package },
    { value: "product", label: isGerman ? "Produkt" : "Product", icon: Package },
    { value: "payment", label: isGerman ? "Zahlung" : "Payment", icon: CreditCard },
    { value: "shipping", label: isGerman ? "Versand" : "Shipping", icon: Truck },
    { value: "return", label: isGerman ? "Rückgabe" : "Return", icon: RotateCcw },
    { value: "refund", label: isGerman ? "Rückerstattung" : "Refund", icon: Wallet },
    { value: "account", label: isGerman ? "Konto" : "Account", icon: User },
    { value: "technical", label: isGerman ? "Technisch" : "Technical", icon: Wrench },
    { value: "other", label: isGerman ? "Sonstiges" : "Other", icon: HelpCircle },
  ];

  const priorities = [
    { value: "low", label: isGerman ? "Niedrig" : "Low" },
    { value: "medium", label: isGerman ? "Mittel" : "Medium" },
    { value: "high", label: isGerman ? "Hoch" : "High" },
    { value: "urgent", label: isGerman ? "Dringend" : "Urgent", icon: AlertTriangle },
  ];

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.category) {
      newErrors.category = isGerman
        ? "Bitte wählen Sie eine Kategorie"
        : "Please select a category";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.subject.trim()) {
      newErrors.subject = isGerman
        ? "Betreff ist erforderlich"
        : "Subject is required";
    } else if (formData.subject.length < 5) {
      newErrors.subject = isGerman
        ? "Betreff muss mindestens 5 Zeichen haben"
        : "Subject must be at least 5 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = isGerman
        ? "Beschreibung ist erforderlich"
        : "Description is required";
    } else if (formData.description.length < 20) {
      newErrors.description = isGerman
        ? "Beschreibung muss mindestens 20 Zeichen haben"
        : "Description must be at least 20 characters";
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

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"];

    const validFiles = files.filter((file) => {
      if (file.size > maxSize) {
        toast.error(`${file.name} ${isGerman ? "ist zu groß" : "is too large"} (max 5MB)`);
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} ${isGerman ? "Dateityp nicht erlaubt" : "file type not allowed"}`);
        return false;
      }
      return true;
    });

    if (attachments.length + validFiles.length > 5) {
      toast.error(isGerman ? "Maximal 5 Anhänge erlaubt" : "Maximum 5 attachments allowed");
      return;
    }

    setAttachments([...attachments, ...validFiles]);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Upload attachments first if any
      let uploadedAttachments = [];
      if (attachments.length > 0) {
        const formDataUpload = new FormData();
        attachments.forEach((file) => {
          formDataUpload.append("files", file);
        });

        try {
          const uploadRes = await axios.post(
            `${serverUri}/api/v1/upload/multiple`,
            formDataUpload,
            {
              headers: {
                Authorization: `Bearer ${auth.token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
          if (uploadRes.data.success) {
            uploadedAttachments = uploadRes.data.files.map((file, index) => ({
              name: attachments[index].name,
              url: file.url,
              type: attachments[index].type.startsWith("image/") ? "image" : "document",
              size: attachments[index].size,
            }));
          }
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          toast.warning(
            isGerman
              ? "Anhänge konnten nicht hochgeladen werden, Ticket wird ohne Anhänge erstellt"
              : "Attachments could not be uploaded, creating ticket without attachments"
          );
        }
      }

      const { data } = await axios.post(
        `${serverUri}/api/v1/support/tickets`,
        {
          subject: formData.subject,
          category: formData.category,
          priority: formData.priority,
          description: formData.description,
          ...(formData.order && { order: formData.order }),
          ...(formData.product && { product: formData.product }),
          ...(uploadedAttachments.length > 0 && { attachments: uploadedAttachments }),
        },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );

      if (data.success) {
        toast.success(
          isGerman
            ? `Ticket #${data.ticket.ticketNumber} erfolgreich erstellt`
            : `Ticket #${data.ticket.ticketNumber} created successfully`
        );
        onSuccess();
        resetForm();
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error(
        error.response?.data?.message ||
          (isGerman ? "Fehler beim Erstellen des Tickets" : "Failed to create ticket")
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      subject: "",
      category: "",
      priority: "medium",
      description: "",
      order: "",
      product: "",
    });
    setAttachments([]);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isGerman ? "Neues Support-Ticket" : "New Support Ticket"}
          </DialogTitle>
          <DialogDescription>
            {step === 1 &&
              (isGerman
                ? "Wählen Sie eine Kategorie für Ihr Anliegen"
                : "Select a category for your issue")}
            {step === 2 &&
              (isGerman
                ? "Beschreiben Sie Ihr Problem im Detail"
                : "Describe your issue in detail")}
            {step === 3 &&
              (isGerman
                ? "Überprüfen Sie Ihre Angaben"
                : "Review your information")}
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

        {/* Step 1: Category Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.value}
                    onClick={() => {
                      setFormData({ ...formData, category: cat.value });
                      setErrors({});
                    }}
                    className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                      formData.category === cat.value
                        ? "border-[#C6080A] bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Icon
                      className={`h-6 w-6 ${
                        formData.category === cat.value
                          ? "text-[#C6080A]"
                          : "text-gray-500"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        formData.category === cat.value
                          ? "text-[#C6080A]"
                          : "text-gray-700"
                      }`}
                    >
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.category && (
              <p className="text-sm text-red-500 text-center">{errors.category}</p>
            )}

            <div className="space-y-2 pt-4">
              <Label>{isGerman ? "Priorität" : "Priority"}</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      <span className="flex items-center gap-2">
                        {p.icon && <p.icon className="h-4 w-4" />}
                        {p.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">
                {isGerman ? "Betreff" : "Subject"} *
              </Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                placeholder={
                  isGerman
                    ? "Kurze Zusammenfassung Ihres Problems"
                    : "Brief summary of your issue"
                }
                className={errors.subject ? "border-red-500" : ""}
              />
              {errors.subject && (
                <p className="text-sm text-red-500">{errors.subject}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                {isGerman ? "Beschreibung" : "Description"} *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder={
                  isGerman
                    ? "Beschreiben Sie Ihr Problem im Detail..."
                    : "Describe your issue in detail..."
                }
                rows={5}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
              <p className="text-xs text-gray-500">
                {formData.description.length}/2000{" "}
                {isGerman ? "Zeichen" : "characters"}
              </p>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label>{isGerman ? "Anhänge (optional)" : "Attachments (optional)"}</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center gap-2 cursor-pointer"
                >
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {isGerman
                      ? "Klicken Sie zum Hochladen oder ziehen Sie Dateien hierher"
                      : "Click to upload or drag files here"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {isGerman
                      ? "Max. 5 Dateien, je max. 5MB (Bilder, PDF)"
                      : "Max 5 files, 5MB each (Images, PDF)"}
                  </span>
                </label>
              </div>

              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                      <span className="truncate max-w-[150px]">{file.name}</span>
                      <button
                        onClick={() => removeAttachment(index)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-700 text-sm">
                {isGerman
                  ? "Je detaillierter Ihre Beschreibung, desto schneller können wir Ihnen helfen."
                  : "The more detailed your description, the faster we can help you."}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {isGerman ? "Kategorie" : "Category"}
                </span>
                <span className="font-medium capitalize">
                  {categories.find((c) => c.value === formData.category)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {isGerman ? "Priorität" : "Priority"}
                </span>
                <span className="font-medium capitalize">
                  {formData.priority}
                </span>
              </div>
              <div className="border-t pt-2">
                <span className="text-gray-600">
                  {isGerman ? "Betreff" : "Subject"}
                </span>
                <p className="font-medium mt-1">{formData.subject}</p>
              </div>
              <div className="border-t pt-2">
                <span className="text-gray-600">
                  {isGerman ? "Beschreibung" : "Description"}
                </span>
                <p className="text-sm mt-1 text-gray-700 line-clamp-4">
                  {formData.description}
                </p>
              </div>
              {attachments.length > 0 && (
                <div className="border-t pt-2">
                  <span className="text-gray-600">
                    {isGerman ? "Anhänge" : "Attachments"}
                  </span>
                  <p className="text-sm mt-1">{attachments.length} file(s)</p>
                </div>
              )}
            </div>

            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertDescription className="text-yellow-700 text-sm">
                {isGerman
                  ? "Nach dem Erstellen erhalten Sie eine Ticket-Nummer. Unser Support-Team wird sich so schnell wie möglich bei Ihnen melden."
                  : "After creation, you will receive a ticket number. Our support team will get back to you as soon as possible."}
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
                  {isGerman ? "Wird erstellt..." : "Creating..."}
                </>
              ) : isGerman ? (
                "Ticket erstellen"
              ) : (
                "Create Ticket"
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
