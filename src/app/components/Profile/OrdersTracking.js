import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Truck, PackageCheck, XCircle } from "lucide-react";
import axios from "axios";

export default function OrdersTracking() {
  const [trackingNumber, setTrackingNumber] = useState("");
  //   const [carrierCode, setCarrierCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTrackingData(null);

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/order/track?trackingNumber=${trackingNumber}`
      );
      const data = await res.json();

      if (data.success) {
        setTrackingData(data.details);
      } else {
        setError(data.message || "Tracking failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold text-red-600 mb-6 text-center"
      >
        📦 Track Your Order
      </motion.h1>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-2xl w-full max-w-lg p-6 space-y-4 border"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tracking Number
          </label>
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Enter tracking number"
            required
          />
        </div>

        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Carrier Code
          </label>
          <input
            type="text"
            value={carrierCode}
            onChange={(e) => setCarrierCode(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="e.g. ups, fedex"
            required
          />
        </div> */}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center bg-red-600 text-white py-2 rounded-xl font-semibold shadow hover:bg-red-700 transition"
        >
          {loading ? (
            "Tracking..."
          ) : (
            <>
              <Search className="w-5 h-5 mr-2" /> Track Order
            </>
          )}
        </motion.button>
      </motion.form>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center space-x-2"
        >
          <XCircle className="w-5 h-5" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Tracking Data */}
      {trackingData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-8 w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 border"
        >
          <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center">
            <Truck className="w-6 h-6 mr-2" /> Current Status
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-medium text-gray-700">
                Tracking Number:
              </span>
              <span>{trackingData.tracking_number}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-medium text-gray-700">Carrier:</span>
              <span>{trackingData.carrier_code}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-medium text-gray-700">Status:</span>
              <span className="text-red-600 font-semibold capitalize">
                {trackingData.status}
              </span>
            </div>
            {trackingData.latest_event && (
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-medium text-gray-700">
                  Latest Update:
                </span>
                <span className="text-sm text-gray-600">
                  {trackingData.latest_event}
                </span>
              </div>
            )}
          </div>

          {/* Timeline Animation */}
          {trackingData.origin_info && trackingData.origin_info.trackinfo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <PackageCheck className="w-5 h-5 mr-2 text-red-600" /> Shipment
                Timeline
              </h3>
              <ul className="space-y-4">
                {trackingData.origin_info.trackinfo.map((event, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-6 border-l-2 border-red-600"
                  >
                    <span className="absolute -left-3 top-0 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs">
                      {index + 1}
                    </span>
                    <p className="text-gray-800 font-medium">
                      {event.StatusDescription}
                    </p>
                    <p className="text-xs text-gray-500">{event.Date}</p>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
