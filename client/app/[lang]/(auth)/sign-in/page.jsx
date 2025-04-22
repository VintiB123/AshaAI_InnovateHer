"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  ChevronRight,
  CheckCircle,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setCurrentStep(0);
  };

  const API_URL = "http://localhost:4224/api";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const credentials = {
        email: formData.email,
        password: formData.password,
      };

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Login successful", result.user);

        // Handle success - store user data, redirect, etc.
        localStorage.setItem("name", result.user.name);
        localStorage.setItem("email", result.user.email);
        localStorage.setItem("userId", result.user.id);

        router.push("/en/chat");
      } else {
        console.error("Login failed:", result.message);
        // Handle error - show message to user
      }
    } catch (error) {
      console.error("Login API call failed:", error);
    }
  };

  const handleContinue = async () => {
    if (currentStep < 2) {
      // Move to next step in registration flow
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - submit registration data
      try {
        const userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        };

        const response = await fetch(`${API_URL}/user/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        const result = await response.json();

        if (response.ok) {
          console.log("Registration successful");
          // Handle success - show confirmation, redirect to login, etc.
        } else {
          console.error("Registration failed:", result.message);
          // Handle error - show message to user
        }
      } catch (error) {
        console.error("Registration API call failed:", error);
      }
    }
  };

  const renderLoginForm = () => (
    <div className="space-y-4 w-full">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700" htmlFor="email">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-primary-800" />
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className="pl-10 w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-600 focus:border-transparent"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-primary-800" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleInputChange}
            className="pl-10 w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-600 focus:border-transparent"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <button
        onClick={handleLogin}
        className="w-full py-3 px-4 bg-primary-800 hover:bg-primary-900 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
      >
        Sign In
      </button>
    </div>
  );

  const renderOnboardingStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4 w-full">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="name"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-primary-800" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-primary-800" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="w-full py-3 px-4 bg-primary-800 hover:bg-primary-900 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
            >
              Continue <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4 w-full">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="password"
              >
                Create Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-primary-800" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-primary-800" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-2">
              {formData.password && (
                <div className="text-sm space-y-1">
                  <div className="flex items-center">
                    <CheckCircle
                      className={`h-4 w-4 mr-2 ${
                        formData.password.length >= 8
                          ? "text-green-500"
                          : "text-gray-300"
                      }`}
                    />
                    <span
                      className={
                        formData.password.length >= 8
                          ? "text-green-700"
                          : "text-gray-500"
                      }
                    >
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle
                      className={`h-4 w-4 mr-2 ${
                        /[A-Z]/.test(formData.password)
                          ? "text-green-500"
                          : "text-gray-300"
                      }`}
                    />
                    <span
                      className={
                        /[A-Z]/.test(formData.password)
                          ? "text-green-700"
                          : "text-gray-500"
                      }
                    >
                      At least one uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle
                      className={`h-4 w-4 mr-2 ${
                        /[0-9]/.test(formData.password)
                          ? "text-green-500"
                          : "text-gray-300"
                      }`}
                    />
                    <span
                      className={
                        /[0-9]/.test(formData.password)
                          ? "text-green-700"
                          : "text-gray-500"
                      }
                    >
                      At least one number
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleContinue}
              disabled={
                !formData.password ||
                formData.password !== formData.confirmPassword ||
                formData.password.length < 8 ||
                !/[A-Z]/.test(formData.password) ||
                !/[0-9]/.test(formData.password)
              }
              className={`w-full py-3 px-4 ${
                !formData.password ||
                formData.password !== formData.confirmPassword ||
                formData.password.length < 8 ||
                !/[A-Z]/.test(formData.password) ||
                !/[0-9]/.test(formData.password)
                  ? "bg-primary-300 cursor-not-allowed"
                  : "bg-primary-800 hover:bg-primary-900"
              } text-white font-medium rounded-lg transition duration-200 flex items-center justify-center`}
            >
              Continue <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 w-full">
            <Alert className="bg-primary-100 border-primary-300">
              <CheckCircle className="h-5 w-5 text-primary-800" />
              <AlertTitle className="text-primary-900 font-medium">
                Almost there!
              </AlertTitle>
              <AlertDescription className="text-primary-800">
                We've sent a verification email to {formData.email}. Please
                check your inbox to complete your registration.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">
                Account Summary
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Name</span>
                  <span className="font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium">{formData.email}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="w-full py-3 px-4 bg-primary-800 hover:bg-primary-900 text-white font-medium rounded-lg transition duration-200"
            >
              Complete Registration
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 to-white flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="h-12 w-12 rounded-full bg-primary-200 flex items-center justify-center mx-auto mb-4">
            <Lock className="h-6 w-6 text-primary-800" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isLogin
              ? "Welcome Back"
              : currentStep === 2
              ? "Almost Done!"
              : "Create Your Account"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isLogin
              ? "Sign in to access your account"
              : currentStep === 0
              ? "Let's get started with your information"
              : currentStep === 1
              ? "Create a secure password for your account"
              : "Verify your email to complete setup"}
          </p>
        </div>

        {/* Progress Indicator (only for registration) */}
        {!isLogin && (
          <div className="flex justify-between mb-8">
            {[0, 1, 2].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= step
                      ? "bg-primary-800 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {currentStep > step ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span>{step + 1}</span>
                  )}
                </div>
                <span className="text-xs mt-1 text-gray-500">
                  {step === 0 ? "Info" : step === 1 ? "Security" : "Verify"}
                </span>
              </div>
            ))}
          </div>
        )}

        {isLogin ? renderLoginForm() : renderOnboardingStep()}

        <div className="mt-6 text-center">
          <button
            onClick={toggleAuthMode}
            className="text-primary-800 hover:text-primary-950 font-medium"
          >
            {isLogin
              ? "Need an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
