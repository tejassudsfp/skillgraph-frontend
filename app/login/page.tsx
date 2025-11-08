"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_SKILLGRAPH_API_URL || "http://localhost:8000";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to send OTP");
      }

      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for cookies
        body: JSON.stringify({ email, otp_code: otp }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Invalid OTP");
      }

      // Redirect to chat page
      router.push("/chat");
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16" style={{ backgroundColor: "#fff9ef" }}>
      <div className="w-full max-w-md px-4">
        <div className="border-2 rounded-lg p-8" style={{ borderColor: "#2d2d2d", backgroundColor: "#fff9ef" }}>
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#2d2d2d" }}>
            {step === "email" ? "sign in" : "enter code"}
          </h1>
          <p className="text-sm mb-8" style={{ color: "#6a6a6a" }}>
            {step === "email"
              ? "enter your email to get started"
              : `we sent a code to ${email}`}
          </p>

          {error && (
            <div className="mb-4 p-3 border-2 rounded" style={{ borderColor: "#ff4444", backgroundColor: "#fff0f0" }}>
              <p className="text-sm" style={{ color: "#cc0000" }}>{error}</p>
            </div>
          )}

          {step === "email" ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#2d2d2d" }}>
                  email address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                  className="w-full"
                  style={{
                    borderColor: "#2d2d2d",
                    borderWidth: "2px",
                  }}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full font-medium"
                style={{
                  backgroundColor: "#2d2d2d",
                  color: "#fff9ef",
                }}
              >
                {loading ? "sending..." : "send code"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#2d2d2d" }}>
                  6-digit code
                </label>
                <Input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  required
                  disabled={loading}
                  className="w-full text-center text-2xl tracking-widest"
                  style={{
                    borderColor: "#2d2d2d",
                    borderWidth: "2px",
                  }}
                  maxLength={6}
                />
              </div>

              <Button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full font-medium"
                style={{
                  backgroundColor: "#2d2d2d",
                  color: "#fff9ef",
                }}
              >
                {loading ? "verifying..." : "verify"}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setOtp("");
                  setError("");
                }}
                className="w-full text-sm underline"
                style={{ color: "#6a6a6a" }}
              >
                use a different email
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm mt-8" style={{ color: "#6a6a6a" }}>
          by signing in, you agree to our{" "}
          <Link href="/terms" className="underline" style={{ color: "#2d2d2d" }}>
            terms of use
          </Link>{" "}
          and to receive emails from skillgraph
        </p>
      </div>
    </div>
  );
}
