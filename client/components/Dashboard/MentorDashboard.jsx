import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ChevronDown,
  ChevronRight,
  Trophy,
  Calendar,
  Book,
  Lightbulb,
  LineChart,
  Users,
} from "lucide-react";

const MentorDashboard = () => {
  const [isClient, setIsClient] = useState(false);
  const [expandedRoadmapItem, setExpandedRoadmapItem] = useState(1);
  const [expandedNote, setExpandedNote] = useState(1);
  const [expandedKeyPoint, setExpandedKeyPoint] = useState(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Sample data
  const graphData = [
    { name: "Jan", value: 40 },
    { name: "Feb", value: 65 },
    { name: "Mar", value: 55 },
    { name: "Apr", value: 70 },
    { name: "May", value: 45 },
    { name: "Jun", value: 90 },
  ];

  const competitionData = [
    { id: 1, name: "Advanced ML Challenge", rank: 1, score: 98 },
    { id: 2, name: "Web Dev Hackathon", rank: 2, score: 95 },
    { id: 3, name: "Data Science Bowl", rank: 3, score: 92 },
  ];

  const roadmapItems = [
    {
      id: 1,
      title: "Frontend Development",
      date: "April 15",
      status: "In Progress",
      progress: 65,
      subItems: [
        {
          id: 11,
          title: "Learn React Hooks",
          date: "April 20",
          status: "Planned",
        },
        {
          id: 12,
          title: "Master CSS Grid",
          date: "April 25",
          status: "Planned",
        },
      ],
    },
    {
      id: 2,
      title: "Backend Integration",
      date: "May 10",
      status: "Planned",
      progress: 20,
      subItems: [
        {
          id: 21,
          title: "Setup Express Server",
          date: "May 15",
          status: "Planned",
        },
        {
          id: 22,
          title: "Create RESTful APIs",
          date: "May 20",
          status: "Planned",
        },
      ],
    },
    {
      id: 3,
      title: "User Testing Phase",
      date: "June 5",
      status: "Planned",
      progress: 0,
      subItems: [
        {
          id: 31,
          title: "Conduct User Interviews",
          date: "June 10",
          status: "Planned",
        },
        {
          id: 32,
          title: "Implement Feedback",
          date: "June 15",
          status: "Planned",
        },
      ],
    },
  ];

  const recommendedContent = [
    {
      id: 1,
      title: "Advanced React Patterns",
      type: "Course",
      match: "95%",
      icon: "code",
    },
    {
      id: 2,
      title: "Building Scalable APIs",
      type: "Tutorial",
      match: "87%",
      icon: "server",
    },
    {
      id: 3,
      title: "Machine Learning Fundamentals",
      type: "E-Book",
      match: "82%",
      icon: "brain",
    },
  ];

  const chapterNotes = [
    {
      id: 1,
      chapter: "Chapter 1",
      title: "Introduction to AI",
      icon: "brain",
      keyPoints: [
        {
          title: "History of AI",
          content:
            "AI research began in the 1950s with the development of symbolic reasoning systems. Key milestones include the Dartmouth Conference (1956), expert systems (1970s), and the AI winter (1980s).",
        },
        {
          title: "Neural Networks",
          content:
            "Inspired by biological neural networks, artificial neural networks use layers of connected nodes to process information. Key concepts include perceptrons, activation functions, and backpropagation.",
        },
      ],
    },
    {
      id: 2,
      chapter: "Chapter 2",
      title: "Data Preprocessing",
      icon: "data",
      keyPoints: [
        {
          title: "Data Cleaning",
          content:
            "Process of fixing or removing incorrect, corrupted, or incomplete data. Techniques include handling missing values, smoothing noisy data, and resolving inconsistencies.",
        },
        {
          title: "Feature Engineering",
          content:
            "Process of creating new features from raw data to improve model performance. Methods include binning, log transforms, and creating interaction terms.",
        },
      ],
    },
  ];

  const stats = [
    {
      title: "Courses Completed",
      value: "12",
      icon: <Book className="h-6 w-6 text-purple-600" />,
      trend: "+2 from last month",
    },
    {
      title: "Active Students",
      value: "128",
      icon: <Users className="h-6 w-6 text-purple-500" />,
      trend: "+15% growth",
    },
    {
      title: "Average Rating",
      value: "4.8",
      icon: <Star className="h-6 w-6 text-purple-500" />,
      trend: "Top 5%",
    },
    {
      title: "Mentor Hours",
      value: "86",
      icon: <Clock className="h-6 w-6 text-purple-400" />,
      trend: "+12 this week",
    },
  ];

  const toggleRoadmapItem = (id) => {
    setExpandedRoadmapItem(expandedRoadmapItem === id ? null : id);
  };

  const toggleNote = (id) => {
    setExpandedNote(expandedNote === id ? null : id);
    setExpandedKeyPoint(null);
  };

  const toggleKeyPoint = (noteId, keyPointIndex) => {
    setExpandedKeyPoint(
      expandedKeyPoint === `${noteId}-${keyPointIndex}`
        ? null
        : `${noteId}-${keyPointIndex}`
    );
  };

  // Progress bar component
  const ProgressBar = ({ percentage }) => (
    <div className="w-full bg-purple-100 rounded-full h-2 mt-2">
      <div
        className="bg-gradient-to-r from-purple-700 to-purple-400 h-2 rounded-full transition-all duration-500 ease-in-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );

  // Content Type Icon
  const ContentTypeIcon = ({ type }) => {
    if (type === "code")
      return (
        <div className="bg-purple-100 p-2 rounded-lg">
          <svg
            className="w-6 h-6 text-purple-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
        </div>
      );
    if (type === "server")
      return (
        <div className="bg-purple-200 p-2 rounded-lg">
          <svg
            className="w-6 h-6 text-purple-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
            />
          </svg>
        </div>
      );
    if (type === "brain")
      return (
        <div className="bg-purple-300 p-2 rounded-lg">
          <svg
            className="w-6 h-6 text-purple-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
      );
    if (type === "data")
      return (
        <div className="bg-purple-200 p-2 rounded-lg">
          <svg
            className="w-6 h-6 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
      );
    return (
      <div className="bg-purple-100 p-2 rounded-lg">
        <svg
          className="w-6 h-6 text-purple-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>
    );
  };

  const Breadcrumb = () => (
    <nav aria-label="breadcrumb">
      <ol className="flex flex-wrap items-center text-sm">
        <li className="inline-flex items-center">
          <a
            href="#"
            className="text-purple-500 hover:text-purple-700 transition-colors"
          >
            Home
          </a>
        </li>
        <span className="mx-2 text-purple-500">/</span>
        <li className="inline-flex items-center">
          <a
            href="#"
            className="text-purple-500 hover:text-purple-700 transition-colors"
          >
            Dashboard
          </a>
        </li>
        <span className="mx-2 text-purple-500">/</span>
        <li className="inline-flex items-center text-purple-700 font-medium">
          Mentor View
        </li>
      </ol>
    </nav>
  );

  // Chart component
  const PerformanceChart = () => {
    if (!isClient) return <div className="h-72" />;

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={graphData}>
          <XAxis dataKey="name" stroke="#8884d8" />
          <YAxis stroke="#8884d8" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e6e6e6",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 10px rgba(138, 75, 175, 0.1)",
            }}
          />
          <Bar
            dataKey="value"
            fill="url(#colorGradient)"
            radius={[4, 4, 0, 0]}
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8a4baf" stopOpacity={1} />
              <stop offset="100%" stopColor="#b794f4" stopOpacity={0.8} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="min-h-screen bg-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {/* <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900 mb-2">Mentor Dashboard</h1>
          <p className="text-purple-600">Monitor student progress and manage your learning content</p>
          <div className="mt-4">
            <Breadcrumb />
          </div>
        </div> */}

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isClient &&
            stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white border border-purple-100 shadow-sm hover:shadow-md transition-shadow rounded-xl p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-purple-900 mt-2">
                      {stat.value}
                    </p>
                    <p className="text-xs text-purple-500 mt-1">{stat.trend}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg shadow-sm">
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Performance Graph */}
          <div className="lg:col-span-2 bg-white border border-purple-100 shadow-sm hover:shadow-md transition-shadow rounded-xl p-6">
            <div className="mb-4">
              <div className="flex items-center text-purple-900 font-semibold text-lg">
                <LineChart size={20} className="mr-2 text-purple-600" />
                Performance Metrics
              </div>
              <p className="text-sm text-purple-600 mt-1">
                Student engagement over the past 6 months
              </p>
            </div>
            <div className="h-72">
              <PerformanceChart />
            </div>
          </div>

          {/* Competitions */}
          <div className="bg-white border border-purple-100 shadow-sm hover:shadow-md transition-shadow rounded-xl p-6">
            <div className="mb-4">
              <div className="flex items-center text-purple-900 font-semibold text-lg">
                <Trophy size={20} className="mr-2 text-purple-600" />
                Top Achievements
              </div>
              <p className="text-sm text-purple-600 mt-1">
                Recent competition results
              </p>
            </div>
            <div className="space-y-4">
              {competitionData.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center bg-purple-50 border border-purple-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-all hover:border-purple-300"
                >
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full mr-4 ${
                      item.rank === 1
                        ? "bg-gradient-to-r from-purple-700 to-purple-500"
                        : item.rank === 2
                        ? "bg-gradient-to-r from-purple-600 to-purple-400"
                        : "bg-gradient-to-r from-purple-500 to-purple-300"
                    } text-white font-bold text-lg shadow-md`}
                  >
                    {item.rank}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-purple-900">
                      {item.name}
                    </div>
                    <div className="text-sm text-purple-600">
                      Score: {item.score}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Roadmap */}
          <div className="bg-white border border-purple-100 shadow-sm hover:shadow-md transition-shadow rounded-xl p-6">
            <div className="mb-4">
              <div className="flex items-center text-purple-900 font-semibold text-lg">
                <Calendar size={20} className="mr-2 text-purple-600" />
                Learning Roadmap
              </div>
              <p className="text-sm text-purple-600 mt-1">
                Track progress through curriculum
              </p>
            </div>
            <div className="space-y-5">
              {roadmapItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-purple-50 border border-purple-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all hover:border-purple-300"
                >
                  <div
                    className="p-4 flex items-start justify-between cursor-pointer hover:bg-purple-100 transition-colors"
                    onClick={() => isClient && toggleRoadmapItem(item.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-2 ${
                            item.status === "In Progress"
                              ? "bg-purple-600"
                              : "bg-purple-300"
                          }`}
                        ></div>
                        <div className="font-medium text-purple-900">
                          {item.title}
                        </div>
                      </div>
                      <div className="flex text-sm mt-1">
                        <span className="text-purple-600 mr-4">
                          {item.date}
                        </span>
                        <span
                          className={
                            item.status === "In Progress"
                              ? "text-purple-700 font-medium"
                              : "text-purple-400"
                          }
                        >
                          {item.status}
                        </span>
                      </div>
                      <ProgressBar percentage={item.progress} />
                    </div>
                    <div className="ml-4">
                      {isClient && expandedRoadmapItem === item.id ? (
                        <ChevronDown size={20} className="text-purple-600" />
                      ) : (
                        <ChevronRight size={20} className="text-purple-600" />
                      )}
                    </div>
                  </div>

                  {isClient && expandedRoadmapItem === item.id && (
                    <div className="bg-purple-100 p-4 border-t border-purple-200">
                      {item.subItems.map((subItem) => (
                        <div
                          key={subItem.id}
                          className="mb-4 last:mb-0 pl-4 border-l-2 border-purple-300"
                        >
                          <div className="font-medium text-sm text-purple-800">
                            {subItem.title}
                          </div>
                          <div className="flex text-xs mt-1">
                            <span className="text-purple-600 mr-4">
                              {subItem.date}
                            </span>
                            <span className="text-purple-500">
                              {subItem.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white border border-purple-100 shadow-sm hover:shadow-md transition-shadow rounded-xl p-6">
            <div className="mb-4">
              <div className="flex items-center text-purple-900 font-semibold text-lg">
                <Lightbulb size={20} className="mr-2 text-purple-600" />
                Personalized Recommendations
              </div>
              <p className="text-sm text-purple-600 mt-1">
                AI-curated content based on student needs
              </p>
            </div>
            <div className="space-y-4">
              {recommendedContent.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center bg-purple-50 border border-purple-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-all hover:border-purple-300"
                >
                  <ContentTypeIcon type={item.icon} />
                  <div className="ml-4 flex-1">
                    <div className="font-medium text-purple-900">
                      {item.title}
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="bg-purple-100 text-purple-600 rounded-full px-2 py-0.5 text-xs">
                        {item.type}
                      </span>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-full text-sm font-medium shadow-sm">
                    {item.match}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Session Notes */}
        <div className="bg-white border border-purple-100 shadow-sm hover:shadow-md transition-shadow mb-8 rounded-xl p-6">
          <div className="mb-4">
            <div className="flex items-center text-purple-900 font-semibold text-lg">
              <Book size={20} className="mr-2 text-purple-600" />
              Session Notes and Summaries
            </div>
            <p className="text-sm text-purple-600 mt-1">
              AI-generated summaries from learning sessions
            </p>
          </div>
          <div className="space-y-5">
            {chapterNotes.map((note) => (
              <div
                key={note.id}
                className="rounded-lg overflow-hidden border border-purple-100 shadow-sm hover:shadow-md transition-all hover:border-purple-300"
              >
                <div
                  className="bg-purple-50 p-4 flex items-center justify-between cursor-pointer hover:bg-purple-100 transition-colors"
                  onClick={() => isClient && toggleNote(note.id)}
                >
                  <div className="flex items-center">
                    <ContentTypeIcon type={note.icon} />
                    <div className="ml-4 font-medium text-purple-900">
                      {note.chapter}: {note.title}
                    </div>
                  </div>
                  <div>
                    {isClient && expandedNote === note.id ? (
                      <ChevronDown size={18} className="text-purple-600" />
                    ) : (
                      <ChevronRight size={18} className="text-purple-600" />
                    )}
                  </div>
                </div>

                {isClient && expandedNote === note.id && (
                  <div className="bg-purple-100 p-5">
                    <div className="space-y-4">
                      {note.keyPoints.map((point, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg border border-purple-200 shadow-sm overflow-hidden"
                        >
                          <div
                            className="p-3 flex items-center text-sm font-medium text-purple-800 cursor-pointer hover:bg-purple-50 transition-colors"
                            onClick={() =>
                              isClient && toggleKeyPoint(note.id, index)
                            }
                          >
                            <span className="w-2 h-2 rounded-full bg-purple-600 mr-3"></span>
                            <span>{point.title}</span>
                            <div className="ml-auto">
                              {isClient &&
                              expandedKeyPoint === `${note.id}-${index}` ? (
                                <ChevronDown
                                  size={16}
                                  className="text-purple-600"
                                />
                              ) : (
                                <ChevronRight
                                  size={16}
                                  className="text-purple-600"
                                />
                              )}
                            </div>
                          </div>

                          {isClient &&
                            expandedKeyPoint === `${note.id}-${index}` && (
                              <div className="p-4 text-sm text-purple-700 border-t border-purple-100 bg-purple-50">
                                {point.content}
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Define missing icon components
const Star = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
);

const Clock = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export default MentorDashboard;
