"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Search,
  Edit,
  TrendingUp,
  Users,
  Briefcase,
  Award,
  Clock,
  Bell,
  CheckCircle,
} from "lucide-react";

// Profile Card Component
const ProfileCard = ({ user }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-500 to-purple-600 opacity-80"></div>
      <div className="relative z-10">
        <div className="relative inline-block mb-4 group">
          <div className="w-32 h-32 mx-auto relative">
            <div className="rounded-full w-full h-full flex items-center justify-center border-4 border-white shadow-lg bg-gradient-to-r from-purple-600 to-purple-400">
              <h1 className="text-4xl font-bold text-white">
                {" "}
                {user.charAt(0).toUpperCase()}
              </h1>
            </div>
            <button className="absolute bottom-0 right-0 bg-white text-blue-500 rounded-full p-2 shadow-lg hover:bg-blue-50 transition-colors duration-300">
              <Edit size={16} />
            </button>
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800"> {user}</h2>
          <p className="text-gray-500 text-sm flex items-center justify-center">
            <Briefcase size={14} className="mr-2 text-gray-400" />
            UI/UX Designer
          </p>
        </div>
        <div className="flex justify-around bg-gray-50 rounded-xl p-4">
          <div className="text-center">
            <p className="font-bold text-blue-600 text-lg flex items-center justify-center">
              <Users size={16} className="mr-2" />
              11
            </p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Contacts
            </p>
          </div>
          <div className="text-center">
            <p className="font-bold text-orange-500 text-lg flex items-center justify-center">
              <Bell size={16} className="mr-2" />
              56
            </p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Messages
            </p>
          </div>
          <div className="text-center">
            <p className="font-bold text-green-600 text-lg flex items-center justify-center">
              <Award size={16} className="mr-2" />
              12
            </p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Projects
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Quick Actions Component
const QuickActions = () => {
  const actions = [
    {
      icon: <Clock size={24} className="text-blue-500" />,
      title: "Schedule Meeting",
      bg: "bg-blue-50",
      textColor: "text-blue-500",
      iconBg: "bg-blue-100",
    },
    {
      icon: <TrendingUp size={24} className="text-green-500" />,
      title: "Performance",
      bg: "bg-green-50",
      textColor: "text-green-500",
      iconBg: "bg-green-100",
    },
    {
      icon: <CheckCircle size={24} className="text-rose-500" />,
      title: "Goals",
      bg: "bg-rose-50",
      textColor: "text-rose-500",
      iconBg: "bg-rose-100",
    },
  ];

  return (
    <div className="space-y-4">
      {actions.map((action, index) => (
        <button
          key={index}
          className={`
            flex items-center 
            w-full
            p-4 
            rounded-xl 
            ${action.bg}
            hover:bg-opacity-80
            transition-all
            space-x-3
          `}
        >
          <div
            className={`
            p-2 
            rounded-xl 
            ${action.iconBg}
            flex items-center 
            justify-center
          `}
          >
            {action.icon}
          </div>
          <span
            className={`
            text-sm 
            font-medium 
            ${action.textColor}
          `}
          >
            {action.title}
          </span>
        </button>
      ))}
    </div>
  );
};

// Recent Activity Component
const RecentActivity = () => {
  const activities = [
    {
      time: "9:30 AM",
      title: "Design Sprint Planning",
      status: "Upcoming",
      icon: <Clock size={16} className="text-blue-500" />,
    },
    {
      time: "2:00 PM",
      title: "Client Presentation",
      status: "In Progress",
      icon: <TrendingUp size={16} className="text-green-500" />,
    },
    {
      time: "4:45 PM",
      title: "Team Retrospective",
      status: "Pending",
      icon: <Users size={16} className="text-purple-500" />,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Recent Activity</h3>
        <button className="text-xs text-blue-500 hover:underline">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-gray-50 p-3 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div>{activity.icon}</div>
              <div>
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full 
              ${
                activity.status === "Upcoming"
                  ? "bg-blue-50 text-blue-500"
                  : activity.status === "In Progress"
                  ? "bg-green-50 text-green-500"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {activity.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Skill Progress Bar Component
const SkillProgressBar = ({ skill, progress, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-sm">{skill}</span>
      <span className={`text-${color}-500 text-sm`}>{progress}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`bg-${color}-500 h-2 rounded-full`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

// Main Dashboard Component
export default function MenteeDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("Last Month");
  const [user, setUser] = useState("User");
  useEffect(() => {
    setUser(localStorage?.getItem("userName") || "User");
  }, []);

  // Sample Data
  const focusingData = [
    { month: "Aug", maxFocus: 50, minFocus: 20 },
    { month: "Sep", maxFocus: 80, minFocus: 30 },
    { month: "Oct", maxFocus: 60, minFocus: 25 },
    { month: "Nov", maxFocus: 40, minFocus: 15 },
    { month: "Dec", maxFocus: 70, minFocus: 35 },
  ];

  const skillsData = [
    { skill: "Communication Skills", progress: 71, color: "orange" },
    { skill: "JAVA", progress: 92, color: "blue" },
    { skill: "DSA", progress: 33, color: "orange" },
    { skill: "AI/ML", progress: 56, color: "blue" },
    { skill: "Web Development", progress: 79, color: "blue" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center text-gray-800">
              Welcome, {user}
            </h1>
            <p className="text-gray-500 text-sm">
              Here's your professional dashboard
            </p>
          </div>
          <div className="relative">
            <input
              type="search"
              placeholder="Search dashboard"
              className="px-4 py-2 border rounded-lg w-64 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <Search
              size={20}
              className="absolute right-3 top-3 text-gray-400"
            />
          </div>
        </div>

        {/* Top Section */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          {/* Profile Card */}
          <ProfileCard user={user} />

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <QuickActions />
          </div>

          {/* Recent Activity */}
          <RecentActivity />

          {/* Task Progress */}
          <div className="grid grid-rows-2 gap-4">
            <div className="flex bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl p-4 shadow-lg flex-col justify-between">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Prioritized Tasks</h3>
                <div className="bg-white/50 p-1 rounded-full">⏰</div>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold">83%</p>
                <p className="text-sm text-gray-600">Avg. Completed</p>
              </div>
            </div>
            <div className="flex flex-col bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-4 shadow-lg justify-between">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Additional Tasks</h3>
                <div className="bg-white/50 p-1 rounded-full">🎯</div>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold">56%</p>
                <p className="text-sm text-gray-600">Avg. Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-3 gap-6">
          {/* Focusing Section */}
          <div className="col-span-2 bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-semibold text-lg">Productivity Insights</h3>
                <p className="text-xs text-gray-500">
                  Focusing and Performance Analytics
                </p>
              </div>
              <select
                className="text-sm border rounded px-2 py-1"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option>Last Month</option>
                <option>Last Quarter</option>
                <option>Last Year</option>
              </select>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={focusingData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="maxFocus"
                  stroke="#ff6384"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="minFocus"
                  stroke="#36a2eb"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="text-center mt-4">
              <p className="text-2xl font-bold">41%</p>
              <p className="text-sm text-gray-600">Avg. Completion Rate</p>
              <div className="flex justify-center space-x-4 mt-2">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-pink-500 rounded-full mr-2"></span>
                  <span className="text-xs">Maximum Focus</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  <span className="text-xs">Minimum Focus</span>
                </div>
              </div>
            </div>
          </div>

          {/* Developed Areas */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-semibold mb-4">Skill Development</h3>
            <p className="text-xs text-gray-500 mb-4">
              Areas of Professional Growth
            </p>
            <div className="space-y-4">
              {skillsData.map((area, index) => (
                <SkillProgressBar
                  key={index}
                  skill={area.skill}
                  progress={area.progress}
                  color={area.color}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
