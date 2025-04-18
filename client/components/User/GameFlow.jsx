"use client";
import { useCallback, useState, useRef } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Mic, MicOff, Send } from "lucide-react";
import { AI_SERVER_URL } from "@/constants/utils";

const sampleInputs = [
  {
    title: "Career Transition",
    text: "I want to transition from software engineering to product management. What skills do I need and what steps should I take?",
  },
  {
    title: "Skill Development",
    text: "I'm a junior developer looking to become a senior. What technical and soft skills should I focus on developing?",
  },
  {
    title: "Mentorship Path",
    text: "As an experienced professional, how can I structure my mentorship approach to best help my mentees?",
  },
  {
    title: "Leadership Growth",
    text: "I want to move into a leadership position. What competencies should I develop and what experiences should I seek?",
  },
  {
    title: "Career Assessment",
    text: "Help me evaluate my current skills and experience to identify potential career paths that match my strengths.",
  },
];

const WorkflowBuilder = () => {
  const [activeTab, setActiveTab] = useState("transition");
  const [userInput, setUserInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFlowchart, setShowFlowchart] = useState(false);
  const textareaRef = useRef(null);
  const [serverData, setServerData] = useState(null);
  const flowchartRef = useRef(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleSpeechToText = () => {
    if (!isListening) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-IN";

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setUserInput(transcript);
          if (textareaRef.current) {
            textareaRef.current.value = transcript;
          }
        };

        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } else {
        alert("Speech recognition is not supported in your browser.");
      }
    } else {
      setIsListening(false);
      window.speechSynthesis.cancel();
    }
  };

  const handleStrategySelect = (strategy) => {
    setActiveTab(strategy);
  };

  const handleGenerate = async () => {
    if (!activeTab) return;

    setIsGenerating(true);
    setShowFlowchart(false);

    try {
      const formData = new FormData();
      formData.append(
        "input",
        userInput ||
          `I need guidance on my career path regarding ${activeTab}. Please generate a structured plan that includes:
            1. Recommended skills to develop
            2. Potential milestones and timeline
            3. Mentorship opportunities
            4. Resources and learning materials
            5. A visual representation of the career path`
      );

      formData.append("pathType", activeTab);

      if (!AI_SERVER_URL) {
        console.error(
          "AI_SERVER_URL is not defined. Please set it in your environment."
        );
        setIsGenerating(false);
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/api/career-path`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.nodes && data.edges) {
        setServerData(data);

        setNodes(
          data.nodes.map((node) => ({
            ...node,
            className: `
                ${node.style.background} !important
                border-2
                ${node.style.border} !important
                rounded-lg
                p-4
                text-center
                font-medium
              `,
            data: {
              ...node.data,
              label: node.data.label,
            },
          }))
        );

        setEdges(
          data.edges.map((edge) => ({
            ...edge,
            className: edge.style.stroke,
            source: edge.source,
            target: edge.target,
            label: edge.label,
          }))
        );

        setShowFlowchart(true);

        setTimeout(() => {
          flowchartRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      } else {
        console.warn("Invalid server response:", data);
      }
    } catch (error) {
      console.error("Error generating career path:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTextareaInput = (e) => {
    setUserInput(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  const handleSampleInput = (text) => {
    setUserInput(text);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  const tabs = [
    {
      id: "transition",
      label: "Career Transition",
      color: "purple",
      description:
        "Plan your transition between careers or roles with structured guidance and mentorship.",
      benefits: [
        "Clear roadmap for career change",
        "Skill gap analysis",
        "Mentor matching",
        "Timeline estimation",
      ],
      suggestedActivities: [
        "Current skill assessment",
        "Target role analysis",
        "Gap identification",
        "Learning plan",
        "Mentor matching",
      ],
    },
    {
      id: "growth",
      label: "Skill Growth",
      color: "indigo",
      description:
        "Develop specific skills to advance in your current career path with mentor guidance.",
      benefits: [
        "Personalized skill development",
        "Mentor recommendations",
        "Progress tracking",
        "Resource curation",
      ],
      suggestedActivities: [
        "Skill assessment",
        "Learning path creation",
        "Mentor sessions",
        "Project recommendations",
        "Progress evaluation",
      ],
    },
    {
      id: "mentorship",
      label: "Mentorship Path",
      color: "purple",
      description:
        "Structure your approach as a mentor to effectively guide mentees in their career journeys.",
      benefits: [
        "Mentorship framework",
        "Communication strategies",
        "Goal setting tools",
        "Progress measurement",
      ],
      suggestedActivities: [
        "Mentorship style assessment",
        "Session planning",
        "Goal setting framework",
        "Feedback mechanisms",
      ],
    },
    {
      id: "leadership",
      label: "Leadership Growth",
      color: "indigo",
      description:
        "Develop leadership competencies and prepare for management roles with executive mentorship.",
      benefits: [
        "Leadership skill mapping",
        "Executive mentor matching",
        "Management simulations",
        "Peer feedback",
      ],
      suggestedActivities: [
        "Leadership assessment",
        "Competency development",
        "Mentor matching",
        "Case studies",
        "Feedback integration",
      ],
    },
  ];

  return (
    <div className="mx-auto space-y-8 py-2 pr-2">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {/* Sample Inputs Section */}
        <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
          <div className="flex items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Sample Career Questions:
            </span>
            <span className="ml-2 text-xs text-gray-500">
              (Click to populate)
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sampleInputs.map((sample, index) => (
              <button
                key={index}
                onClick={() => handleSampleInput(sample.text)}
                className="px-3 py-1.5 text-sm bg-white rounded-lg border border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 flex items-center group"
              >
                <span className="text-gray-600 group-hover:text-purple-600">
                  {sample.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Textarea and Strategy Selection */}
        <div className="p-6 space-y-6">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={userInput}
              onChange={handleTextareaInput}
              placeholder="Describe your career goals, current skills, and areas where you need mentorship..."
              className="w-full min-h-[120px] p-5 text-gray-800 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              style={{ height: "auto" }}
            />
            <button
              onClick={handleSpeechToText}
              className={`absolute right-3 bottom-3 p-2 rounded-full ${
                isListening
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600"
              } hover:bg-gray-200 transition-colors`}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          </div>

          {/* Strategy Tabs */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleStrategySelect(tab.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-102 ${
                  activeTab === tab.id
                    ? `border-${tab.color}-500 bg-gradient-to-br from-${tab.color}-100 to-${tab.color}-200 text-${tab.color}-700 shadow-md`
                    : "border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="font-semibold">{tab.label}</div>
              </button>
            ))}
          </div>

          {/* Active Tab Details */}
          {activeTab && (
            <div className="p-6 bg-white rounded-2xl shadow-xl border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {tabs.find((tab) => tab.id === activeTab)?.label}
              </h2>
              <p className="text-gray-600">
                {tabs.find((tab) => tab.id === activeTab)?.description}
              </p>
              <div className="mt-4">
                <p className="font-medium text-gray-800">Suggested Approach:</p>
                <ul className="list-disc pl-5 text-gray-600">
                  {tabs
                    .find((tab) => tab.id === activeTab)
                    ?.suggestedActivities.map((activity, index) => (
                      <li key={index}>{activity}</li>
                    ))}
                </ul>
              </div>
              <div className="mt-4">
                <p className="font-medium text-gray-800">Benefits:</p>
                <ul className="list-disc pl-5 text-gray-600">
                  {tabs
                    .find((tab) => tab.id === activeTab)
                    ?.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Generate Button */}
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200">
          <button
            onClick={handleGenerate}
            disabled={!activeTab || isGenerating}
            className={`w-full flex items-center justify-center space-x-3 px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 transform hover:scale-102 ${
              activeTab && !isGenerating
                ? "bg-gradient-to-tr from-purple-300 to-purple-500 hover:from-purple-400 hover:to-purple-600 text-white shadow-lg hover:shadow-xl font-semibold"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send className="h-6 w-6" />
            <span>
              {isGenerating
                ? "Generating Career Path..."
                : "Generate Career Path"}
            </span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isGenerating && (
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-2xl mx-auto">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto"></div>
          <h3 className="mt-6 text-xl font-semibold text-gray-900">
            Creating Your Personalized Career Path
          </h3>
          <p className="mt-3 text-gray-600">
            Analyzing your goals and creating a customized mentorship and career
            development plan...
          </p>
        </div>
      )}

      {/* Flowchart Section */}
      {showFlowchart && serverData && (
        <div
          ref={flowchartRef}
          className="space-y-6 animate-fade-in scroll-mt-8"
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="h-[700px] w-full bg-gradient-to-br from-gray-50 to-gray-100">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                className="bg-gray-50"
                defaultEdgeOptions={{
                  type: "smoothstep",
                  animated: true,
                  style: { strokeWidth: 2 },
                }}
              >
                <Background />
                <Controls />
              </ReactFlow>
            </div>
          </div>

          {serverData.additionalInfo && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Career Path Details
              </h3>
              <div className="prose max-w-none text-gray-600">
                {serverData.additionalInfo.split("\n").map((paragraph, i) => (
                  <p key={i} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkflowBuilder;
