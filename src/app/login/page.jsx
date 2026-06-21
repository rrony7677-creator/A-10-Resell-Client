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
import { signIn } from "@/lib/auth-client";
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
      }
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <Card className="w-full max-w-md bg-gray-900 border border-gray-800 p-6 shadow-xl">
        <CardHeader className="flex flex-col gap-1 items-start pb-0 px-0">
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-sm text-gray-400">
            Sign in to <span className="text-blue-500 font-semibold">ResellHub</span> to manage your items.
          </p>
        </CardHeader>

        <Form onSubmit={handleSignIn} className="flex flex-col gap-5 w-full mt-6">
          {/* Email Address Field */}
          <TextField isRequired name="email" type="email" className="flex flex-col gap-1.5 w-full">
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
          <TextField isRequired name="password" className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-zinc-300">
                Password
              </Label>
            </div>
            <InputGroup className="flex items-center gap-2 border border-zinc-800 rounded-xl px-3 bg-zinc-900 focus-within:border-blue-500 transition-colors">
              <ShieldKeyhole className="text-zinc-400 pointer-events-none" size={16} />
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
        </Form>

        {/* Links Navigation mapping matching exactly to route configurations */}
        <div className="mt-6 text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/signUp" className="text-blue-400 hover:underline font-medium">
            Sign Up
          </Link>
        </div>
      </Card>
    </div>
  );
}