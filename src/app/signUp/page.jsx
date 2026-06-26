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
  RadioGroup,
  Radio,
} from "@heroui/react";
import { authClient, signUp } from "@/lib/auth-client";
import { At, Eye, EyeSlash, Person, ShieldKeyhole } from "@gravity-ui/icons";
import toast from "react-hot-toast";

// Import your better-auth client instance here
// import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();

  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");

  // Status States
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const togglePasswordVisibility = () => setIsVisible(!isVisible);


const handleGoogleSignUp = async () => {
  sessionStorage.setItem("pendingRole", role); // আগে সিলেক্ট করা role সেভ রাখা
  await authClient.signIn.social({ provider: "google", callbackURL: "/" });
};

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    try {
      // Better-Auth signup v3 implementation example:

      const { data, error: authError } = await signUp.email({
        email,
        password,
        name,
        callbackURL: "/",
        role,
      });

      if (authError) {
        setError(authError.message || "Something went wrong.");
        toast.error(authError.message || "Something went wrong.");
        return;
      }

      setSuccess("Account created successfully! Redirecting...");
      toast.success("Welcome aboard! Account created successfully.");

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <Card className="w-full max-w-md bg-gray-900 border border-gray-800 p-4 shadow-xl">
        <CardHeader className="flex flex-col gap-1 items-start pb-0">
          <h2 className="text-2xl font-bold text-white">Create an Account</h2>
          <p className="text-sm text-gray-400">
            Join <span className="text-blue-500 font-semibold">ResellHub</span>{" "}
            to buy and sell safely.
          </p>
        </CardHeader>

        {/* <CardBody className="mt-6"> */}
        {/* HeroUI v3 Form Component */}
        <Form onSubmit={handleSignUp} className="flex flex-col gap-5 w-full">
          {/* Full Name Field */}
          <TextField className="w-full flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-gray-300">
              Full Name
            </Label>
            <Input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-gray-950/50 px-3 py-2 text-white placeholder-gray-500 focus-visible:border-blue-500 outline-none transition"
            />
          </TextField>

          {/* Email Address Field */}
          <TextField
            isRequired
            name="email"
            type="email"
            className="flex flex-col gap-1.5"
          >
            <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email Address
            </Label>
            <InputGroup className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 bg-zinc-50 dark:bg-zinc-900 focus-within:border-primary transition-colors">
              <At className="text-zinc-400 pointer-events-none" size={16} />
              <Input
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent py-2 text-sm outline-none border-none text-zinc-900 dark:text-zinc-100"
              />
            </InputGroup>
          </TextField>

          {/* Password Field */}
          <TextField
            isRequired
            name="password"
            className="flex flex-col gap-1.5"
          >
            <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Password
            </Label>
            <InputGroup className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 bg-zinc-50 dark:bg-zinc-900 focus-within:border-primary transition-colors">
              <ShieldKeyhole
                className="text-zinc-400 pointer-events-none"
                size={16}
              />
              <Input
                type={isVisible ? "text" : "password"}
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent py-2 text-sm outline-none border-none text-zinc-900 dark:text-zinc-100"
              />
              <button
                className="focus:outline-none text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition"
                type="button"
                onClick={togglePasswordVisibility}
                aria-label="toggle password visibility"
              >
                {isVisible ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </InputGroup>
          </TextField>

          {/* Role Selection Field */}
          <div className="flex flex-col gap-4">
            <Label>Subscription plan</Label>
            <RadioGroup
              defaultValue="buyer"
              name="role"
              onChange={(value) => {
                setRole(value);
              }}
              orientation="horizontal"
            >
              <Radio value="buyer">
                <Radio.Control>
                  <Radio.Indicator />
                </Radio.Control>
                <Radio.Content>
                  <Label>Buyer</Label>
                </Radio.Content>
              </Radio>
              <Radio value="seller">
                <Radio.Control>
                  <Radio.Indicator />
                </Radio.Control>
                <Radio.Content>
                  <Label>Seller</Label>
                </Radio.Content>
              </Radio>
            </RadioGroup>
          </div>

          {/* Error Message Box */}
          {error && (
            <div className="rounded-lg bg-danger-500/10 border border-danger-500/20 p-3 text-sm text-danger-400 w-full">
              {error}
            </div>
          )}

          {/* Success Message Box */}
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
           Register
          </Button>

                 <div className="relative flex items-center my-2">
  <div className="grow border-t border-zinc-800" />
  <span className="px-3 text-xs text-zinc-500">OR</span>
  <div className="flex-grow border-t border-zinc-800" />
</div>

<button
  type="button"
  onClick={handleGoogleSignUp}
  className="w-full flex items-center justify-center gap-2 border border-zinc-700 hover:bg-zinc-900 rounded-lg h-10 text-sm font-medium text-white transition"
>
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
  Continue with Google
</button>

        </Form>

        {/* Navigation link to switch between routes */}
        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-400 hover:underline font-medium"
          >
            Sign In
          </Link>
        </div>
        {/* </CardBody> */}
      </Card>
    </div>
  );
}
