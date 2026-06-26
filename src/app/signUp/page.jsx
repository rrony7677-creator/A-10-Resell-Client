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
import { signUp } from "@/lib/auth-client";
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
