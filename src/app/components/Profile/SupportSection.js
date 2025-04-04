import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function SupportSection() {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    orderNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Support request submitted:", formData);
    // Here you would typically send the data to your API
    alert(
      "Your support request has been submitted. We'll get back to you soon!"
    );
    setFormData({
      subject: "",
      message: "",
      orderNumber: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Support</CardTitle>
        <CardDescription>Get help with your orders or account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4">Contact Support</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="What do you need help with?"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orderNumber">Order Number (Optional)</Label>
                <Input
                  id="orderNumber"
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleChange}
                  placeholder="If related to an order"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Please describe your issue in detail"
                  className="min-h-[150px]"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#C6080A] hover:bg-[#a50709]"
              >
                Submit Request
              </Button>
            </form>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {[
                {
                  question: "How do I track my order?",
                  answer:
                    "You can track your order by going to the Orders History section and clicking on 'View Details' for the specific order. You'll find tracking information there once your order has been shipped.",
                },
                {
                  question: "What is your return policy?",
                  answer:
                    "We accept returns within 30 days of delivery. Items must be in original condition with tags attached. To initiate a return, go to your order details and click the 'Return' button.",
                },
                {
                  question: "How do I redeem a coupon?",
                  answer:
                    "You can apply coupon codes during checkout. Simply enter the code in the designated field and click 'Apply' to see the discount reflected in your total.",
                },
                {
                  question: "When will I receive my refund?",
                  answer:
                    "Refunds are typically processed within 5-7 business days after we receive your returned item. The funds may take an additional 3-5 business days to appear in your account, depending on your bank.",
                },
              ].map((faq, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#C6080A] mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {faq.question}
                  </h4>
                  <p className="text-sm text-gray-600 mt-2 pl-7">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#C6080A] mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Contact Information
              </h4>
              <div className="mt-2 pl-7 space-y-2">
                <p className="text-sm">Customer Service: +1 (800) 123-4567</p>
                <p className="text-sm">Email: support@example.com</p>
                <p className="text-sm">Hours: Monday-Friday, 9am-6pm EST</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
