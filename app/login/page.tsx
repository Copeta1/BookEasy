"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { apifetch } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { FaGoogle } from "react-icons/fa";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";

type AuthResponse = {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  businessName: string;
  businessId: number;
};

export default function LoginPage() {
  const { t } = useTranslation();
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
      setError(err instanceof Error ? err.message : t("login.genericError"));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError("");
    if (registerForm.password !== registerForm.confirmPassword) {
      setError(t("login.passwordMismatch"));
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
      setError(err instanceof Error ? err.message : t("login.genericError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-stone-50 via-white to-moss-50 flex flex-col">
      {/* Back to home */}
      <div className="px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm text-stone-500 hover:text-stone-900 flex items-center gap-1"
        >
          {t("login.backToHome")}
        </Link>
        <LanguageSwitcher />
      </div>

      {/* Forma */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <h1 className="font-display text-3xl font-bold text-moss-700 mb-2">
          {t("login.title")}
        </h1>
        <p className="text-stone-500 text-sm mb-8">{t("login.subtitle")}</p>

        <div className="bg-white border border-stone-100 rounded-3xl p-8 w-full max-w-md shadow-sm">
          {/* Toggle */}
          <div className="flex bg-stone-100 rounded-full p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${
                isLogin
                  ? "bg-moss-600 text-white"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              {t("login.loginTab")}
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${
                !isLogin
                  ? "bg-moss-600 text-white"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              {t("login.registerTab")}
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
                <label className="text-sm font-medium text-stone-700 mb-1.5 block">
                  {t("login.emailLabel")}
                </label>
                <input
                  type="email"
                  placeholder={t("login.emailPlaceholder") ?? ""}
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-100"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-stone-700">
                    {t("login.passwordLabel")}
                  </label>
                  <a
                    href="#"
                    className="text-sm text-moss-600 hover:text-moss-700"
                  >
                    {t("login.forgotPassword")}
                  </a>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-100"
                />
              </div>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-moss-600 text-white py-3 rounded-full text-sm font-medium hover:bg-moss-700 mt-2 disabled:opacity-50"
              >
                {loading ? t("login.signingIn") : t("login.signIn")}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-1.5 block">
                    {t("login.firstNameLabel")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("login.firstNamePlaceholder") ?? ""}
                    value={registerForm.firstName}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        firstName: e.target.value,
                      })
                    }
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-1.5 block">
                    {t("login.lastNameLabel")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("login.lastNamePlaceholder") ?? ""}
                    value={registerForm.lastName}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        lastName: e.target.value,
                      })
                    }
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-100"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700 mb-1.5 block">
                  {t("login.businessNameLabel")}
                </label>
                <input
                  type="text"
                  placeholder={t("login.businessNamePlaceholder") ?? ""}
                  value={registerForm.businessName}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      businessName: e.target.value,
                    })
                  }
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-100"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700 mb-1.5 block">
                  {t("login.emailLabel")}
                </label>
                <input
                  type="email"
                  placeholder={t("login.emailPlaceholder") ?? ""}
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, email: e.target.value })
                  }
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-100"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700 mb-1.5 block">
                  {t("login.passwordLabel")}
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
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-100"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700 mb-1.5 block">
                  {t("login.confirmPasswordLabel")}
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
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-100"
                />
              </div>
              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-moss-600 text-white py-3 rounded-full text-sm font-medium hover:bg-moss-700 mt-2 disabled:opacity-50"
              >
                {loading ? t("login.creatingAccount") : t("login.createAccount")}
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-stone-100"></div>
            <span className="text-xs text-stone-400">
              {t("login.orContinueWith")}
            </span>
            <div className="flex-1 h-px bg-stone-100"></div>
          </div>

          {/* Google */}
          <button className="w-full border border-stone-200 rounded-full py-3 text-sm font-medium hover:bg-stone-50 flex items-center justify-center gap-2">
            <FaGoogle className="w-4 h-4 text-red-500" />
            {t("login.google")}
          </button>

          <p className="text-center text-xs text-stone-400 mt-6">
            {t("login.termsPrefix")}{" "}
            <a href="#" className="text-moss-600 hover:underline">
              {t("login.termsOfService")}
            </a>{" "}
            {t("login.and")}{" "}
            <a href="#" className="text-moss-600 hover:underline">
              {t("login.privacyPolicy")}
            </a>
            .
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 flex items-center justify-between max-w-md mx-auto w-full">
        <p className="text-xs text-stone-400">{t("login.footerCopyright")}</p>
        <div className="flex gap-4">
          <a href="#" className="text-xs text-stone-400 hover:text-stone-600">
            {t("login.privacy")}
          </a>
          <a href="#" className="text-xs text-stone-400 hover:text-stone-600">
            {t("login.terms")}
          </a>
          <a href="#" className="text-xs text-stone-400 hover:text-stone-600">
            {t("login.contact")}
          </a>
        </div>
      </div>
    </div>
  );
}
