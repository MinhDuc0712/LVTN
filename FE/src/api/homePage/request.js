import axios from "../axios"; 

export const getCategoriesAPI = async () => {
  try {
    const response = await axios.get("/categories");
    return response;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
