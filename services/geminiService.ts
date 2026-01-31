import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ProjectRequest, ProjectIdea, ProjectBlueprint, InterviewPrep, Difficulty } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = "gemini-3-flash-preview";

// --- Schemas ---

const projectIdeasSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          tagline: { type: Type.STRING },
          type: { type: Type.STRING, enum: ["Practical", "Creative"] },
          difficulty: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
          description: { type: Type.STRING },
          keyTech: { type: Type.ARRAY, items: { type: Type.STRING } },
          estimatedHours: { type: Type.INTEGER },
        },
        required: ["title", "tagline", "type", "difficulty", "description", "keyTech", "estimatedHours"],
      },
    },
  },
  required: ["projects"],
};

const blueprintSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overview: { type: Type.STRING },
    techStack: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          tools: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["category", "tools"],
      },
    },
    architecture: { type: Type.STRING },
    coreFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
    implementationSteps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          phase: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["phase", "description"],
      },
    },
    challengesAndSolutions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          challenge: { type: Type.STRING },
          solution: { type: Type.STRING },
        },
        required: ["challenge", "solution"],
      },
    },
  },
  required: ["overview", "techStack", "architecture", "coreFeatures", "implementationSteps", "challengesAndSolutions"],
};

const interviewSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          answer: { type: Type.STRING },
          category: { type: Type.STRING, enum: ["Technical", "Behavioral", "Project-Specific"] },
          keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["question", "answer", "category", "keyPoints"],
      },
    },
  },
  required: ["questions"],
};

// --- API Functions ---

export const generateProjects = async (request: ProjectRequest): Promise<ProjectIdea[]> => {
  const industryPrompt = request.industry ? `in the ${request.industry} industry` : "across diverse, cutting-edge domains";
  
  // We strictly require the model to output projects for EACH selected difficulty.
  // If difficulties are ['Low', 'High'], we want 1 Practical + 1 Creative for Low, AND 1 Practical + 1 Creative for High.
  const levels = request.difficulties.length > 0 ? request.difficulties : ["Medium"];
  
  const prompt = `
    Role: ${request.role}
    Industry: ${industryPrompt}
    Selected Difficulties: ${levels.join(", ")}
    
    TASK:
    For EACH selected difficulty level, generate exactly 2 projects:
    1. One 'Practical' project (Real-world business application, solving tangible needs).
    2. One 'Creative' project (Innovative, unique, visually impressive).
    
    TOTAL OUTPUT:
    You must output exactly ${levels.length * 2} projects in total.
    
    REQUIREMENTS:
    - Label the 'difficulty' field correctly for each project.
    - Descriptions must be engaging, 150-200 words each.
    - Taglines should be punchy and professional.
    - Tech stacks should be modern and specific to the difficulty.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: projectIdeasSchema,
      },
    });

    const data = JSON.parse(response.text || "{}");
    // Add unique IDs
    return data.projects.map((p: any, idx: number) => ({ ...p, id: `proj-${Date.now()}-${idx}` }));
  } catch (error) {
    console.error("Gemini Generate Projects Error:", error);
    throw new Error("Failed to generate project ideas.");
  }
};

export const generateBlueprint = async (project: ProjectIdea, role: string): Promise<ProjectBlueprint> => {
  const prompt = `
    Create a detailed technical blueprint for this project:
    Title: ${project.title}
    Type: ${project.type}
    Difficulty: ${project.difficulty}
    Description: ${project.description}
    Role: ${role}

    REQUIREMENTS:
    - The blueprint must be professional, concise, and technically rigorous.
    - **Implementation Steps**: For each step, provide a 'phase' title and a **'description' that is at least 3-4 sentences long**. 
      The description MUST cover specific tools, libraries to be used, the logic flow, and technical implementation details. 
      Do not just say "Build the frontend". Say "Initialize a React project using Vite. Configure TailwindCSS for styling. Create reusable components for X and Y using atomic design principles..."
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: blueprintSchema,
      },
    });

    const data = JSON.parse(response.text || "{}");
    return {
      projectId: project.id,
      title: project.title,
      ...data,
    };
  } catch (error) {
    console.error("Gemini Blueprint Error:", error);
    throw new Error("Failed to generate project blueprint.");
  }
};

export const generateInterviewQA = async (projectTitle: string, projectDesc: string, techStack: any[]): Promise<InterviewPrep> => {
  const techStackStr = techStack.map(t => `${t.category}: ${t.tools.join(', ')}`).join('; ');
  
  const prompt = `
    The user has built the following project: "${projectTitle}".
    Description: ${projectDesc}
    Tech Stack: ${techStackStr}
    
    Generate exactly 10 high-impact interview questions.
    
    Tone: Senior Engineer Interviewer. Professional, technically demanding, curious.
    Do not mention "vibe coding".
    
    Categories:
    - Technical
    - Project-Specific
    - Behavioral
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: interviewSchema,
      },
    });

    const data = JSON.parse(response.text || "{}");
    return {
      projectId: projectTitle, 
      questions: data.questions,
    };
  } catch (error) {
    console.error("Gemini Interview QA Error:", error);
    throw new Error("Failed to generate interview Q&A.");
  }
};