import React, { useState } from "react";
import { getDemographicRecommendations } from "../services/api";
import BookList from "./BookList";

const DemographicRecommendations = () => {
  const [ageRange, setAgeRange] = useState([18, 35]);
  const [country, setCountry] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAgeChange = (index, value) => {
    const newAgeRange = [...ageRange];
    newAgeRange[index] = parseInt(value) || 0;
    setAgeRange(newAgeRange);
  };

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const data = await getDemographicRecommendations({
        minAge: Math.min(...ageRange),
        maxAge: Math.max(...ageRange),
        country: country.trim(),
      });
      setRecommendations(data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Demographic Recommendations
      </h2>
      <p className="mb-4">
        Get recommendations based on age and country preferences.
      </p>

      <div className="mb-4">
        <div className="mb-4">
          <label className="block font-medium mb-2">Age Range</label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">
                Min Age
              </label>
              <input
                type="number"
                min="5"
                max="100"
                value={ageRange[0]}
                onChange={(e) => handleAgeChange(0, e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">
                Max Age
              </label>
              <input
                type="number"
                min="5"
                max="100"
                value={ageRange[1]}
                onChange={(e) => handleAgeChange(1, e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-2">Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter country (e.g., USA, UK)"
          />
        </div>
      </div>

      <button
        onClick={fetchRecommendations}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4 disabled:bg-blue-300"
      >
        {loading ? "Loading..." : "Get Recommendations"}
      </button>

      {recommendations.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">
            Recommended for {ageRange[0]}-{ageRange[1]} year olds{" "}
            {country && `in ${country}`}:
          </h3>
          <BookList books={recommendations} />
        </div>
      )}
    </div>
  );
};

export default DemographicRecommendations;
