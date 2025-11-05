import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Article from "./pages/Article";
import About from "./pages/About";
import React, { useState } from "react";
import axios from "axios";

export default function App() {
  // --- Admin Panel State ---
  const [secret, setSecret] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Config ---
  const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET || "Ashlesha@3462";
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL ||
    "https://autoblog-x3m1.onrender.com/admin/generate-blog";

  // --- Verify Secret ---
  const handleSecretSubmit = () => {
    if (secret.trim() === ADMIN_SECRET) {
      setAuthorized(true);
      setMessage("✅ Access granted! Manual blog generation unlocked.");
    } else {
      setMessage("❌ Invalid secret. Access denied.");
    }
  };

  // --- Trigger Blog Generation ---
  const handleGenerateBlog = async () => {
    try {
      setLoading(true);
      setMessage("⏳ Generating blog manually...");
      const res = await axios.post(
        BACKEND_URL,
        {},
        {
          headers: { "X-Admin-Key": ADMIN_SECRET },
        }
      );
      setMessage(`✅ Blog generated: ${res.data.message || "Done!"}`);
    } catch (error) {
      console.error(error);
      setMessage("❌ Error generating blog manually.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="min-h-screen bg-dark-bg flex flex-col">
        {/* Header */}
        <Header />

        {/* Routes */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article/:id" element={<Article />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>

        {/* --- Admin Secret + Manual Trigger Panel --- */}
        <div className="p-6 bg-gray-900 border-t border-gray-800 text-white flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-3 text-blue-400">
            Admin Blog Control Panel
          </h2>

          {!authorized ? (
            <div className="flex flex-col items-center space-y-3">
              <input
                type="password"
                placeholder="Enter Admin Secret"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="p-2 rounded-md text-black text-center outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSecretSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
              >
                Verify Secret
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <button
                onClick={handleGenerateBlog}
                disabled={loading}
                className={`${loading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                  } text-white font-semibold py-2 px-4 rounded-md transition`}
              >
                {loading ? "Generating..." : "Generate Blog Manually"}
              </button>
            </div>
          )}

          {message && (
            <p
              className={`mt-3 text-sm ${message.includes("❌")
                  ? "text-red-400"
                  : message.includes("✅")
                    ? "text-green-400"
                    : "text-yellow-400"
                }`}
            >
              {message}
            </p>
          )}
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}
