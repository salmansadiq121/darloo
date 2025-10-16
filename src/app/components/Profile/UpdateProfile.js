"use client";
import React, { useEffect, useState } from "react";
import { Camera, Upload } from "lucide-react";
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
import Select from "react-select";
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
  const isGerman = countryCode === "DE";

  useEffect(() => {
    setAvatar(user?.avatar);
    setFormData({
      name: user?.name,
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
  }, [user]);

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
        userData.append("email", formData.email);
        userData.append("number", number);
        userData.append("phoneCode", phoneCode);
        userData.append("image", avatar);

        const { data } = await axios.put(
          `${authUri}/update/profile/${user?._id}`,
          userData
        );
        if (data) {
          localStorage.setItem("@ayoob", JSON.stringify({ user: data.user }));
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

  // Sort countries alphabetically
  const sortedCountries = [...countries].sort((a, b) =>
    a.name.common.localeCompare(b.name.common)
  );

  const countryOptions = countries.map((country) => ({
    value: country.name.common,
    label: (
      <div className="flex items-center gap-2">
        <ReactCountryFlag
          countryCode={country.cca2}
          svg
          style={{
            width: "1.5em",
            height: "1.5em",
          }}
        />
        <span>{country.name.common}</span>
      </div>
    ),
    name: country.name.common,
  }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl sm:min-w-[45rem] max-h-[95vh] overflow-y-auto shidden">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isGerman ? "Profil aktualisieren" : "Update Profile"}
          </DialogTitle>
          <DialogDescription>
            {isGerman
              ? "Ändern Sie hier Ihre Profilinformationen."
              : "Make changes to your profile information here."}
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="personal"
          className="mt-6"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-2 mb-6 gap-1 bg-red-100 overflow-x-auto shidden">
            <TabsTrigger
              value="personal"
              className="px-4 min-w-fit mr-5 sm:mr-0 rounded-md data-[state=active]:bg-red-700 data-[state=active]:text-white text-black"
              onClick={() => setActiveTab("personal")}
            >
              {isGerman ? "Persönliche Info" : "Personal Info"}
            </TabsTrigger>
            <TabsTrigger
              value="address"
              className="px-4 min-w-fit ml-5 sm:ml-0  rounded-md data-[state=active]:bg-red-700 data-[state=active]:text-white text-black"
              onClick={() => setActiveTab("address")}
            >
              {isGerman ? "Adresse" : "Address"}
            </TabsTrigger>
            {/* <TabsTrigger
              value="bank"
              className="px-4 min-w-fit ml-5 sm:ml-0  rounded-md data-[state=active]:bg-red-700 data-[state=active]:text-white text-black"
              onClick={() => setActiveTab("bank")}
            >
              Bank Details
            </TabsTrigger> */}
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="personal" className="space-y-6">
              <div className="flex flex-col items-center justify-center mb-6">
                <Avatar className="h-24 w-24 mb-4 border-4 border-[#C6080A] relative">
                  <AvatarImage
                    src={avatar || "/placeholder.svg?height=96&width=96"}
                    alt={user?.name}
                  />
                  <AvatarFallback className="text-2xl bg-[#C6080A] text-white">
                    {user?.name
                      ?.split(" ")
                      ?.map((n) => n[0])
                      ?.join("")}
                  </AvatarFallback>
                  <div className="absolute bottom-1 right-2 bg-[#C6080A] rounded-full p-1 text-white cursor-pointer">
                    <Camera className="h-4 w-4" />
                  </div>
                </Avatar>
                <input
                  type="file"
                  onChange={(e) => handleUploadImage(e.target.files[0])}
                  className="hidden"
                  id="file"
                />
                <label
                  htmlFor="file"
                  disabled={loading}
                  className={`flex items-center gap-2 ${
                    loading ? "cursor-not-allowed" : "cursor-pointer"
                  }  border border-gray-400 rounded-md px-4 py-2 text-sm text-gray-500 hover:text-white hover:bg-[#C6080A] transition-all duration-300`}
                >
                  <Upload className="h-4 w-4" />
                  {isGerman ? "Foto hochladen" : "Upload Photo"}
                  {loading && (
                    <ImSpinner2 className="ml-1 h-4 w-4 animate-spin" />
                  )}
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {isGerman ? "Vollständiger Name" : "Full Name"}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData?.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{isGerman ? "E-Mail" : "Email"}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData?.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number">
                    {isGerman ? "Telefonnummer" : "Phone Number"}
                  </Label>
                  {/* <Input
                    id="number"
                    name="number"
                    value={formData?.number}
                    onChange={handleChange}
                  /> */}
                  <PhoneNumberInput
                    value={number}
                    setPhone={setNumber}
                    placeholder="+1 234 567 8901"
                    phoneCode={phoneCode}
                    setPhoneCode={setPhoneCode}
                  />
                </div>
                {/* <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell us about yourself"
                    className="resize-none"
                  />
                </div> */}
              </div>
            </TabsContent>

            <TabsContent value="address" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">
                    {isGerman ? "Adresse" : "Address"}
                  </Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData?.address}
                    onChange={handleChange}
                    placeholder="Enter your address"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">{isGerman ? "Stadt" : "City"}</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData?.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">
                    {isGerman ? "Bundesland" : "State/Province"}
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData?.state}
                    onChange={handleChange}
                    placeholder="Enter your state"
                  />
                </div>
                {/* <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData?.country}
                    onChange={handleChange}
                    placeholder="Enter your country"
                  />
                </div> */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {isGerman ? "Land" : "Country"}
                    <span className="text-red-700">*</span>
                  </label>
                  <Select
                    options={countryOptions}
                    value={countryOptions.find(
                      (option) => option.value === formData.country
                    )}
                    onChange={(selected) =>
                      setFormData({
                        ...formData,
                        country: selected?.value || "",
                      })
                    }
                    isSearchable
                    filterOption={(option, inputValue) =>
                      option.data.name
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">
                    {isGerman ? "Postleitzahl" : "Postal Code"}
                  </Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    value={formData?.pincode}
                    onChange={handleChange}
                    placeholder="Enter your postal code"
                  />
                </div>
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

            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className={`bg-[#C6080A] hover:bg-[#a50709] ${
                  isLoading
                    ? "cursor-not-allowed animate-pulse"
                    : "cursor-pointer"
                } flex items-center gap-2`}
              >
                Save Changes{" "}
                {isLoading && <ImSpinner2 className="h-4 w-4 animate-spin" />}
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
