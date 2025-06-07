import axios from "axios";

// Create axios instance
const axiosClient = axios.create({
  baseURL: "https://cookmaster-ai-server.onrender.com/api",
  headers: {
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_STRAPI_API_KEY}`,
  },
});

const BASE_URL = "https://cookmasterimage-server.onrender.com/api";
const RecipeImageApi = axios.create({
  baseURL: BASE_URL,
});

const GetUserByEmail = (email: string) =>
  axiosClient.get("/user-lists?filters[email][$eq]=" + email);
const CreateNewUser = async (data: {
  email: string;
  name: string;
  picture: string;
}) => axiosClient.post("/user-lists", { data });
const GetCategories = () => axiosClient.get("/categories?populate=*");
const CreateNewRecipe = (data: any) =>
  axiosClient.post("/recipes", { data: data });
const UpdateUser = (uid: any, data: any) =>
  axiosClient.put("/user-lists/" + uid, { data: data });
const GetRecipeByCategory = (category: string) =>
  axiosClient.get("/recipes?filters[category][$containsi]=" + category);
const GetAllRecipeList = () => axiosClient.get("/recipes?sort[0]=id:desc");
const GetAllRecipesByLimit = (limit: number) =>
  axiosClient.get(
    "/recipes?sort[0]=id:desc&pagination[start]=1&pagination[limit]=" + limit
  );
const GetUserCreatedRecipe = (userEmail: string) =>
  axiosClient.get("/recipes?filters[userEmail][$eq]=" + userEmail);
const SaveUserFavRecipe = (data: any) =>
  axiosClient.post("/user-favorites", { data: data });
const SavedRecipeList = (userEmail: string) =>
  axiosClient.get("/user-favorites?filters[userEmail][$eq]=" + userEmail);
const GetSavedRecipes = (query: string) => axiosClient.get("/recipes?" + query);
const RemoveUserFavRecipe = async (userEmail: string, recipeDocId: string) => {
  try {
    // Step 1: Fetch the favorite entry
    const res = await axiosClient.get(
      `/user-favorites?filters[userEmail][$eq]=${userEmail}&filters[recipeDocId][$eq]=${recipeDocId}`
    );

    const favItem = res.data?.data?.[0]; // May be undefined

    if (!favItem || !favItem.id) {
      throw new Error("Favorite recipe not found in backend.");
    }

    // Step 2: Delete it by ID
    return await axiosClient.delete(`/user-favorites/:${favItem.id}`);
  } catch (err) {
    console.error("Delete failed:", err);
    throw err;
  }
};

// Gemini AI Model API
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

export const AiModel = async (PROMPT: string) =>
  await axios.post(
    `${GEMINI_API_URL}?key=${API_KEY}`,
    {
      contents: [
        {
          parts: [{ text: PROMPT }],
        },
      ],
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );

export default {
  GetUserByEmail,
  CreateNewUser,
  GetCategories,
  AiModel,
  RecipeImageApi,
  CreateNewRecipe,
  UpdateUser,
  GetRecipeByCategory,
  GetAllRecipeList,
  GetAllRecipesByLimit,
  GetUserCreatedRecipe,
  SaveUserFavRecipe,
  SavedRecipeList,
  GetSavedRecipes,
  RemoveUserFavRecipe,
};
