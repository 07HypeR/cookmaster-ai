import { create } from "zustand";
import GlobalApi from "@/services/GlobalApi";

interface SavedRecipesStore {
  savedRecipes: string[];
  fetchSavedRecipes: (userEmail: string) => Promise<void>;
  isRecipeSaved: (id: string) => boolean;
  saveRecipe: (userEmail: string, recipeDocId: string) => Promise<void>;
  removeRecipe: (userEmail: string, recipeDocId: string) => Promise<void>;
}

export const useSavedRecipesStore = create<SavedRecipesStore>((set, get) => ({
  savedRecipes: [],

  fetchSavedRecipes: async (userEmail) => {
    const res = await GlobalApi.SavedRecipeList(userEmail);
    const ids = res.data?.data?.map((item: any) => item.attributes.recipeDocId);
    set({ savedRecipes: ids || [] });
  },

  isRecipeSaved: (id) => {
    return get().savedRecipes.includes(id);
  },

  saveRecipe: async (userEmail, recipeDocId) => {
    await GlobalApi.SaveUserFavRecipe({ userEmail, recipeDocId });
    set((state) => ({
      savedRecipes: [...state.savedRecipes, recipeDocId],
    }));
  },

  removeRecipe: async (userEmail, recipeDocId) => {
    await GlobalApi.RemoveUserFavRecipe(userEmail, recipeDocId);
    set((state) => ({
      savedRecipes: state.savedRecipes.filter((id) => id !== recipeDocId),
    }));
  },
}));
