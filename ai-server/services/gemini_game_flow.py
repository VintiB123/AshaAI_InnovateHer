import os
import google.generativeai as genai
import re
import json
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

generation_config = {
    "temperature": 1,
    "top_p": 0.9,
    "top_k": 35,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-2.0-flash-exp",
    generation_config=generation_config,
    system_instruction='''You are an expert AI career advisor specializing in designing personalized career paths and mentorship roadmaps. 
Your goal is to generate structured, step-by-step career development plans that help users achieve their professional goals through skill development and mentorship.

When a user provides a query about:
- **Career Transition**: Create pathways for moving between roles/industries with skill mapping and mentor recommendations
- **Skill Growth**: Develop focused skill-building plans with milestones and mentor matching
- **Mentorship Path**: Structure effective mentorship approaches for mentors to guide mentees
- **Leadership Growth**: Design leadership development tracks with executive mentorship opportunities

For each response, structure the career path as an interactive flowchart with:
- **Clear milestones** for each step
- **Concise descriptions** (2-3 sentences) of key actions
- **Color-coded nodes** for different path types (transition, skill, mentorship, leadership)
- **Mentorship connection points** highlighted

### **Response Format (Strict JSON)**
{
  "nodes": [
    {
      "id": "start",
      "position": { "x": 250, "y": 50 },
      "data": { "label": "Current Position" },
      "style": {
        "background": "bg-gray-100",
        "border": "border-gray-500"
      }
    },
    {
      "id": "skill_assessment",
      "position": { "x": 50, "y": 150 },
      "data": { "label": "Skill Assessment" },
      "style": {
        "background": "bg-blue-100",
        "border": "border-blue-500"
      }
    },
    {
      "id": "mentor_matching",
      "position": { "x": 250, "y": 150 },
      "data": { "label": "Mentor Matching" },
      "style": {
        "background": "bg-purple-100",
        "border": "border-purple-500"
      }
    },
    {
      "id": "goal_setting",
      "position": { "x": 450, "y": 150 },
      "data": { "label": "Goal Setting" },
      "style": {
        "background": "bg-green-100",
        "border": "border-green-500"
      }
    },
    {
      "id": "target_position",
      "position": { "x": 250, "y": 250 },
      "data": { "label": "Target Position" },
      "style": {
        "background": "bg-indigo-100",
        "border": "border-indigo-500"
      }
    }
  ],
  "edges": [
    {
      "id": "e1-assessment",
      "source": "start",
      "target": "skill_assessment",
      "label": "Identify Gaps",
      "style": { "stroke": "stroke-blue-500" }
    },
    {
      "id": "e2-mentor",
      "source": "skill_assessment",
      "target": "mentor_matching",
      "label": "Find Mentor",
      "style": { "stroke": "stroke-purple-500" }
    },
    {
      "id": "e3-goals",
      "source": "mentor_matching",
      "target": "goal_setting",
      "label": "Set Milestones",
      "style": { "stroke": "stroke-green-500" }
    },
    {
      "id": "e4-target",
      "source": "goal_setting",
      "target": "target_position",
      "label": "Achieve Goals",
      "style": { "stroke": "stroke-indigo-500" }
    }
  ],
  "additionalInfo": "This career path focuses on transitioning from your current role to your target position through skill development and mentorship. Recommended timeline: 6-12 months depending on current skill level."
}'''
)

chat_session = model.start_chat(history=[])

def get_gemini_response(user_input: str, focusArea: str = "balanced") -> dict:
    """
    Generates an AI-powered workflow using Gemini 2.0 based on the user input.

    Args:
      user_input: The user's request for an AI workflow.
      focusArea: A value can be any of "marketing", "corporate", "legal", or "balanced".

    Returns:
      A JSON object representing the structured AI workflow.
    """
    response = chat_session.send_message(f'{user_input} \nThe focus Area is: {focusArea}')
    markdown_text = response.text

    try:
        # First, try parsing directly as JSON
        return json.loads(markdown_text)
    except json.JSONDecodeError:
        # Fallback: Extract JSON content inside ```json ... ```
        json_match = re.search(r'```json\s*(.*?)\s*```', markdown_text, re.DOTALL)
        if json_match:
            try:
                return json.loads(json_match.group(1))
            except json.JSONDecodeError:
                print("Error: Extracted JSON is invalid.")
                return None
        else:
            print("Error: Could not extract JSON from response.")
            return None

if __name__ == "__main__":
    # Corrected test query with a valid focus area
    test_query = "I want to transition from software engineering to product management. What skills do I need and what mentorship should I seek?"
    response = get_gemini_response(test_query, focusArea="transition")

    if response:
        print(json.dumps(response, indent=2))  # Pretty print the JSON
    else:
        print("Failed to get a valid response.")