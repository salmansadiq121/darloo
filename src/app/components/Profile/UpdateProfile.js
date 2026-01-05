"use client";
import React, { useEffect, useState } from "react";
import { Camera, Upload, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ImSpinner2 } from "react-icons/im";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import axios from "axios";
import { authUri } from "@/app/utils/ServerURI";
import { uploadImage } from "@/app/utils/Upload";
import countries from "world-countries";
import ReactCountryFlag from "react-country-flag";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import PhoneNumberInput from "@/app/utils/PhoneInput";

export default function UpdateProfileModal({
  isOpen,
  onClose,
  user,
  getUserDetails,
  countryCode,
}) {
  const [activeTab, setActiveTab] = useState("personal");
  const [avatar, setAvatar] = useState("");
  const [formData, setFormData] = useState({
    name: user?.name,
    lastName: user?.lastName,
    email: user?.email,
    address: user?.addressDetails?.address,
    city: user?.addressDetails?.city,
    state: user?.addressDetails?.state,
    country: user?.addressDetails?.country,
    pincode: user?.addressDetails?.pincode,
    accountHolder: user?.bankDetails?.accountHolder,
    accountNumber: user?.bankDetails?.accountNumber,
    ifscCode: user?.bankDetails?.ifscCode,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneCode, setPhoneCode] = useState("+1");
  const [number, setNumber] = useState(user?.number);
  const [addressQuery, setAddressQuery] = useState(
    user?.addressDetails?.address || ""
  );
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const isGerman = countryCode === "DE";

  useEffect(() => {
    setAvatar(user?.avatar);
    setFormData({
      name: user?.name,
      lastName: user?.lastName,
      email: user?.email,
      number: user?.number,
      phoneCode: user?.phoneCode,
      address: user?.addressDetails?.address,
      city: user?.addressDetails?.city,
      state: user?.addressDetails?.state,
      country: user?.addressDetails?.country,
      pincode: user?.addressDetails?.pincode,
      accountHolder: user?.bankDetails?.accountHolder,
      accountNumber: user?.bankDetails?.accountNumber,
      ifscCode: user?.bankDetails?.ifscCode,
      cvv: user?.bankDetails?.cvv,
      expiryDate: user?.bankDetails?.expiryDate,
    });
    setAddressQuery(user?.addressDetails?.address || "");
  }, [user]);

  // Google Places Autocomplete for address (via Next.js API proxy)
  useEffect(() => {
    if (!addressQuery || addressQuery.length < 3) {
      setAddressSuggestions([]);
      return;
    }

    let isCancelled = false;
    const controller = new AbortController();

    const fetchSuggestions = async () => {
      try {
        setIsAddressLoading(true);
        const res = await fetch(
          `/api/google-places?input=${encodeURIComponent(addressQuery)}`,
          { signal: controller.signal }
        );

        // Parse JSON response even if not ok to check for error details
        const data = await res.json();

        if (!isCancelled) {
          // If we have predictions, use them; otherwise set empty array
          setAddressSuggestions(data?.predictions || []);
        }
      } catch (err) {
        // Only log errors that aren't abort errors (user typing causes aborts)
        if (!isCancelled && err.name !== "AbortError") {
          // Silently fail - address suggestions are a nice-to-have feature
          setAddressSuggestions([]);
        }
      } finally {
        if (!isCancelled) {
          setIsAddressLoading(false);
        }
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 400);

    return () => {
      isCancelled = true;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [addressQuery]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Upload Image
  const handleUploadImage = async (image) => {
    await uploadImage(image, setAvatar, setLoading);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (activeTab === "personal") {
        const userData = new FormData();
        userData.append("name", formData.name);
        userData.append("lastName", formData.lastName || "");
        userData.append("email", formData.email);
        userData.append("number", number);
        userData.append("phoneCode", phoneCode);
        userData.append("image", avatar);

        const { data } = await axios.put(
          `${authUri}/update/profile/${user?._id}`,
          userData
        );
        if (data) {
          localStorage.setItem("@darloo", JSON.stringify({ user: data.user }));
          getUserDetails();
          toast.success("Profile updated successfully");
        }
      } else {
        const { data } = await axios.put(
          `${authUri}/update/checkout/${user?._id}`,
          {
            addressDetails: {
              pincode: formData.pincode,
              address: formData.address,
              city: formData.city,
              state: formData.state,
              country: formData.country,
            },
            bankDetails: {
              accountNumber: formData.accountNumber,
              accountHolder: formData.accountHolder,
              ifscCode: formData.ifscCode,
              expiryDate: formData.expiryDate,
              cvv: formData.cvv,
            },
          }
        );
        if (data) {
          getUserDetails();
          toast.success("Profile updated successfully");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  // Sort countries alphabetically - memoized for performance
  const sortedCountries = React.useMemo(
    () =>
      [...countries].sort((a, b) => a.name.common.localeCompare(b.name.common)),
    []
  );

  const selectedCountry = React.useMemo(
    () =>
      sortedCountries.find(
        (country) => country.name.common === formData.country
      ),
    [sortedCountries, formData.country]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl sm:min-w-[45rem] max-h-[95vh] overflow-y-auto shidden border border-red-100 bg-gradient-to-b from-white/95 via-white/95 to-red-50/60 shadow-2xl backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl font-semibold tracking-tight flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-700 text-sm font-medium shadow-sm">
                ✨
              </span>
              {isGerman ? "Profil aktualisieren" : "Update Profile"}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              {isGerman
                ? "Ändern Sie hier Ihre Profilinformationen. Ihre Änderungen werden sofort angewendet."
                : "Fine-tune your personal details, contact information and address. Changes apply instantly after saving."}
            </DialogDescription>
          </DialogHeader>

          <Tabs
            defaultValue="personal"
            className="mt-6"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-2 mb-6 gap-2 bg-red-50/80 overflow-x-auto shidden rounded-full p-1">
              <TabsTrigger
                value="personal"
                className="px-4 py-2 min-w-fit mr-2 sm:mr-0 rounded-full text-xs sm:text-sm font-medium data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-800 data-[state=inactive]:hover:bg-red-100 transition-colors"
                onClick={() => setActiveTab("personal")}
              >
                {isGerman ? "Persönliche Info" : "Personal Info"}
              </TabsTrigger>
              <TabsTrigger
                value="address"
                className="px-4 py-2 min-w-fit ml-2 sm:ml-0 rounded-full text-xs sm:text-sm font-medium data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-800 data-[state=inactive]:hover:bg-red-100 transition-colors"
                onClick={() => setActiveTab("address")}
              >
                {isGerman ? "Adresse & Standort" : "Address & Location"}
              </TabsTrigger>
              {/* <TabsTrigger
                value="bank"
                className="px-4 min-w-fit ml-5 sm:ml-0  rounded-md data-[state=active]:bg-red-700 data-[state=active]:text-white text-black"
                onClick={() => setActiveTab("bank")}
              >
                Bank Details
              </TabsTrigger> */}
            </TabsList>

            <form
              onSubmit={handleSubmit}
              onKeyDown={(e) => {
                // Prevent Enter from auto-submitting the form
                if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
                  e.preventDefault();
                }
              }}
              className="space-y-6"
            >
              <TabsContent value="personal" className="space-y-6">
                <motion.div
                  className="flex flex-col items-center justify-center mb-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <motion.div
                      className="absolute -inset-[2px] rounded-full bg-gradient-to-tr from-red-500/70 via-amber-400/70 to-red-600/70 opacity-70 blur-sm"
                      animate={{
                        opacity: [0.4, 0.8, 0.4],
                        scale: [0.98, 1.03, 0.98],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <Avatar className="relative h-24 w-24 mb-4 border-4 border-white shadow-xl bg-gradient-to-br from-red-500 via-rose-500 to-amber-400">
                      <AvatarImage
                        src={avatar || "/placeholder.svg?height=96&width=96"}
                        alt={user?.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-2xl bg-transparent text-white font-semibold tracking-wide">
                        {user?.name
                          ?.split(" ")
                          ?.map((n) => n[0])
                          ?.join("")}
                      </AvatarFallback>
                      <label
                        htmlFor="file"
                        className={`absolute bottom-1.5 right-1.5 inline-flex items-center justify-center rounded-full bg-red-600 text-white p-1.5 shadow-md hover:bg-red-700 transition-colors ${
                          loading
                            ? "cursor-not-allowed opacity-80"
                            : "cursor-pointer"
                        }`}
                      >
                        <Camera className="h-4 w-4" />
                      </label>
                    </Avatar>
                  </div>
                  <input
                    type="file"
                    onChange={(e) => handleUploadImage(e.target.files[0])}
                    className="hidden"
                    id="file"
                  />
                  <button
                    type="button"
                    disabled={loading}
                    className={`inline-flex items-center gap-2 rounded-full border border-red-200 bg-white/80 px-4 py-2 text-xs sm:text-sm text-gray-700 shadow-sm hover:border-red-400 hover:bg-red-50 transition-all ${
                      loading
                        ? "cursor-not-allowed opacity-80"
                        : "cursor-pointer"
                    }`}
                    onClick={() => {
                      const input = document.getElementById("file");
                      if (input) {
                        input.click();
                      }
                    }}
                  >
                    <Upload className="h-4 w-4" />
                    {isGerman ? "Foto hochladen" : "Upload Photo"}
                    {loading && (
                      <ImSpinner2 className="ml-1 h-4 w-4 animate-spin" />
                    )}
                  </button>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                  >
                    <Label htmlFor="name" className="text-xs font-medium">
                      {isGerman ? "Vorname" : "First Name"}
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData?.name}
                      onChange={handleChange}
                      required
                      className="rounded-xl border-gray-200 bg-white/80 focus-visible:ring-red-500 focus-visible:border-red-400 transition-all"
                    />
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 }}
                  >
                    <Label htmlFor="lastName" className="text-xs font-medium">
                      {isGerman ? "Nachname" : "Last Name"}
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData?.lastName || ""}
                      onChange={handleChange}
                      className="rounded-xl border-gray-200 bg-white/80 focus-visible:ring-red-500 focus-visible:border-red-400 transition-all"
                    />
                  </motion.div>

                  <motion.div
                    className="space-y-2 md:col-span-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Label htmlFor="email" className="text-xs font-medium">
                      {isGerman ? "E-Mail" : "Email"}
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData?.email}
                      onChange={handleChange}
                      required
                      className="rounded-xl border-gray-200 bg-white/80 focus-visible:ring-red-500 focus-visible:border-red-400 transition-all"
                    />
                  </motion.div>

                  <motion.div
                    className="space-y-2 md:col-span-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <Label htmlFor="number" className="text-xs font-medium">
                      {isGerman ? "Telefonnummer" : "Phone Number"}
                    </Label>
                    <div className="rounded-xl border border-gray-200 bg-white/80 px-2 py-1.5 focus-within:border-red-400 focus-within:ring-1 focus-within:ring-red-500 transition-all">
                      <PhoneNumberInput
                        value={number}
                        setPhone={setNumber}
                        placeholder="+1 234 567 8901"
                        phoneCode={phoneCode}
                        setPhoneCode={setPhoneCode}
                      />
                    </div>
                  </motion.div>
                </div>
              </TabsContent>

              <TabsContent value="address" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    className="space-y-2 md:col-span-2 relative"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                  >
                    <div className="flex items-center justify-between">
                      <Label htmlFor="address" className="text-xs font-medium">
                        {isGerman ? "Adresse" : "Address"}
                      </Label>
                      <span className="text-[11px] text-gray-400">
                        {isGerman
                          ? "Suche mit Google Maps, um deinen Standort zu finden"
                          : "Powered by Google Maps for smarter suggestions"}
                      </span>
                    </div>
                    <div className="relative">
                      <Textarea
                        id="address"
                        name="address"
                        value={addressQuery}
                        onChange={(e) => {
                          const value = e.target.value;
                          setAddressQuery(value);
                          setFormData((prev) => ({
                            ...prev,
                            address: value,
                          }));
                        }}
                        placeholder={
                          isGerman
                            ? "Beginnen Sie mit der Eingabe Ihrer Adresse..."
                            : "Start typing your address to see suggestions..."
                        }
                        required
                        className="resize-none rounded-xl border-gray-200 bg-white/80 pr-10 focus-visible:ring-red-500 focus-visible:border-red-400 transition-all min-h-[90px]"
                      />
                      <div className="pointer-events-none absolute right-3 top-3 text-red-500/80">
                        {isAddressLoading ? (
                          <ImSpinner2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <MapPin className="h-4 w-4" />
                        )}
                      </div>
                    </div>

                    {addressSuggestions?.length > 0 && (
                      <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white/95 shadow-lg max-h-60 overflow-y-auto backdrop-blur-sm">
                        {addressSuggestions.map((suggestion) => (
                          <button
                            key={suggestion.place_id}
                            type="button"
                            className="flex w-full items-start gap-2 px-3 py-2 text-left text-sm text-gray-800 hover:bg-red-50 transition-colors"
                            onClick={() => {
                              const desc = suggestion.description;
                              setAddressQuery(desc);
                              setFormData((prev) => ({
                                ...prev,
                                address: desc,
                              }));
                              setAddressSuggestions([]);
                            }}
                          >
                            <MapPin className="mt-1 h-4 w-4 text-red-500" />
                            <span>{suggestion.description}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Label htmlFor="city" className="text-xs font-medium">
                      {isGerman ? "Stadt" : "City"}
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData?.city}
                      onChange={handleChange}
                      placeholder={
                        isGerman ? "Gib deine Stadt ein" : "Enter your city"
                      }
                      className=" border-gray-200 bg-white/80 min-h-[2.6rem] rounded-full focus-visible:ring-red-500 focus-visible:border-red-400 transition-all"
                    />
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <Label htmlFor="state" className="text-xs font-medium">
                      {isGerman ? "Bundesland" : "State/Province"}
                    </Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData?.state}
                      onChange={handleChange}
                      placeholder={
                        isGerman
                          ? "Gib dein Bundesland ein"
                          : "Enter your state"
                      }
                      className=" min-h-[2.6rem] rounded-full border-gray-200 bg-white/80 focus-visible:ring-red-500 focus-visible:border-red-400 transition-all"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      {isGerman ? "Land" : "Country"}
                      <span className="text-red-700 ml-0.5">*</span>
                    </label>
                    <div className="rounded-full border border-gray-200 bg-white/80 px-1.5 py-1 focus-within:border-red-400 focus-within:ring-1 focus-within:ring-red-500 transition-all">
                      <Popover
                        open={isCountryOpen}
                        onOpenChange={setIsCountryOpen}
                      >
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="w-full h-10 rounded-full border-0 bg-transparent shadow-none focus:ring-0 focus:ring-offset-0 px-2 flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              {selectedCountry ? (
                                <>
                                  <ReactCountryFlag
                                    countryCode={selectedCountry.cca2}
                                    svg
                                    style={{
                                      width: "1.5em",
                                      height: "1.5em",
                                      flexShrink: 0,
                                    }}
                                  />
                                  <span className="truncate">
                                    {selectedCountry.name.common}
                                  </span>
                                </>
                              ) : (
                                <span className="text-gray-500">
                                  {isGerman
                                    ? "Land auswählen"
                                    : "Select country"}
                                </span>
                              )}
                            </div>
                            <ChevronsUpDown className="h-4 w-4 opacity-50 flex-shrink-0 ml-2" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[var(--radix-popover-trigger-width)] p-0 z-[99999999] max-h-[400px]"
                          align="start"
                          sideOffset={4}
                          style={{ zIndex: 99999999 }}
                        >
                          <Command className="rounded-lg border-0">
                            <CommandInput
                              placeholder={
                                isGerman
                                  ? "Land suchen..."
                                  : "Search country..."
                              }
                              className="h-9"
                            />
                            <CommandList className="max-h-[300px] overflow-y-auto">
                              <CommandEmpty>
                                {isGerman
                                  ? "Kein Land gefunden"
                                  : "No country found"}
                              </CommandEmpty>
                              <CommandGroup>
                                {sortedCountries.map((country) => (
                                  <CommandItem
                                    key={country.cca2}
                                    value={country.name.common}
                                    onSelect={() => {
                                      setFormData({
                                        ...formData,
                                        country: country.name.common,
                                      });
                                      setIsCountryOpen(false);
                                    }}
                                    className="cursor-pointer data-[selected=true]:bg-red-50 data-[selected=true]:text-red-900"
                                  >
                                    <div className="flex items-center gap-2 w-full">
                                      <ReactCountryFlag
                                        countryCode={country.cca2}
                                        svg
                                        style={{
                                          width: "1.5em",
                                          height: "1.5em",
                                          flexShrink: 0,
                                        }}
                                      />
                                      <span className="flex-1">
                                        {country.name.common}
                                      </span>
                                      {formData.country ===
                                        country.name.common && (
                                        <Check className="h-4 w-4 text-red-600" />
                                      )}
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <Label htmlFor="pincode" className="text-xs font-medium">
                      {isGerman ? "Postleitzahl" : "Postal Code"}
                    </Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={formData?.pincode}
                      onChange={handleChange}
                      placeholder={
                        isGerman
                          ? "Gib deine Postleitzahl ein"
                          : "Enter your postal code"
                      }
                      className=" min-h-[2.6rem] rounded-full border-gray-200 bg-white/80  focus-visible:ring-red-500 focus-visible:border-red-400 transition-all"
                    />
                  </motion.div>
                </div>
              </TabsContent>

              <TabsContent value="bank" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="accountHolder">Account Holder Name</Label>
                    <Input
                      id="accountHolder"
                      name="accountHolder"
                      value={formData?.accountHolder}
                      onChange={handleChange}
                      placeholder="Enter your account holder name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      name="accountNumber"
                      value={formData?.accountNumber}
                      onChange={handleChange}
                      placeholder="Enter your account number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ifscCode">IFSC Code</Label>
                    <Input
                      id="ifscCode"
                      name="ifscCode"
                      value={formData?.ifscCode}
                      onChange={handleChange}
                      placeholder="Enter your IFSC code"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ifscCode">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      type={"date"}
                      value={formData?.expiryDate}
                      onChange={handleChange}
                      placeholder="Enter your expiry date"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ifscCode">CVV</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      value={formData?.cvv}
                      onChange={handleChange}
                      placeholder="Enter your CVV"
                    />
                  </div>
                </div>
              </TabsContent>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-red-100 mt-4">
                <p className="text-[11px] text-gray-500">
                  {isGerman
                    ? "Änderungen werden sicher gespeichert. Drücken Sie „Änderungen speichern“ zum Bestätigen."
                    : "Changes are saved securely. Press “Save Changes” to confirm."}
                </p>
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="cursor-pointer rounded-full border-gray-200 bg-white/80 hover:bg-gray-50"
                  >
                    {isGerman ? "Abbrechen" : "Cancel"}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className={`rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-700 hover:via-rose-700 hover:to-red-600 shadow-md shadow-red-500/25 px-5 ${
                      isLoading
                        ? "cursor-not-allowed opacity-90"
                        : "cursor-pointer"
                    } flex items-center gap-2`}
                  >
                    {isGerman ? "Änderungen speichern" : "Save Changes"}
                    {isLoading && (
                      <ImSpinner2 className="h-4 w-4 animate-spin" />
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Tabs>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
