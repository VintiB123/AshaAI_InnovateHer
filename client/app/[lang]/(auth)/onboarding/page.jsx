"use client";
import { useState } from "react";
import {
  Building2,
  GraduationCap,
  BookOpen,
  UserCircle,
  Target,
  Briefcase,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const OnboardingPage = () => {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Common fields
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",

    // Mentor specific fields
    designation: "",
    expertise: "",
    experience: "",

    // Mentee specific fields
    currentRole: "",
    interests: "",
    goals: "",
    education: "",
    experienceLevel: "Beginner",
  });

  const router = useRouter();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSelectChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleUserTypeChange = (value) => {
    setUserType(value);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Password validation
      if (formData.password !== formData.confirmPassword) {
        toast({ variant: "destructive", title: "Passwords do not match" });
        setIsLoading(false);
        return;
      }

      // Prepare data based on user type
      const userData = {
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
      };

      if (userType === "mentor") {
        Object.assign(userData, {
          designation: formData.designation,
          expertise: formData.expertise,
          experience: formData.experience,
        });
      } else {
        Object.assign(userData, {
          currentRole: formData.currentRole,
          interests: formData.interests,
          goals: formData.goals,
          education: formData.education,
          experienceLevel: formData.experienceLevel,
        });
      }

      console.log(userData);
      // API endpoint based on user type
      const endpoint = `http://localhost:4224/api/${userType}/onboard`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        toast({ title: "Onboarding successful!" });
        router.push(`/en/${userType}/overview`);
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          title: errorData.error || "Onboarding failed",
        });
      }
    } catch (error) {
      toast({ variant: "destructive", title: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    // Basic validation
    if (step === 1 && !userType) {
      toast({ variant: "destructive", title: "Please select a role" });
      return;
    }

    if (step === 2) {
      if (!formData.userName || !formData.email || !formData.phoneNumber) {
        toast({
          variant: "destructive",
          title: "Please fill in all personal details",
        });
        return;
      }
    }

    if (step === 3) {
      if (
        userType === "mentor" &&
        (!formData.designation || !formData.expertise || !formData.experience)
      ) {
        toast({
          variant: "destructive",
          title: "Please complete all professional details",
        });
        return;
      }

      if (
        userType === "mentee" &&
        (!formData.currentRole ||
          !formData.education ||
          !formData.interests ||
          !formData.goals)
      ) {
        toast({
          variant: "destructive",
          title: "Please complete all learning details",
        });
        return;
      }
    }

    if (step === 4) {
      if (!formData.password || !formData.confirmPassword) {
        toast({ variant: "destructive", title: "Please set a password" });
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast({ variant: "destructive", title: "Passwords do not match" });
        return;
      }
    }

    setStep((prev) => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const experienceLevels = [
    { value: "Beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];

  // Progress steps
  const steps = [
    { id: 1, name: "Role" },
    { id: 2, name: "Personal" },
    { id: 3, name: userType === "mentor" ? "Professional" : "Learning" },
    { id: 4, name: "Security" },
    { id: 5, name: "Complete" },
  ];

  // Colors based on user type
  const colors = {
    mentor: {
      primary: "purple-600",
      secondary: "purple-700",
      light: "purple-100",
      bg: "from-purple-600 to-indigo-600",
      hover: "from-purple-700 to-indigo-700",
    },
    mentee: {
      primary: "lavender-600",
      secondary: "lavender-700",
      light: "lavender-100",
      bg: "from-lavender-500 to-purple-500",
      hover: "from-lavender-600 to-purple-600",
    },
  };

  const currentColor = userType
    ? colors[userType]
    : {
        primary: "purple-600",
        secondary: "purple-700",
        light: "purple-100",
        bg: "from-purple-600 to-indigo-600",
        hover: "from-purple-700 to-indigo-700",
      };

  return (
    <div className="min-h-screen flex items-center justify-center bg-lavender-400 p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg border border-purple-200 p-6">
        <div className="flex flex-col items-center">
          <Link href="/" className="mb-6">
            <img src="/images/logo.png" alt="Logo" className="h-16 w-auto" />
          </Link>

          {/* Progress Steps */}
          <nav aria-label="Progress" className="mb-8 w-full">
            <ol role="list" className="flex items-center justify-between">
              {steps.map((stepItem, stepIdx) => (
                <li
                  key={stepItem.name}
                  className="relative flex flex-col items-center"
                >
                  {step > stepItem.id ? (
                    <div
                      className={`h-8 w-8 flex items-center justify-center rounded-full bg-${currentColor.primary} text-white`}
                    >
                      <Check className="h-4 w-4" aria-hidden="true" />
                    </div>
                  ) : step === stepItem.id ? (
                    <div
                      className={`h-8 w-8 flex items-center justify-center rounded-full border-2 border-${currentColor.primary} bg-white`}
                      aria-current="step"
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-full bg-${currentColor.primary}`}
                        aria-hidden="true"
                      />
                    </div>
                  ) : (
                    <div className="h-8 w-8 flex items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                      <span className="text-xs text-gray-500">
                        {stepItem.id}
                      </span>
                    </div>
                  )}
                  <span className="mt-2 text-xs font-medium hidden sm:block">
                    {stepItem.name}
                  </span>

                  {stepIdx !== steps.length - 1 && (
                    <div
                      className={`absolute top-4 left-8 -ml-px h-0.5 w-full hidden sm:block ${
                        stepIdx < step - 1
                          ? `bg-${currentColor.primary}`
                          : "bg-gray-200"
                      }`}
                      style={{ width: "calc(100% + 1rem)" }}
                      aria-hidden="true"
                    />
                  )}
                </li>
              ))}
            </ol>
          </nav>

          {/* Step 1: Choose Role */}
          {step === 1 && (
            <div className="w-full">
              <h1 className="text-2xl font-bold text-center text-purple-900 mb-2">
                Choose Your Role
              </h1>
              <p className="text-sm text-center text-purple-700 mb-6">
                How would you like to participate in our mentorship program?
              </p>

              <div className="space-y-4">
                <RadioGroup
                  value={userType}
                  onValueChange={handleUserTypeChange}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem
                      value="mentee"
                      id="mentee"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="mentee"
                      className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-lavender-100/20 p-4 hover:bg-lavender-100/30 hover:border-lavender-600 peer-checked:border-lavender-600 peer-checked:bg-lavender-100/40 peer-data-[state=checked]:border-lavender-600 cursor-pointer"
                    >
                      <GraduationCap className="mb-3 h-10 w-10 text-lavender-600" />
                      <div className="text-center space-y-1">
                        <p className="text-sm font-medium leading-none text-lavender-600">
                          Join as Mentee
                        </p>
                        <p className="text-xs text-gray-500">
                          Find guidance from experienced professionals
                        </p>
                      </div>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="mentor"
                      id="mentor"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="mentor"
                      className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-purple-100/20 p-4 hover:bg-purple-100/30 hover:border-purple-600 peer-checked:border-purple-600 peer-checked:bg-purple-100/40 peer-data-[state=checked]:border-purple-600 cursor-pointer"
                    >
                      <Briefcase className="mb-3 h-10 w-10 text-purple-600" />
                      <div className="text-center space-y-1">
                        <p className="text-sm font-medium leading-none text-purple-600">
                          Become a Mentor
                        </p>
                        <p className="text-xs text-gray-500">
                          Share your knowledge and experience
                        </p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Step 2: Personal Details */}
          {step === 2 && (
            <div className="w-full">
              <h1 className="text-2xl font-bold text-center text-purple-900 mb-2">
                Personal Details
              </h1>
              <p className="text-sm text-center text-purple-700 mb-6">
                Tell us about yourself
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="userName"
                    className={`text-${currentColor.primary}`}
                  >
                    Full Name
                  </Label>
                  <Input
                    id="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    className="h-12 border-purple-300 focus:border-purple-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className={`text-${currentColor.primary}`}
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="h-12 border-purple-300 focus:border-purple-500"
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phoneNumber"
                    className={`text-${currentColor.primary}`}
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="h-12 border-purple-300 focus:border-purple-500"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Professional/Learning Details */}
          {step === 3 && (
            <div className="w-full">
              <h1 className="text-2xl font-bold text-center text-purple-900 mb-2">
                {userType === "mentor"
                  ? "Professional Details"
                  : "Learning Details"}
              </h1>
              <p className="text-sm text-center text-purple-700 mb-6">
                {userType === "mentor"
                  ? "Tell us about your professional background"
                  : "Tell us about your learning goals"}
              </p>

              <div className="space-y-4">
                {/* Mentor Specific Fields */}
                {userType === "mentor" && (
                  <>
                    <div className="space-y-2">
                      <Label
                        htmlFor="designation"
                        className={`text-${currentColor.primary}`}
                      >
                        Current Designation
                      </Label>
                      <Input
                        id="designation"
                        value={formData.designation}
                        onChange={handleInputChange}
                        className="h-12 border-purple-300 focus:border-purple-500"
                        placeholder="E.g., Senior Software Engineer"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="expertise"
                        className={`text-${currentColor.primary}`}
                      >
                        Areas of Expertise
                      </Label>
                      <Textarea
                        id="expertise"
                        value={formData.expertise}
                        onChange={handleInputChange}
                        className="min-h-24 border-purple-300 focus:border-purple-500"
                        placeholder="Enter your areas of expertise (comma separated)"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="experience"
                        className={`text-${currentColor.primary}`}
                      >
                        Years of Experience
                      </Label>
                      <Input
                        id="experience"
                        type="number"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="h-12 border-purple-300 focus:border-purple-500"
                        placeholder="Enter years of experience"
                      />
                    </div>
                  </>
                )}

                {/* Mentee Specific Fields */}
                {userType === "mentee" && (
                  <>
                    <div className="space-y-2">
                      <Label
                        htmlFor="currentRole"
                        className={`text-${currentColor.primary}`}
                      >
                        Current Role
                      </Label>
                      <Input
                        id="currentRole"
                        value={formData.currentRole}
                        onChange={handleInputChange}
                        className="h-12 border-purple-300 focus:border-purple-500"
                        placeholder="E.g., Student, Junior Developer"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="education"
                        className={`text-${currentColor.primary}`}
                      >
                        Education
                      </Label>
                      <Input
                        id="education"
                        value={formData.education}
                        onChange={handleInputChange}
                        className="h-12 border-purple-300 focus:border-purple-500"
                        placeholder="E.g., Bachelor's in Computer Science"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="experienceLevel"
                        className={`text-${currentColor.primary}`}
                      >
                        Experience Level
                      </Label>
                      <Select
                        id="experienceLevel"
                        value={formData.experienceLevel}
                        onValueChange={(value) =>
                          handleSelectChange("experienceLevel", value)
                        }
                      >
                        <SelectTrigger className="h-12 border-purple-300 focus:border-purple-500">
                          <SelectValue placeholder="Select your experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          {experienceLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="interests"
                        className={`text-${currentColor.primary}`}
                      >
                        Areas of Interest
                      </Label>
                      <Textarea
                        id="interests"
                        value={formData.interests}
                        onChange={handleInputChange}
                        className="min-h-24 border-purple-300 focus:border-purple-500"
                        placeholder="What areas are you interested in learning? (comma separated)"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="goals"
                        className={`text-${currentColor.primary}`}
                      >
                        Learning Goals
                      </Label>
                      <Textarea
                        id="goals"
                        value={formData.goals}
                        onChange={handleInputChange}
                        className="min-h-24 border-purple-300 focus:border-purple-500"
                        placeholder="What do you hope to achieve through mentorship?"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Security */}
          {step === 4 && (
            <div className="w-full">
              <h1 className="text-2xl font-bold text-center text-purple-900 mb-2">
                Set Your Password
              </h1>
              <p className="text-sm text-center text-purple-700 mb-6">
                Create a secure password for your account
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className={`text-${currentColor.primary}`}
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="h-12 border-purple-300 focus:border-purple-500"
                    placeholder="Create a password"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className={`text-${currentColor.primary}`}
                  >
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="h-12 border-purple-300 focus:border-purple-500"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Complete */}
          {step === 5 && (
            <div className="flex flex-col items-center justify-center text-center py-4 w-full">
              <div
                className={`h-20 w-20 rounded-full bg-${currentColor.light} flex items-center justify-center mb-6`}
              >
                <Check className={`h-10 w-10 text-${currentColor.primary}`} />
              </div>
              <h1 className="text-2xl font-bold text-purple-900 mb-2">
                Almost There!
              </h1>
              <p className="text-sm text-purple-700 mb-6">
                Review your information below and click "Complete Registration"
                when you're ready.
              </p>

              <div className="w-full text-left space-y-3 border rounded-lg p-4 bg-gray-50">
                <div>
                  <p className="text-xs text-gray-500">Role</p>
                  <p className="font-medium">
                    {userType === "mentor" ? "Mentor" : "Mentee"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-medium">{formData.userName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">{formData.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium">{formData.phoneNumber}</p>
                </div>

                {userType === "mentor" ? (
                  <>
                    <div>
                      <p className="text-xs text-gray-500">Designation</p>
                      <p className="font-medium">{formData.designation}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">
                        Years of Experience
                      </p>
                      <p className="font-medium">{formData.experience}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-xs text-gray-500">Current Role</p>
                      <p className="font-medium">{formData.currentRole}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Experience Level</p>
                      <p className="font-medium">{formData.experienceLevel}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-6 space-y-4 w-full">
            <div className="flex justify-between">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={prevStep}
                  className="h-12 border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Button>
              )}
              {step < 5 ? (
                <Button
                  className={`${
                    step === 1 ? "w-full" : "ml-auto"
                  } h-12 bg-gradient-to-r ${currentColor.bg} hover:${
                    currentColor.hover
                  } text-white font-semibold rounded-lg shadow-md transition-all duration-300`}
                  onClick={nextStep}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  className={`ml-auto h-12 bg-gradient-to-r ${currentColor.bg} hover:${currentColor.hover} text-white font-semibold rounded-lg shadow-md transition-all duration-300`}
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Complete Registration
                      <Check className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Sign In Link */}
          <div className="mt-6 text-center text-purple-700 w-full">
            Already have an account?{" "}
            <Link
              href="/en/sign-in"
              className={`text-${currentColor.primary} hover:text-${currentColor.secondary} font-medium`}
            >
              Sign In
            </Link>
          </div>

          <div className="text-center text-xs text-purple-400 mt-6">
            © {new Date().getFullYear()} All Rights Reserved
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
