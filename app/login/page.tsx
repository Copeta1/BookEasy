"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apifetch } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { FaGoogle } from "react-icons/fa";

type AuthResponse = {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  businessName: string;
  businessId: number;
};

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    businessName: "",
  });

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await apifetch<AuthResponse>("/api/Auth/login", {
        method: "POST",
        body: JSON.stringify(loginForm),
      });
      setUser(data);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError("");
    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const data = await apifetch<AuthResponse>("/api/Auth/register", {
        method: "POST",
        body: JSON.stringify(registerForm),
      });
      setUser(data);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-indigo-50 flex flex-col">
      {/* Back to home */}
      <div className="px-6 py-4">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Forma */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <h1 className="font-display text-3xl font-bold text-indigo-600 mb-2">
          BookEasy
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Manage your schedule with ease.
        </p>

        <div className="bg-white border border-gray-100 rounded-2xl p-8 w-full max-w-md shadow-sm">
          {/* Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                isLogin
                  ? "bg-indigo-600 text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                !isLogin
                  ? "bg-indigo-600 text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Register
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          {/* Login forma */}
          {isLogin ? (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-indigo-700 mt-2 disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    value={registerForm.firstName}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        firstName: e.target.value,
                      })
                    }
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={registerForm.lastName}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        lastName: e.target.value,
                      })
                    }
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Business Name
                </label>
                <input
                  type="text"
                  placeholder="Sarah's Studio"
                  value={registerForm.businessName}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      businessName: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, email: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      password: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={registerForm.confirmPassword}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-indigo-700 mt-2 disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100"></div>
            <span className="text-xs text-gray-400">Or continue with</span>
            <div className="flex-1 h-px bg-gray-100"></div>
          </div>

          {/* Google */}
          <button className="w-full border border-gray-200 rounded-xl py-3 text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
            <FaGoogle className="w-4 h-4 text-red-500" />
            Google
          </button>

          <p className="text-center text-xs text-gray-400 mt-6">
            By continuing, you agree to BookEasy&apos;s{" "}
            <a href="#" className="text-indigo-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-indigo-600 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 flex items-center justify-between max-w-md mx-auto w-full">
        <p className="text-xs text-gray-400">
          © 2024 BookEasy SaaS. All rights reserved.
        </p>
        <div className="flex gap-4">
          <a href="#" className="text-xs text-gray-400 hover:text-gray-600">
            Privacy
          </a>
          <a href="#" className="text-xs text-gray-400 hover:text-gray-600">
            Terms
          </a>
          <a href="#" className="text-xs text-gray-400 hover:text-gray-600">
            Contact
          </a>
        </div>
      </div>
    </div>
  );
}
