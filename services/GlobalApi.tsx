import axios from "axios";
import OpenAI from "openai";

const axiosClient = axios.create({
  baseURL: "http://192.168.0.106:1337/api",
  headers: {
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_STRAPI_API_KEY}`,
  },
});

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.EXPO_PUBLIC_OPENROUTER_API_KEY,
});

const BASE_URL = "https://cookmasterimage-server.onrender.com/api";
const RecipeImageApi = axios.create({
  baseURL: BASE_URL,
});

const GetUserByEmail = (email: string) =>
  axiosClient.get("/user-lists?filters[email][$eq]=" + email);
const CreateNewUser = (data: any) =>
  axiosClient.post("/user-lists", { data: data });
const GetCategories = () => axiosClient.get("/categories?populate=*");
const CreateNewRecipe = (data: any) =>
  axiosClient.post("/recipes", { data: data });
const UpdateUser = (uid: any, data: any) =>
  axiosClient.put("/user-lists/" + uid, { data: data });

const AiModel = async (prompt: string) =>
  await openai.chat.completions.create({
    model: "google/gemini-2.0-flash-001",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

export default {
  GetUserByEmail,
  CreateNewUser,
  GetCategories,
  AiModel,
  RecipeImageApi,
  CreateNewRecipe,
  UpdateUser,
};
