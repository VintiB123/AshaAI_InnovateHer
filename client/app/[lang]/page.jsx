"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/public/images";
import {
  ArrowRight,
  Check,
  Shield,
  Lock,
  Bot,
  Briefcase,
  Calendar,
  Users,
  BookOpen,
  Globe,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("jobs");

  const features = {
    jobs: {
      icon: <Briefcase className="h-6 w-6" />,
      title: "Job Discovery",
      description:
        "Access curated job listings specifically for women returning to workforce",
      points: [
        "Personalized job matching",
        "Return-to-work programs",
        "Flexible work opportunities",
        "Skill-based recommendations",
      ],
    },
    events: {
      icon: <Calendar className="h-6 w-6" />,
      title: "Community Events",
      description: "Find networking sessions and skill-building workshops",
      points: [
        "Career reboot webinars",
        "Industry-specific meetups",
        "Leadership workshops",
        "Mentorship sessions",
      ],
    },
    resources: {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Empowerment Resources",
      description: "Global insights on women's career advancement",
      points: [
        "Latest research & trends",
        "Success stories",
        "Policy updates",
        "Career development tools",
      ],
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-100 to-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-primary-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {/* Replace this with your logo */}
            <div className="w-14 h-14 relative">
              <Image src={Logo} alt="Asha AI Logo" className="object-contain" />
            </div>
            <span className="text-xl font-bold text-primary-950">Asha AI</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="#features"
              className="text-gray-700 hover:text-primary-800"
            >
              Features
            </a>
            <a href="#ethics" className="text-gray-700 hover:text-primary-800">
              Our Ethics
            </a>
            <a
              href="#how-it-works"
              className="text-gray-700 hover:text-primary-800"
            >
              How It Works
            </a>
            <Link href="/en/sign-in">
              <Button className="bg-primary-800 hover:bg-primary-900 text-white">
                Try Asha Now
              </Button>
            </Link>
          </div>
          <button className="md:hidden text-primary-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="bg-primary-100 text-primary-900 px-4 py-2 rounded-full inline-flex items-center text-sm mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              Powered by JobsForHer Foundation
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Your AI Companion for{" "}
              <span className="text-primary-800">Women's Career Growth</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Asha AI provides personalized career guidance, job opportunities,
              and community support while maintaining the highest ethical
              standards for women professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/en/sign-up">
                <Button className="bg-primary-800 hover:bg-primary-900 text-white h-12 px-8 text-lg">
                  Start Chatting <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Button
                variant="outline"
                className="h-12 px-8 text-lg border-primary-400 text-primary-800"
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white p-4 rounded-2xl shadow-lg border border-primary-300">
              <div className="bg-primary-100 rounded-lg overflow-hidden">
                {/* Mock chat interface */}
                <div className="p-4 space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary-200 p-1 h-8 w-8 rounded-full">
                      <Image
                        src={Logo}
                        alt="Asha AI Logo"
                        className="object-contain"
                      />
                    </div>
                    <div className="bg-white border border-primary-300 rounded-lg px-4 py-3 text-sm">
                      Hello! I'm Asha, your ethical career assistant. How can I
                      help you today?
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 justify-end">
                    <div className="bg-primary-700 text-white rounded-lg px-4 py-3 text-sm">
                      What tech jobs are available for women returning to work?
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary-200 p-1 h-8 w-8 rounded-full">
                      <Image
                        src={Logo}
                        alt="Asha AI Logo"
                        className="object-contain"
                      />
                    </div>
                    <div className="bg-white border border-primary-300 rounded-lg px-4 py-3 text-sm">
                      I found 23 return-to-work programs in tech. Here are the
                      top 3 matches based on your skills...
                    </div>
                  </div>
                </div>
                <div className="border-t border-primary-200 p-3 bg-white">
                  <div className="flex items-center">
                    <Input
                      placeholder="Ask about jobs, events, or resources..."
                      className="flex-1 border-0 bg-primary-100 focus-visible:ring-0"
                    />
                    <Button
                      size="sm"
                      className="ml-2 bg-primary-700 hover:bg-primary-800"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -z-10 top-6 -right-6 w-full h-full rounded-2xl bg-primary-200"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Asha AI Supports Your Career Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Context-aware assistance designed specifically for women
              professionals
            </p>
          </div>

          {/* Feature Tabs */}
          <div className="mb-8 flex justify-center overflow-x-auto">
            <div className="inline-flex bg-primary-100 rounded-full p-1">
              {Object.keys(features).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 sm:px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? "bg-primary-700 text-white"
                      : "text-primary-800 hover:bg-primary-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {features[tab].icon}
                    {features[tab].title}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Feature Content */}
          <div className="bg-primary-100 rounded-xl p-6 sm:p-8 border border-primary-300">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-primary-950 mb-3">
                  {features[activeTab].title}
                </h3>
                <p className="text-lg text-gray-700 mb-6">
                  {features[activeTab].description}
                </p>
                <ul className="space-y-3">
                  {features[activeTab].points.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-primary-700 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg border border-primary-300 shadow-sm">
                <div className="aspect-video bg-primary-100 rounded-lg flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="mx-auto bg-primary-700 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      {features[activeTab].icon}
                    </div>
                    <h4 className="font-bold text-lg text-primary-900 mb-2">
                      {features[activeTab].title} Example
                    </h4>
                    <p className="text-gray-600 text-sm">
                      "Asha, show me{" "}
                      {activeTab === "jobs"
                        ? "remote product management roles for women with 5+ years experience"
                        : activeTab === "events"
                        ? "upcoming leadership workshops in Bangalore"
                        : "latest research on women in STEM fields"}
                      "
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ethics Section */}
      <section id="ethics" className="py-16 px-6 bg-primary-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Ethical AI for Women's Empowerment
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Our commitment to responsible, bias-free assistance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Bias Prevention",
                description:
                  "Advanced NLP detects and redirects gender-biased queries with positive reframing",
                example:
                  "User: 'Are women good leaders?' → Asha: 'Women excel in leadership! Would you like success stories?'",
              },
              {
                icon: <Lock className="h-8 w-8" />,
                title: "Privacy First",
                description:
                  "No personal data storage - we maintain only anonymous session context",
                example:
                  "Temporary session IDs ensure your privacy while enabling conversation continuity",
              },
              {
                icon: <Globe className="h-8 w-8" />,
                title: "Inclusive Knowledge",
                description:
                  "Curated global resources on women's empowerment and career advancement",
                example:
                  "Real-time updates from verified women's organizations worldwide",
              },
            ].map((item, index) => (
              <div key={index} className="bg-primary-900 p-6 rounded-xl">
                <div className="bg-white bg-opacity-20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-primary-100 mb-4">{item.description}</p>
                <div className="bg-primary-950 p-3 rounded-lg">
                  <p className="text-sm font-mono">{item.example}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Context-Aware Architecture
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              How Asha delivers relevant, ethical assistance
            </p>
          </div>

          <div className="relative">
            {/* System Architecture Visualization - Scrollable on mobile */}
            <div className="overflow-x-auto pb-4">
              <div className="grid grid-cols-5 gap-6 mb-8 min-w-max md:min-w-0">
                {[
                  {
                    name: "User Query",
                    icon: <MessageSquare className="h-5 w-5" />,
                  },
                  { name: "NLP Processing", icon: <Bot className="h-5 w-5" /> },
                  {
                    name: "Context Analysis",
                    icon: <BookOpen className="h-5 w-5" />,
                  },
                  {
                    name: "Knowledge Retrieval",
                    icon: <Briefcase className="h-5 w-5" />,
                  },
                  {
                    name: "Ethical Response",
                    icon: <Check className="h-5 w-5" />,
                  },
                ].map((step, index) => (
                  <div key={index} className="flex flex-col items-center w-32">
                    <div
                      className={`p-4 rounded-full mb-2 ${
                        index % 2 === 0
                          ? "bg-primary-200 text-primary-800"
                          : "bg-primary-700 text-white"
                      }`}
                    >
                      {step.icon}
                    </div>
                    <p className="text-sm font-medium text-center">
                      {step.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary-100 rounded-xl p-6 sm:p-8 border border-primary-300">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-primary-900 mb-4">
                    Data Integration
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="bg-primary-200 p-1 rounded-full mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-primary-800" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Real-time job listings
                        </p>
                        <p className="text-gray-600 text-sm">
                          Integrated with JobsForHer database
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary-200 p-1 rounded-full mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-primary-800" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Community events
                        </p>
                        <p className="text-gray-600 text-sm">
                          Updated workshop and networking opportunities
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary-200 p-1 rounded-full mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-primary-800" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Global resources
                        </p>
                        <p className="text-gray-600 text-sm">
                          Women empowerment insights worldwide
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary-900 mb-4">
                    Ethical Safeguards
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="bg-primary-200 p-1 rounded-full mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-primary-800" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Bias detection
                        </p>
                        <p className="text-gray-600 text-sm">
                          Flags and redirects gender-biased queries
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary-200 p-1 rounded-full mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-primary-800" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Privacy protection
                        </p>
                        <p className="text-gray-600 text-sm">
                          No personal data collection
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-primary-200 p-1 rounded-full mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-primary-800" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Continuous monitoring
                        </p>
                        <p className="text-gray-600 text-sm">
                          Regular audits for fairness and accuracy
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-primary-700 to-primary-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Empower Your Career Journey with Asha
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of women discovering opportunities through ethical AI
            assistance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/en/sign-up">
              <Button className="bg-white text-primary-800 hover:bg-gray-100 h-12 px-8 text-lg">
                Start Chatting Now
              </Button>
            </Link>

            <Link href="https://www.herkey.com/">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-primary-800 h-12 px-8 text-lg"
              >
                Learn About JobsForHer
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 relative">
                <Image
                  src={Logo}
                  alt="Asha AI Logo"
                  className="object-contain"
                />
              </div>
              <span className="text-white font-bold">Asha AI</span>
            </div>
            <p className="text-sm">
              An ethical AI initiative by JobsForHer Foundation
            </p>
          </div>
          <div>
            <h3 className="text-white font-medium mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white">
                  Job Listings
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Career Events
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Mentorship Programs
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-medium mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white">
                  Our Mission
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Ethical AI
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  JobsForHer Foundation
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-medium mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Partnerships
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Feedback
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-gray-800 mt-12 pt-8 text-sm text-center">
          © {new Date().getFullYear()} Made with love by team InnovateHer ❤. All
          rights reserved.
        </div>
      </footer>
    </div>
  );
}
