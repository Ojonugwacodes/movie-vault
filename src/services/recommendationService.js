import { analyzePreferences } from "./geminiService.js";
import { getPopularMovies } from "./tmdbService.js";

import { prisma } from "../config/db.js";

async function getUserWatchHistory(userId) {
  const watchHistory = await prisma.watchlistItem.findMany({
    where: {
      userId,
    },
  });

  return watchHistory;
}
const candidates = await getPopularMovies();
const movieCandidates = candidates.map(movie => ({
    title: movie.title,
    overview: movie.overview,
    rating: movie.vote_average
}));
async function generateRecommendations(userId) {
    const watchHistory = await getUserWatchHistory(userId);

    if (watchHistory.length === 0) {
        return {
            recommendations: [],
            message: "Add movies to your watchlist to receive recommendations."
        };
    }
    const likedMovies = watchHistory
        .filter(movie =>
            movie.status === "COMPLETED" &&
            (movie.rating === null || movie.rating >= 4)
        )
        .map(movie =>
            `${movie.title} (${movie.rating ?? "unrated"})`
        );
    const dislikedMovies = watchHistory
        .filter(movie =>
            movie.status === "DROPPED" ||
            (movie.rating !== null && movie.rating <= 2)
        )
        .map(movie => movie.title);
    const notes = watchHistory
        .filter(movie => movie.notes)
        .map(movie => movie.notes);
    const prompt = `
    A user has watched the following movies:

    Liked movies:
    ${likedMovies.join("\n")}

    Disliked movies:
    ${dislikedMovies.join("\n")}

    User notes:
    ${notes.join("\n")}

    Candidate movies:

    ${JSON.stringify(movieCandidates)}

    Recommend 10 movies that match this user's preferences.

    Avoid movies similar to disliked ones.

    Return only valid JSON in this format:

    {
        "recommendations": [
            {
            "title": "",
            "reason": ""
            }
        ]
    }
    `;
    const response = await analyzePreferences(prompt);
    const recommendations = response.recommendations.map(rec => {
    const movie = candidates.find(
        candidate => candidate.title === rec.title
    );

    return {
        id: movie?.id,
        title: rec.title,
        overview: movie?.overview,
        poster: movie?.poster_path,
        releaseDate: movie?.release_date,
        reason: rec.reason
    };
});
    return recommendations;
}

export {generateRecommendations, getUserWatchHistory}