"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_SKILLGRAPH_API_URL || "http://localhost:8000";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/me`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUser({ email: data.email });
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav
      className="border-b-2 fixed top-0 left-0 right-0 z-50"
      style={{ backgroundColor: "#fff9ef", borderColor: "#2d2d2d" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold" style={{ color: "#2d2d2d" }}>
            skillgraph
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                isActive("/") ? "font-bold" : ""
              }`}
              style={{ color: "#2d2d2d" }}
            >
              home
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors ${
                isActive("/about") ? "font-bold" : ""
              }`}
              style={{ color: "#2d2d2d" }}
            >
              about sg
            </Link>
            <Link
              href="/updates"
              className={`text-sm font-medium transition-colors ${
                isActive("/updates") ? "font-bold" : ""
              }`}
              style={{ color: "#2d2d2d" }}
            >
              updates
            </Link>
            <a
              href="https://github.com/tejassudsfp/skillgraph"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium transition-colors"
              style={{ color: "#2d2d2d" }}
            >
              github
            </a>
            <Link
              href="/terms"
              className={`text-sm font-medium transition-colors ${
                isActive("/terms") ? "font-bold" : ""
              }`}
              style={{ color: "#2d2d2d" }}
            >
              terms
            </Link>

            {/* Chat or Try Now */}
            {user ? (
              <Link href="/chat">
                <Button
                  size="sm"
                  className="font-medium"
                  style={{
                    backgroundColor: "#2d2d2d",
                    color: "#fff9ef",
                  }}
                >
                  chat
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button
                  size="sm"
                  className="font-medium"
                  style={{
                    backgroundColor: "#2d2d2d",
                    color: "#fff9ef",
                  }}
                >
                  try now
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="#2d2d2d"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t-2" style={{ borderColor: "#2d2d2d" }}>
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className={`text-base font-medium ${
                  isActive("/") ? "font-bold" : ""
                }`}
                style={{ color: "#2d2d2d" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                home
              </Link>
              <Link
                href="/about"
                className={`text-base font-medium ${
                  isActive("/about") ? "font-bold" : ""
                }`}
                style={{ color: "#2d2d2d" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                about sg
              </Link>
              <Link
                href="/updates"
                className={`text-base font-medium ${
                  isActive("/updates") ? "font-bold" : ""
                }`}
                style={{ color: "#2d2d2d" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                updates
              </Link>
              <a
                href="https://github.com/tejassudsfp/skillgraph"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-medium"
                style={{ color: "#2d2d2d" }}
              >
                github
              </a>
              <Link
                href="/terms"
                className={`text-base font-medium ${
                  isActive("/terms") ? "font-bold" : ""
                }`}
                style={{ color: "#2d2d2d" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                terms
              </Link>

              {/* Mobile User Profile or Try Now */}
              {user ? (
                <>
                  <Link
                    href="/chat"
                    className="text-base font-medium"
                    style={{ color: "#2d2d2d" }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    chat
                  </Link>
                  <div className="flex items-center gap-2 py-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
                      style={{ backgroundColor: "#2d2d2d", color: "#fff9ef" }}
                    >
                      {user.email[0].toUpperCase()}
                    </div>
                    <span className="text-sm" style={{ color: "#6a6a6a" }}>
                      {user.email}
                    </span>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="font-medium border-2"
                    style={{
                      borderColor: "#2d2d2d",
                      color: "#2d2d2d",
                    }}
                  >
                    logout
                  </Button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    size="sm"
                    className="font-medium w-full"
                    style={{
                      backgroundColor: "#2d2d2d",
                      color: "#fff9ef",
                    }}
                  >
                    try now
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
