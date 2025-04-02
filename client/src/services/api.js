import axios from "axios";

export const getDefaultRecommendations = async(books) => {
  try {
    const response = await axios.post("http://localhost:5000/recommend", {
      books, 
      top_k: 5,
    });
    return response.data.recommendations;
  } catch(error) {
      throw new Error("Failed to send preferences");
  }
};

export const getDemographicRecommendations = async ({
  minAge,
  maxAge,
  country,
}) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/recommend_by_demographics",
      {
        age_range: [minAge, maxAge], // Sends as [min, max] array
        country: country, // Country string
        top_k: 10, // Optional: number of results
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.recommendations; // Returns the recommendations array
  } catch (error) {
    throw new Error(
      "Failed to fetch demographic recommendations: " + error.message
    );
  }
};