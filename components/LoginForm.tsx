import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface LoginFormProps {
  onModeChange?: (isRegisterMode: boolean) => void;
}

export function LoginForm({ onModeChange }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (isRegisterMode) {
      // Register new user
      if (!name.trim()) {
        setError("Name is required");
        setIsLoading(false);
        return;
      }

      setTimeout(() => {
        try {
          register({ email, password, name, role: "operator" });
          setSuccess(
            "Registration successful! Please login with your credentials.",
          );
          setIsRegisterMode(false);
          setEmail("");
          setPassword("");
          setName("");
        } catch (err) {
          setError(
            "Registration failed. Email might already exist.",
          );
        }
        setIsLoading(false);
      }, 1000);
    } else {
      // Login logic
      const users = [
        {
          email: "owner@rentalbiz.com",
          password: "demo123",
          role: "owner",
          name: "John Owner",
        },
        {
          email: "operator@demo.com",
          password: "demo123",
          role: "operator",
          name: "Jane Operator",
        },
      ];

      const user = users.find(
        (u) => u.email === email && u.password === password,
      );

      setTimeout(() => {
        if (user) {
          login(user);
        } else {
          setError(
            "Invalid email or password. Please use demo credentials.",
          );
        }
        setIsLoading(false);
      }, 1000);
    }
  };

  const fillDemoCredentials = (type: "owner" | "operator") => {
    if (type === "owner") {
      setEmail("owner@rentalbiz.com");
      setPassword("demo123");
    } else {
      setEmail("operator@demo.com");
      setPassword("demo123");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {isRegisterMode && (
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isRegisterMode}
                className="pl-10"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            {isRegisterMode
              ? "Creating account..."
              : "Signing in..."}
          </>
        ) : (
          <>
            {isRegisterMode ? (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Create Account
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </>
            )}
          </>
        )}
      </Button>

      {/* Toggle between Login/Register */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            const newMode = !isRegisterMode;
            setIsRegisterMode(newMode);
            setError("");
            setSuccess("");
            onModeChange?.(newMode);
          }}
          className="text-sm text-primary hover:text-primary/80 transition-colors"
        >
          {isRegisterMode
            ? "Already have an account? Sign in"
            : "Don't have an account? Create one"}
        </button>
      </div>

      {/* Quick Login Buttons - Only show in login mode */}
      {!isRegisterMode && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground text-center">
            Quick Login:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fillDemoCredentials("owner")}
              className="text-xs"
            >
              Owner Demo
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fillDemoCredentials("operator")}
              className="text-xs"
            >
              Operator Demo
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}