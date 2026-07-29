"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/lib/auth";
import Image from "next/image";
import { Eye, EyeOff, LockIcon, MailIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setshowPassword] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const { user } = await loginUser(email, password); //cookie is set automatically by the browser
      await refresh();

      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen">
      {/* Illustration side */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-foreground p-12">
        <div className="max-w-lg text-center">
          <Image
            src="/login-1.svg"
            alt="Illustration of a person browsing property listings"
            width={1000}
            height={600}
            className="w-full h-auto"

          />
          <h2 className="mt-6 text-3xl font-bold text-background">
            Find your next home with nestFind
          </h2>
          <p className="mt-2  text-secondary-foreground/70 font-other">
            Browse listings, save favorites, and connect with owners all in one place.
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex flex-1 items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm">
          <Image 
             src="/navLogo.png"
              alt="logo"
              width={80}
              height={32}
              className="h-12 w-70 mb-6 "
          />
          <h1 className="text-3xl  mb-1">Sign In</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Login to your account to continue
          </p>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex flex-col gap-4 items-center">
            <div className="w-full relative flex items-center mb-6 ">
              <MailIcon className="font-other absolute left-2 h-5 w-5 text-muted-foreground pointer-events-none" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-medium font-other border-b-2 p-2  pl-10 w-full focus:outline-none focus:border-primary"
              />
              
            </div>
            
            <div className="w-full relative flex items-center mb-3 uppercase">
              <LockIcon className=" absolute left-2 h-5 w-5 text-muted-foreground pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className=" font-medium font-other border-b-2 p-2 pr-10 pl-10 w-full focus:outline-none focus:border-primary"
              />
              <button 
                type="button"
                onClick={() => setshowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                tabIndex={-1}
                className="absolute right-2 h-5 w-5 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="bg-primary w-full text-primary-foreground mt-3 rounded-full p-2 hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          <p className="text-sm mt-4 text-center">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}