// services/geminiService.ts
import { GoogleGenAI, Type } from "@google/genai";
import { Trend, Sentiment, Platform, Category, Country, Region } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const trendSchema = {
  type: Type.OBJECT,
  properties: {
    name: {
      type: Type.STRING,
      description: "The name of the trend, like a hashtag (e.g., #TechInnovation)."
    },
    summary: {
      type: Type.STRING,
      description: "A concise, one-sentence summary explaining why this is trending."
    },
    volume: {
      type: Type.INTEGER,
      description: "The estimated number of posts per minute for this trend."
    },
    sentiment: {
      type: Type.STRING,
      enum: [Sentiment.Positive, Sentiment.Neutral, Sentiment.Negative],
      description: "The overall sentiment of the trend."
    },
    sentimentScore: {
        type: Type.INTEGER,
        description: "A sentiment score from 0 (very negative) to 100 (very positive), with 50 being neutral."
    },
    sourceUrl: {
        type: Type.STRING,
        description: "A plausible URL to view the trend on a major social media platform, like a search URL for the hashtag (e.g., https://x.com/search?q=%23TechInnovation)."
    },
    change: {
        type: Type.INTEGER,
        description: "A small integer representing the change in volume from the previous minute."
    }
  },
  required: ['name', 'summary', 'volume', 'sentiment', 'sentimentScore', 'sourceUrl', 'change']
};

const responseSchema = {
  type: Type.ARRAY,
  items: trendSchema
};

const createPrompt = (platform: Platform, category: Category, country: Country, region: Region, trackedTrends: string[]): string => {
  const platformContext = platform === 'All Platforms'
    ? 'across major social media platforms'
    : `on "${platform}"`;

  let countryContext = country === 'Worldwide'
    ? 'globally'
    : `in ${country}`;
    
  if (region) {
    countryContext = `in the state/province of ${region}, ${country}`;
  }

  const categoryContext = category === 'All'
    ? ''
    : ` within the "${category}" category`;
  
  const trackingContext = trackedTrends.length > 0
    ? `In addition to the organic trends, you MUST provide data for the following specific trends: ${trackedTrends.join(', ')}. The total number of trends should be between 5 and 7.`
    : 'Generate a list of 5 currently trending topics';

  return `
You are a social media trend analysis engine. Your task is to generate a list of currently trending topics ${countryContext} ${platformContext}${categoryContext}.
${trackingContext}
For each topic, provide a plausible-sounding name (like a hashtag), a one-sentence summary, a realistic "posts per minute" volume (between 500 and 20,000), a sentiment ('Positive', 'Neutral', or 'Negative'), a sentiment score (an integer from 0 for very negative to 100 for very positive, with 50 being neutral), a plausible URL to the trend on a social media site (e.g., https://x.com/search?q=HASHTAG), and a small change value (between -500 and +500) indicating its recent momentum. 
Ensure the output is a valid JSON array of trend objects matching the provided schema. Do not include any markdown formatting or the \`\`\`json wrapper. Avoid duplicating trends.
`;
};

export const fetchSocialTrends = async (platform: Platform, category: Category, country: Country, region: Region, trackedTrends: string[]): Promise<Trend[]> => {
  try {
    const prompt = createPrompt(platform, category, country, region, trackedTrends);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.9,
      },
    });

    const jsonText = response.text.trim();
    const trends: Trend[] = JSON.parse(jsonText);
    
    // Sort by volume descending for initial display
    return trends.sort((a, b) => b.volume - a.volume);
    
  } catch (error) {
    console.error("Error fetching or parsing social trends:", error);

    // Check for rate limit error from Gemini API
    if (error instanceof Error && error.message) {
      try {
        // The error from the SDK might contain a JSON string with details
        const apiError = JSON.parse(error.message);
        if (apiError?.error?.status === 'RESOURCE_EXHAUSTED' || apiError?.error?.code === 429) {
          throw new Error("API request limit reached. Please wait a moment before refreshing. Automatic updates will resume.");
        }
      } catch (e) {
        // Not a JSON error message, fall through to the generic error.
      }
    }
    
    throw new Error("Failed to get a valid response from the AI model. It might be busy or experiencing issues.");
  }
};