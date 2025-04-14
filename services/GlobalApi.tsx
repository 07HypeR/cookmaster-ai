import axios from "axios";
import { GoogleGenAI, Type } from "@google/genai";

const axiosClient = axios.create({
  baseURL: "http://192.168.0.102:1337/api",
  headers: {
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_STRAPI_API_KEY}`,
  },
});

const ai = new GoogleGenAI({ apiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY });

const GetUserByEmail = (email: string) =>
  axiosClient.get("/user-lists?filters[email][$eq]=" + email);
const CreateNewUser = (data: any) =>
  axiosClient.post("/user-lists", { data: data });
const GetCategories = () => axiosClient.get("/categories?populate=*");

const AiModel = async (prompt: string) =>
  await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            recipeName: {
              type: Type.STRING,
              description: "Name of the recipe",
              nullable: false,
            },
            ingredients: {
              type: Type.STRING,
              description: "Ingredients of the recipe",
              nullable: false,
            },
            description: {
              type: Type.STRING,
              description: "Description of the recipe",
              nullable: false,
            },
            quantity: {
              type: Type.STRING,
              description: "Quantity of the recipe",
              nullable: false,
            },
            steps: {
              type: Type.STRING,
              description: "Steps of the recipe",
              nullable: false,
            },
            calories: {
              type: Type.STRING,
              description: "Calories of the recipe",
              nullable: false,
            },
            cookTime: {
              type: Type.STRING,
              description: "CookTime of the recipe",
              nullable: false,
            },
            serveTo: {
              type: Type.STRING,
              description: "Serve of the recipe",
              nullable: false,
            },
            imagePrompt: {
              type: Type.STRING,
              description: "Image Generation Prompt of the recipe",
              nullable: false,
            },
          },
          required: [
            "recipeName",
            "ingredients",
            "description",
            "quantity",
            "steps",
            "calories",
            "cookTime",
            "serveTo",
            "imagePrompt",
          ],
          propertyOrdering: [
            "recipeName",
            "ingredients",
            "description",
            "quantity",
            "steps",
            "calories",
            "cookTime",
            "serveTo",
            "imagePrompt",
          ],
        },
      },
    },
  });

export default {
  GetUserByEmail,
  CreateNewUser,
  GetCategories,
  AiModel,
};
