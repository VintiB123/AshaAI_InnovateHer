"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronRight,
  Users,
  Calendar,
  MessageSquare,
  Award,
  BookOpen,
  BarChart3,
  Target,
  Shield,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const router = useRouter();
  const { currentLang } = useLanguage();

  return (
    <div className="min-h-screen bg-ivoryWhite-500">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-purple-800 opacity-10 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-7xl max-md:text-5xl max-lg:text-6xl font-bold text-purple-900 leading-tight">
                MentorHer
              </h1>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-purple-700 leading-tight mt-2">
                Empowering Women in Tech Through Mentorship
              </h2>
              <p className="mt-6 text-lg text-gray-700 max-w-2xl">
                Connect with industry-leading mentors who understand your
                journey and can guide your career growth in technology.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => router.push(`/${currentLang}/sign-in`)}
                  className="bg-purple-700 hover:bg-purple-800 text-white px-8 py-3 rounded-md text-lg"
                >
                  Find a Mentor
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/${currentLang}/sign-in`)}
                  className="border-purple-700 text-purple-700 hover:bg-purple-100 px-8 py-3 rounded-md text-lg"
                >
                  Become a Mentor
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-10">
              <div className="relative">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-lavender-300 via-purple-500 to-lavender-700 opacity-75 blur"></div>
                <img
                  src="https://www.brookings.edu/wp-content/uploads/2021/08/CUE_Inida_mentorships.jpg?quality=75&w=1500"
                  alt="Women in technology mentorship"
                  className="relative rounded-lg shadow-xl w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-purple-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-purple-800">
                2,500+
              </p>
              <p className="text-gray-700">Active Mentors</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-purple-800">
                10,000+
              </p>
              <p className="text-gray-700">Mentees Supported</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-purple-800">
                85%
              </p>
              <p className="text-gray-700">Career Advancement</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-purple-800">
                92%
              </p>
              <p className="text-gray-700">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-ivoryWhite-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-900">
              How Mentor Her Empowers You
            </h2>
            <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
              Our DXP-based platform provides personalized mentorship
              experiences tailored to your career goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="bg-lavender-100 p-3 rounded-full mr-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-900 mb-2">
                      AI-Powered Matching
                    </h3>
                    <p className="text-gray-700">
                      Intelligent algorithms pair you with mentors based on
                      skills, goals, and industry experience.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="bg-lavender-300 p-3 rounded-full mr-4">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-900 mb-2">
                      Scheduling Automation
                    </h3>
                    <p className="text-gray-700">
                      Effortlessly schedule sessions with calendar syncing and
                      automated reminders.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="bg-lavender-500 p-3 rounded-full mr-4">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-900 mb-2">
                      Real-time Communication
                    </h3>
                    <p className="text-gray-700">
                      Connect through secure chat and integrated video
                      conferencing tools.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="bg-lavender-700 p-3 rounded-full mr-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-900 mb-2">
                      Career Path Generator
                    </h3>
                    <p className="text-gray-700">
                      AI-powered tools to visualize and plan your personalized
                      career journey.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="bg-purple-500 p-3 rounded-full mr-4">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-900 mb-2">
                      Resource Library
                    </h3>
                    <p className="text-gray-700">
                      Access curated content, workshops, and learning materials
                      for continuous growth.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="bg-purple-700 p-3 rounded-full mr-4">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-900 mb-2">
                      Progress Analytics
                    </h3>
                    <p className="text-gray-700">
                      Track your growth with detailed analytics and skill
                      development metrics.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-ivoryWhite-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-900">
              Your Mentorship Journey
            </h2>
            <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
              Simple steps to start your personalized mentorship experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-800">1</span>
              </div>
              <h3 className="text-xl font-semibold text-purple-900 mb-2">
                Create Your Profile
              </h3>
              <p className="text-gray-700">
                Sign up and build your profile highlighting your skills,
                experience, and career goals.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-800">2</span>
              </div>
              <h3 className="text-xl font-semibold text-purple-900 mb-2">
                Get Matched
              </h3>
              <p className="text-gray-700">
                Our AI algorithm will suggest the most compatible mentors for
                your specific needs.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-300 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-800">3</span>
              </div>
              <h3 className="text-xl font-semibold text-purple-900 mb-2">
                Start Growing
              </h3>
              <p className="text-gray-700">
                Schedule sessions, access resources, and track your progress as
                you advance your career.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-ivoryWhite-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-900">
              Success Stories
            </h2>
            <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
              Hear from women who transformed their careers through our
              mentorship platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sahil Deshmukh",
                role: "Senior Software Engineer",
                company: "TechGiant Inc.",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgpjJDKjazkyIV6GAq0-3skJbLiOqMlleK7w&s",
                quote:
                  "Mentor Her connected me with a senior leader who helped me navigate my career transition. Within 6 months, I secured a promotion and gained confidence in my technical abilities.",
              },
              {
                name: "Priya Patel",
                role: "Product Manager",
                company: "InnovateTech",
                image:
                  "https://media.licdn.com/dms/image/v2/D4D03AQFy9H8DmRUHlA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1631235004678?e=2147483647&v=beta&t=_6uWXrGu2L-Pc-k4Q4hmFiU4qEl-ewQ7m2d11DD5fss",
                quote:
                  "The personalized guidance I received through this platform was invaluable. My mentor helped me develop leadership skills that completely transformed my approach to product management.",
              },
              {
                name: "Maya Rodriguez",
                role: "Cybersecurity Analyst",
                company: "SecureNet",
                image:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMo6sVFyGQq_kxlNK6gksP0rxjn31VT5Q1PA&s",
                quote:
                  "As a woman in cybersecurity, finding role models was challenging. Mentor Her connected me with incredible mentors who helped me navigate this male-dominated field and thrive.",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border-none shadow-lg bg-white">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <p className="text-gray-700 italic mb-4">
                      "{testimonial.quote}"
                    </p>
                    <h3 className="font-semibold text-purple-900">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-xs text-gray-500">
                      {testimonial.company}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-800 to-lavender-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Tech Career?
          </h2>
          <p className="text-xl font-medium text-white/90 max-w-3xl mx-auto mb-8">
            Join thousands of women who are advancing their careers through
            personalized mentorship.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-white text-purple-900 hover:bg-ivoryWhite-500 px-8 py-3 rounded-md text-lg">
              Get Started Today
            </Button>
            <Button
              variant="outline"
              className="text-white bg-purple-700 hover:bg-purple-800 border-purple-400 hover:text-white px-8 py-3 rounded-md text-lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-purple-950 text-ivoryWhite-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Mentor Her</h3>
              <p className="text-ivoryWhite-700 mb-4">
                Empowering women in technology through mentorship, guidance, and
                community.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 rounded-full bg-purple-800 flex items-center justify-center hover:cursor-pointer">
                  <Instagram />
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-800 flex items-center justify-center hover:cursor-pointer">
                  <Linkedin />
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-800 flex items-center justify-center hover:cursor-pointer">
                  <Twitter />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-ivoryWhite-700 hover:text-white">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-ivoryWhite-700 hover:text-white">
                    Find a Mentor
                  </a>
                </li>
                <li>
                  <a href="#" className="text-ivoryWhite-700 hover:text-white">
                    Become a Mentor
                  </a>
                </li>
                <li>
                  <a href="#" className="text-ivoryWhite-700 hover:text-white">
                    Resources
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-ivoryWhite-700 hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-ivoryWhite-700 hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-ivoryWhite-700 hover:text-white">
                    Partners
                  </a>
                </li>
                <li>
                  <a href="#" className="text-ivoryWhite-700 hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-ivoryWhite-700 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-ivoryWhite-700 hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-ivoryWhite-700 hover:text-white">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-purple-800 mt-8 pt-8 text-center">
            <p className="text-ivoryWhite-700">
              &copy; {new Date().getFullYear()} Mentor Her. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
