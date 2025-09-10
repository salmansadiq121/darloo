import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function PhoneNumberInput({
  value,
  setPhone,
  placeholder,
  phoneCode,
  setPhoneCode,
}) {
  return (
    <PhoneInput
      country={"us"}
      value={value}
      onChange={(phone, country) => {
        setPhone(phone);
        setPhoneCode("+" + country.dialCode);
      }}
      placeholder={placeholder || "Enter phone number"}
      enableSearch
      disableDropdown={false}
      inputProps={{
        name: "phone",
        required: true,
        autoFocus: false,
      }}
      inputStyle={{
        width: "100%",
        height: "2.8rem",
        borderRadius: "6px",
        border: "1px solid #999",
        backgroundColor: "#ffffff",
        paddingLeft: "48px",

        overflow: "hidden",
      }}
      buttonStyle={{
        border: "none",
        background: "none",
      }}
      containerStyle={{ width: "100%" }}
    />
  );
}
