// services/groqService.ts
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: "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" // Replace with your Groq API key
});

// Same medicinal plants and home remedies list
const MEDICINAL_PLANTS = [
  "sacred fig", "mexican poppy", "indian madder", "mango ginger",
  "black nightshade", "comfrey", "indigo", "oregon grape", "hemp seed oil",
  "nettles", "holy basil", "echinacea", "gotu kola", "calendula",
  "aloe vera", "turmeric", "neem", "sandalwood", "saffron"
];

const HOME_REMEDIES = [
  "Rose Water and Aloe Vera Mask", "Cucumber and Mint Face Mask",
  "Neem and Turmeric Face Pack", "Green Tea and Honey Mask",
  "Turmeric and Milk Face Pack", "Honey Aloe Face Mask",
  "Rice Water Toner", "Papaya and Honey Face Pack",
  "Aloe Vera Gel with Rose Water", "Coconut Lemon Body Scrub",
  "Oatmeal and Honey Face Mask", "Cucumber Face Mask",
  "Besan Body Scrub", "Saffron and Honey Face Pack",
  "Turmeric and Gram Flour Face Pack"
];

// System prompt remains the same
const SYSTEM_PROMPT = `
You are an expert herbal skincare assistant for a website focused on natural remedies. 
Your knowledge is strictly limited to the following:

**Medicinal Plants:** ${MEDICINAL_PLANTS.join(", ")}

**Home Remedies:** ${HOME_REMEDIES.join(", ")}

Your responsibilities:
1. Provide information about medicinal plants and their skincare benefits.
2. Explain home remedies and how to prepare/use them.
3. Offer personalized skincare advice based on skin type.
4. Answer questions about natural skincare.
5. Never recommend products outside the listed ones.

Always respond in a friendly, professional manner focused on herbal solutions.
`;

interface SkinAssessment {
  skinType: string;
  mainConcerns: string[];
  recommendedPlants: string[];
  suggestedRemedies: string[];
  routine: string;
}

function parseAssessmentResponse(response: string): SkinAssessment {
  try {
    // Basic parsing - you may want to enhance this based on your needs
    const lines = response.split('\n');
    const assessment: SkinAssessment = {
      skinType: '',
      mainConcerns: [],
      recommendedPlants: [],
      suggestedRemedies: [],
      routine: ''
    };

    let currentSection = '';
    for (const line of lines) {
      if (line.toLowerCase().includes('skin type')) {
        currentSection = 'skinType';
        assessment.skinType = line.split(':')[1]?.trim() || '';
      } else if (line.toLowerCase().includes('concerns')) {
        currentSection = 'mainConcerns';
      } else if (line.toLowerCase().includes('plants')) {
        currentSection = 'recommendedPlants';
      } else if (line.toLowerCase().includes('remedies')) {
        currentSection = 'suggestedRemedies';
      } else if (line.toLowerCase().includes('routine')) {
        currentSection = 'routine';
      } else if (line.trim()) {
        switch (currentSection) {
          case 'mainConcerns':
            assessment.mainConcerns.push(line.trim());
            break;
          case 'recommendedPlants':
            assessment.recommendedPlants.push(line.trim());
            break;
          case 'suggestedRemedies':
            assessment.suggestedRemedies.push(line.trim());
            break;
          case 'routine':
            assessment.routine += line + '\n';
            break;
        }
      }
    }

    return assessment;
  } catch (error) {
    console.error('Error parsing assessment response:', error);
    return {
      skinType: 'Unknown',
      mainConcerns: [],
      recommendedPlants: [],
      suggestedRemedies: [],
      routine: 'Unable to parse assessment response'
    };
  }
}

interface ChatHistory {
  messages: Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>;
}

export async function generateResponse(userInput: string, chatHistory: ChatHistory): Promise<string> {
  try {
    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...chatHistory.messages.map(msg => ({
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content
      })),
      { role: "user" as const, content: userInput }
    ];

    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768", // Groq's Mixtral model (fast & powerful)
      messages,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Error calling Groq API:", error);
    return "I'm having trouble connecting to the knowledge base. Please try again later.";
  }
}

// Skin assessment function using Groq
export async function getSkinAssessment(answers: Record<string, string>): Promise<SkinAssessment> {
  const prompt = `
  Based on these skin assessment answers:
  ${JSON.stringify(answers)}

  Provide a detailed skin analysis and recommendations using ONLY the following plants and remedies:
  Medicinal Plants: ${MEDICINAL_PLANTS.join(", ")}
  Home Remedies: ${HOME_REMEDIES.join(", ")}

  Include:
  1. Determined skin type
  2. Main concerns
  3. Recommended plants
  4. Suggested home remedies
  5. A simple routine
  `;

  const response = await groq.chat.completions.create({
    model: "mixtral-8x7b-32768",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5, // More deterministic for assessments
  });

  return parseAssessmentResponse(response.choices[0]?.message?.content || "");
}