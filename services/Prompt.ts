const GENERATE_RECIPE_OPTION_PROMPT =
  ": Depends on user instruction, create 3 different Recipe variants with Recipe Name (with Emoji), a 2-line description, and a main ingredient list in JSON format with fields: recipeName, description, ingredients (without size) only.";

const GENERATE_COMPLETE_RECIPE_PROMPT =
  "- As per recipe Name and Description, give me all the ingredients as `ingredient` and give the emoji icons for each ingredients as `ingredient`,give the each quantity as `quantity`, and give the detailed step-by-step instructions for make this as `steps`. " +
  "Also give the total calories of this recipe as `calories` (only number),give the take time to cook as `cookTime`,give the number of servings of this recipe as `serveTo`, and give a realistic image text prompt as `imagePrompt`. And also Give me category List for recipe from[Breakfast,Lunch,Dinner,Salad,Dessert,Fastfood,Drink,Cake] as category" +
  "Give me the response in JSON format only.";

export { GENERATE_RECIPE_OPTION_PROMPT, GENERATE_COMPLETE_RECIPE_PROMPT };
