"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useRef, useState } from "react";
import { QrCode, Camera } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

export default function Home() {
  const [page, setPage] = useState<"home" | "showQR" | "scanQR">("home");
  const [scanResult, setScanResult] = useState<string | null>(null);
  const scannerRef = useRef<any>(null);

  const [udpiId, setUdpiId] = useState<string>("");

  const generateUdpiId = async () => {
    const id = Math.random().toString(36).substring(2, 10);
    setUdpiId(id);

    await fetch('/api/save-udpi', {
      method: 'POST',
      body: JSON.stringify({ udpiId: id }),
      headers: { 'Content-Type': 'application/json' }
    });
  };

  useEffect(() => {
    if (page === "scanQR") {
      if (!scannerRef.current) {
        scannerRef.current = new Html5QrcodeScanner(
          "reader",
          { fps: 10, qrbox: { width: 250, height: 250 } },
          /* verbose= */ false
        );

        scannerRef.current.render(
          (decodedText: string) => {
            setScanResult(decodedText);
            scannerRef.current.clear();
          },
          (errorMessage: string) => {
            console.warn(errorMessage);
          }
        );
      }
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    };
  }, [page]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 flex flex-col items-center p-6 relative">
      <div className="flex w-full justify-center items-center p-20">
      <ConnectButton />
    </div>

      {/* Main Content */}
      {page === "home" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col gap-8 items-center mt-32"
        >
          <h1 className="text-4xl font-bold text-indigo-800">Welcome</h1>
          <div className="flex gap-10">
            {/* Show QR */}
            <button
              onClick={() => setPage("showQR")}
              className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
            >
              <QrCode className="h-12 w-12 text-indigo-600 mb-2" />
              <span className="font-semibold text-indigo-700">Show QR</span>
            </button>

            {/* Scan QR */}
            <button
              onClick={() => setPage("scanQR")}
              className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
            >
              <Camera className="h-12 w-12 text-indigo-600 mb-2" />
              <span className="font-semibold text-indigo-700">Scan QR</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Show QR Code */}
      {page === "showQR" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center mt-32 gap-6"
        >
          <h2 className="text-3xl font-bold text-indigo-800">Generate UDPI ID & QR</h2>
          
          <button
            onClick={generateUdpiId}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition"
          >
            Generate UDPI ID & QR
          </button>

          {/* Show QR if generated */}
          {udpiId && (
            <div className="bg-white p-8 rounded-2xl shadow-md flex flex-col items-center gap-4">
              <QRCodeSVG value={udpiId} size={150} />
              <p className="text-indigo-700 font-medium">{udpiId}</p>
            </div>
          )}

          <button
            onClick={() => setPage("home")}
            className="mt-8 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-6 rounded-full transition"
          >
            Back
          </button>
        </motion.div>
      )}

      {/* Scan QR Code */}
      {page === "scanQR" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center mt-24 gap-6"
        >
          <h2 className="text-3xl font-bold text-indigo-800">Scan a QR Code</h2>

          <div id="reader" className="w-72 h-72 bg-white rounded-2xl shadow-md overflow-hidden" />

          {/* Scanned result */}
          {scanResult && (
            <div className="mt-4 text-center">
              <p className="text-indigo-700 font-semibold">Scanned QR Data:</p>
              <p className="bg-white p-3 mt-2 rounded-xl shadow-md text-indigo-800">
                {scanResult}
              </p>
            </div>
          )}

          <button
            onClick={() => setPage("home")}
            className="mt-8 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-6 rounded-full transition"
          >
            Back
          </button>
        </motion.div>
      )}
    </div>
  );
}