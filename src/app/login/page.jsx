"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Form,
  TextField,
  Label,
  Input,
  Button,
  Card,
  CardHeader,
  InputGroup,
} from "@heroui/react";
import { authClient, signIn } from "@/lib/auth-client";
import { At, Eye, EyeSlash, ShieldKeyhole } from "@gravity-ui/icons";
import toast from "react-hot-toast";

export default function SignInPage() {
  const router = useRouter();

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Status States
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const togglePasswordVisibility = () => setIsVisible(!isVisible);

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({ provider: "google", callbackURL: "/" });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    // Pass configuration listeners directly into Better-Auth execution context
    await signIn.email(
      {
        email,
        password,
        // If you want Better-Auth to redirect automatically, keep this.
        // Otherwise, you can remove callbackURL and let router.push handle it below.
        callbackURL: "/",
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          setSuccess("Welcome back! Redirecting...");
          toast.success("You have successfully signed in!");
          setIsLoading(false);

          // Fallback manual client-side router transition if native redirect doesn't trigger
          setTimeout(() => {
            router.push("/");
          }, 1500);
        },
        onError: (ctx) => {
          setIsLoading(false);
          setError(ctx.error.message || "Invalid email or password.");
          toast.error(ctx.error.message || "Invalid email or password.");
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <Card className="w-full max-w-md bg-gray-900 border border-gray-800 p-6 shadow-xl">
        <CardHeader className="flex flex-col gap-1 items-start pb-0 px-0">
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-sm text-gray-400">
            Sign in to{" "}
            <span className="text-blue-500 font-semibold">ResellHub</span> to
            manage your items.
          </p>
        </CardHeader>

        <Form
          onSubmit={handleSignIn}
          className="flex flex-col gap-5 w-full mt-6"
        >
          {/* Email Address Field */}
          <TextField
            isRequired
            name="email"
            type="email"
            className="flex flex-col gap-1.5 w-full"
          >
            <Label className="text-sm font-medium text-zinc-300">
              Email Address
            </Label>
            <InputGroup className="flex items-center gap-2 border border-zinc-800 rounded-xl px-3 bg-zinc-900 focus-within:border-blue-500 transition-colors">
              <At className="text-zinc-400 pointer-events-none" size={16} />
              <Input
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent py-2 text-sm outline-none border-none text-zinc-100"
              />
            </InputGroup>
          </TextField>

          {/* Password Field */}
          <TextField
            isRequired
            name="password"
            className="flex flex-col gap-1.5 w-full"
          >
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-zinc-300">
                Password
              </Label>
            </div>
            <InputGroup className="flex items-center gap-2 border border-zinc-800 rounded-xl px-3 bg-zinc-900 focus-within:border-blue-500 transition-colors">
              <ShieldKeyhole
                className="text-zinc-400 pointer-events-none"
                size={16}
              />
              <Input
                type={isVisible ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent py-2 text-sm outline-none border-none text-zinc-100"
              />
              <button
                className="focus:outline-none text-zinc-400 hover:text-zinc-200 transition"
                type="button"
                onClick={togglePasswordVisibility}
                aria-label="toggle password visibility"
              >
                {isVisible ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </InputGroup>
          </TextField>

          {/* Status Notifications */}
          {error && (
            <div className="rounded-lg bg-danger-500/10 border border-danger-500/20 p-3 text-sm text-danger-400 w-full">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-success-500/10 border border-success-500/20 p-3 text-sm text-success-400 w-full">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full font-semibold bg-blue-600 text-white mt-2 h-10 rounded-lg hover:bg-blue-700 transition"
            isLoading={isLoading}
          >
            Sign In
          </Button>

          <div className="relative flex items-center my-2">
            <div className="grow border-t border-zinc-800" />
            <span className="px-3 text-xs text-zinc-500">OR</span>
            <div className="flex-grow border-t border-zinc-800" />
          </div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 border border-zinc-700 hover:bg-zinc-900 rounded-lg h-10 text-sm font-medium text-white transition mt-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
        </Form>

        {/* Links Navigation mapping matching exactly to route configurations */}
        <div className="mt-6 text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/signUp"
            className="text-blue-400 hover:underline font-medium"
          >
            Sign Up
          </Link>
        </div>
      </Card>
    </div>
  );
}
