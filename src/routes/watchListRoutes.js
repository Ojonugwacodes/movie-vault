import express from 'express';
import {searchMovie, addToWatchlist, removeFromWatchlist, updateWatchlistItem} from '../controllers/watchListController.js';
import {authMiddleware} from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { addToWatchlistSchema, updateWatchlistSchema } from '../validators/watchlistValidators.js';
const router = express.Router();

router.use(authMiddleware); // Apply authentication middleware to all routes in this router

// Add to watchlist
router.get("/search", searchMovie)

router.post("/", validateRequest(addToWatchlistSchema), addToWatchlist)

// Remove from watchlist
router.delete("/:id", removeFromWatchlist)

// Update watchlist item
router.put("/:id", validateRequest(updateWatchlistSchema), updateWatchlistItem)

export default router;