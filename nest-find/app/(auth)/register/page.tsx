"use client";
import PasswordRequirements, {isPasswordValid} from "@/components/PasswordRequirements";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/lib/auth";
import Image from "next/image";
import { EyeOff, LockIcon, MailIcon, UserIcon, Eye } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setshowPassword] = useState(false);

  const handleRegister = async () => {
    setError("");
    setLoading(true);

    try {
      const { user } = await registerUser(username, email, password, role);
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
            src="/login-2.svg"
            alt="Illustration of a person browsing property listings"
            width={1000}
            height={600}
            className="w-full h-auto"
          />
          <h2 className="mt-6 text-3xl font-bold text-background">
            Join nestFind today
          </h2>
          <p className="mt-2 text-secondary-foreground/70 font-other">
            Create an account to browse listings, save favorites, or list your own property.
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
            className="h-12 w-70 mb-6"
          />
          <h1 className="text-3xl mb-1">Create Account</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Sign up to start browsing or listing properties
          </p>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex flex-col gap-4 items-center">
            <div className="w-full relative flex items-center mb-3">
              <UserIcon className="font-other absolute left-2 h-5 w-5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="font-medium font-other border-b-2 p-2 pl-10 w-full focus:outline-none focus:border-primary"
              />
            </div>

            <div className="w-full relative flex items-center mb-3">
              <MailIcon className="font-other absolute left-2 h-5 w-5 text-muted-foreground pointer-events-none" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-medium font-other border-b-2 p-2 pl-10 w-full focus:outline-none focus:border-primary"
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
                className="font-medium font-other border-b-2 p-2 pl-10 pr-10 w-full focus:outline-none focus:border-primary"
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

            <PasswordRequirements password={password} />

            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                type="button"
                onClick={() => setRole("user")}
                className={`border-2 rounded-md p-3 text-sm font-medium transition-colors ${
                  role === "user"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                Home Buyer
                <p className="text-xs font-normal mt-1 text-muted-foreground">
                  Browse & save listings
                </p>
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`border-2 rounded-md p-3 text-sm font-medium transition-colors ${
                  role === "admin"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                Realtor
                <p className="text-xs font-normal mt-1 text-muted-foreground">
                  Post & manage listings
                </p>
              </button>
            </div>

            <button
              onClick={handleRegister}
              disabled={loading || !isPasswordValid(password)}
              className="bg-primary w-full text-primary-foreground mt-3 rounded-full p-2 hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>

          <p className="text-sm mt-4 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
