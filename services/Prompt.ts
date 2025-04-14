const GENERATE_RECIPE_OPTION_PROMPT =
  ": Depends on user instruction, create 3 different Recipe variants with Recipe Name (with Emoji), a 2-line description, and a main ingredient list in JSON format with fields: recipeName, description, ingredients (without size) only.";

const GENERATE_COMPLETE_RECIPE_PROMPT =
  "- As per recipe Name and Description, give me all the ingredients as `ingredient`, emoji icons for each as `icon`, quantity as `quantity`, and detailed step-by-step instructions as `steps`. " +
  "Also include total calories as `calories` (only number), minutes to cook as `cookTime`, number of servings as `serveTo`, and a realistic image text prompt as `imagePrompt`. " +
  "Give me the response in JSON format only.";

export { GENERATE_RECIPE_OPTION_PROMPT, GENERATE_COMPLETE_RECIPE_PROMPT };
