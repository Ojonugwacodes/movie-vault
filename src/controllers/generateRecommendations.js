import { generateRecommendations } from "../services/recommendationService.js";

async function getRecommendations(req, res) {
    try {
        const recommendations = await generateRecommendations(req.user.id);

        res.status(200).json({
            status: "success",
            data: recommendations
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}
export {getRecommendations}