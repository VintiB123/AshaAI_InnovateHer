"use client";

import { useState } from "react";
import { Loader2, UserCheck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NODE_SERVER_URL } from "@/constants/utils";
import { toast } from "sonner";

const SignInPage = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      toast("Email and password are required");
      return;
    }

    setIsLoading(true);
    console.log(`${NODE_SERVER_URL}/auth/login`);
    try {
      const response = await fetch(`${NODE_SERVER_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: selectedRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("userEmail", data.data.email);
      localStorage.setItem("userName", data.data.userName);
      localStorage.setItem("userRole", selectedRole);

      toast("Login successful");
      router.push(`/en/${selectedRole.toLowerCase()}/overview`);
    } catch (error) {
      toast(error.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    {
      value: "MENTOR",
      label: "Mentor",
      icon: <UserCheck className="w-7 h-7 text-purple-600" />,
      description: "Experienced professionals guiding others",
    },
    {
      value: "MENTEE",
      label: "Mentee",
      icon: <UserPlus className="w-7 h-7 text-lavender-600" />,
      description: "Individuals seeking guidance and growth",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-lavender-400 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-purple-200 p-6">
        <div className="flex flex-col items-center">
          <Link href="/" className="mb-6">
            <img src="/images/logo.png" alt="Logo" className="h-16 w-auto" />
          </Link>

          {currentStep === 1 && (
            <div className="w-full">
              <h1 className="text-2xl font-bold text-center text-purple-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-sm text-center text-purple-700 mb-6">
                Please select your role to continue
              </p>

              <div className="space-y-4">
                {roles.map((role) => (
                  <Button
                    key={role.value}
                    onClick={() => setSelectedRole(role.value)}
                    className={`w-full ${
                      selectedRole === role.value ? "bg-purple-100" : "bg-white"
                    } flex items-center justify-start px-4 py-8 border-2 rounded-lg hover:border-purple-600 hover:bg-purple-100 transition-all duration-300 group`}
                  >
                    <div className="mr-4 rounded-md border-2 border-purple-200 p-2">
                      {role.icon}
                    </div>
                    <div className="text-left flex-grow">
                      <h2 className="font-semibold text-lg text-purple-900 group-hover:text-purple-700">
                        {role.label}
                      </h2>
                      <p className="text-sm text-purple-600">
                        {role.description}
                      </p>
                    </div>
                    <div
                      className={`h-5 w-5 rounded-full ${
                        selectedRole === role.value
                          ? "border-none"
                          : "border-2 border-purple-300"
                      }`}
                    >
                      {selectedRole === role.value && (
                        <Check className="h-5 w-5 rounded-full p-px bg-purple-600 text-white" />
                      )}
                    </div>
                  </Button>
                ))}
              </div>

              <Button
                className="mt-6 w-full h-12 bg-purple-500 hover:bg-purple-600 text-white font-semibold"
                disabled={!selectedRole}
                onClick={() => setCurrentStep(2)}
              >
                Continue
              </Button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="w-full">
              <h1 className="text-2xl font-bold text-center text-purple-900 mb-2">
                Welcome{" "}
                {roles.find((role) => role.value === selectedRole).label}
              </h1>
              <p className="text-sm text-center text-purple-700 mb-6">
                Enter your credentials to continue
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-purple-800">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="h-12 border-purple-300 focus:border-purple-500"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-purple-800">
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="h-12 border-purple-300 focus:border-purple-500"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-purple-800">
                      Password
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-lavender-600 hover:text-lavender-700"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="h-12 border-purple-300 focus:border-purple-500"
                    placeholder="Enter your password"
                  />
                </div>

                <div className="flex flex-col space-y-4 mt-6">
                  <Button
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full h-12 border-purple-300 text-purple-700 hover:bg-purple-50"
                    onClick={() => setCurrentStep(1)}
                  >
                    Go Back
                  </Button>
                </div>

                <div className="mt-6 text-center text-purple-700">
                  Don't have an account?{" "}
                  <Link
                    href="/en/onboarding"
                    className="text-lavender-600 hover:text-lavender-700 font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          )}
          <div className="text-center text-xs text-purple-400 pb-4">
            © {new Date().getFullYear()} All Rights Reserved
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
