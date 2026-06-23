import { prisma} from '../config/db.js';
import { searchMovies } from '../services/tmdbService.js';

const searchMovie = async (req, res) => {
    try {
        const { query } = req.query;
        const movies = await searchMovies(query);
        res.status(200).json({
            status: "success",
            data: movies
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to search movies" });
    }
}

const addToWatchlist = async (req, res) => {
    try {
        const {tmdbId, title, status, rating, notes} = req.body;

        //Check if movie is already in watchlist
        const existingInWatchList = await prisma.watchlistItem.findUnique({
            where: {
                userId_tmdbId: {
                    userId: req.user.id,
                    tmdbId: tmdbId
                }
            }
        });
        if (existingInWatchList) {
            return res.status(400).json({ error: "Movie already in watchlist" });
        }

        //Add to watchlist
        const watchListItem = await prisma.watchlistItem.create({
            data: {
                userId: req.user.id,
                tmdbId,
                title,
                status : status || "PLANNED",
                rating,
                notes
            }
        });
        res.status(201).json({
            status: "success",
            data: [
                watchListItem
            ]
        })
    } catch (error) {
        res.status(500).json({ error: "Failed to add movie to watchlist" });
    }
};

const updateWatchlistItem = async (req, res) => {
  try {
    const { status, rating, notes } = req.body;

    // Find watchlist item and verify ownership
    const watchlistItem = await prisma.watchlistItem.findUnique({
      where: { id: req.params.id },
    });

    if (!watchlistItem) {
      return res.status(404).json({ error: "Watchlist item not found" });
    }

    // Ensure only owner can update
    if (watchlistItem.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not allowed to update this watchlist item" });
    }

    // Build update data
    const updateData = {};
    if (status !== undefined) updateData.status = status.toUpperCase();
    if (rating !== undefined) updateData.rating = rating;
    if (notes !== undefined) updateData.notes = notes;

    // Update watchlist item
    const updatedItem = await prisma.watchlistItem.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.status(200).json({
      status: "success",
      data: {
        watchlistItem: updatedItem,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update watchlist item" });
  }
};

/**
 * Remove movie from watchlist
 * Deletes watchlist item
 * Ensures only owner can delete
 * Requires protect middleware
 */
const removeFromWatchlist = async (req, res) => {
  try {
    // Find watchlist item and verify ownership
    const watchlistItem = await prisma.watchlistItem.findUnique({
      where: { id: req.params.id },
    });

    if (!watchlistItem) {
      return res.status(404).json({ error: "Watchlist item not found" });
    }

    // Ensure only owner can delete
    if (watchlistItem.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not allowed to update this watchlist item" });
    }

    await prisma.watchlistItem.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({
      status: "success",
      message: "Movie removed from watchlist",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove movie from watchlist" });
  }
};

export { searchMovie, addToWatchlist, updateWatchlistItem, removeFromWatchlist };