import axios from "axios"
import dotenv from "dotenv"
dotenv.config()

const tmdb = axios.create({
  baseURL: process.env.TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    accept: "application/json"
  }
});

async function searchMovies(query) {
    try {
        const response = await tmdb.get("/search/movie", {
            params: { query }
        });
        return response.data.results;
    } catch (error) {
        console.error("Error searching movies:", error);
        throw error;
    }
}

export { searchMovies }