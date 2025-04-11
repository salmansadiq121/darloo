"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function FAQData() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  // /api/v1/faq/all
  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/faq/all`
      );
      setFaqs(data.faqs);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);
  return <div>Faqs</div>;
}
