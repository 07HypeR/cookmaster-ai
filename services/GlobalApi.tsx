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
            recipe_name: {
              type: Type.STRING,
              description: "Name of the recipe",
              nullable: false,
            },
            ingredients: {
              type: Type.STRING,
              description: "Ingredients of the recipe",
              nullable: false,
            },
          },
          required: ["recipe_name", "ingredients"],
          propertyOrdering: ["recipe_name", "ingredients"],
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
