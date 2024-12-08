const POI = require('../models/poiModel');

const getAllPOI = async (req, res) => {
    try {
        const poi = await POI.getAllPOI();
        res.status(200).json(poi);
    } catch (error) {
        console.error('Error fetching poi:', error);
        res.status(500).json({ message: 'Server error. Could not fetch poi.' });
    }
};

const createPOI = async (req, res) => {
    const { location_name, location_address, longitude, latitude, info, image_url } = req.body;

    if (!location_name || !location_address || !longitude || !latitude) {
        return res.status(400).json({ message: 'Missing required fields: location_name, location_address, longitude, latitude.' });
    }

    try {
        const newPOI = await POI.createPOI(
            location_name,
            location_address,
            longitude,
            latitude,
            info,
            image_url
        );
        res.status(201).json(newPOI);
    } catch (error) {
        console.error('Error creating POI:', error);
        res.status(500).json({ message: 'Server error. Could not create POI.' });
    }
};

const deletePOI = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedPOI = await POI.deletePOI(id);

        if (deletedPOI) {
            res.status(200).json({ message: `POI with ID ${id} deleted successfully.`, deletedPOI });
        } else {
            res.status(404).json({ message: `POI with ID ${id} not found.` });
        }
    } catch (error) {
        console.error('Error deleting POI:', error);
        res.status(500).json({ message: 'Server error. Could not delete POI.' });
    }
};

async function favoritePOI(req, res) {
    try {
        const userId = req.user.user_id; // Extract user ID from JWT
        let { poi_id } = req.body;

        console.log('Favorite POI request body:', req.body);
        console.log('Received poi_id:', poi_id);
        console.log('Type of poi_id:', typeof poi_id);

        // Parse poi_id and ensure it's a valid number
        poi_id = parseInt(poi_id, 10);
        console.log('Parsed poi_id:', poi_id);

        if (!poi_id || isNaN(poi_id)) {
            console.error('Error: poi_id is missing or invalid');
            return res.status(400).json({ message: 'Valid poi_id is required' });
        }

        // Check if userId is valid (ensure it's available in req.user)
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Check if the POI is already favorited
        const existingFavorite = await POI.checkFavorite(userId, poi_id);

        if (existingFavorite) {
            // If it's already favorited, remove it (unfavorite)
            await POI.removeFavorite(userId, poi_id);
            console.log('POI unfavorited');
            return res.status(200).json({ message: 'POI unfavorited successfully' });
        } else {
            // If it's not favorited, add it (favorite)
            const favorite = await POI.favoritePOI(userId, poi_id);
            console.log('POI favorited');
            return res.status(201).json({ message: 'POI favorited successfully', favorite });
        }

    } catch (error) {
        console.error('Error favoriting/unfavoriting POI:', error.message);

        // Check if response has already been sent
        if (!res.headersSent) {
            res.status(500).json({ message: 'Error favoriting/unfavoriting POI', error: error.message });
        }
    }
}

// Function to get the favorited POIs
const getFavoritedPOIs = async (req, res) => {
    const user_id = req.user.user_id; // Ensure that user_id is extracted correctly

    console.log('Controller received user_id:', user_id);

    try {
        const favoritedPOIs = await POI.getFavoritedPOIs(user_id);
        res.status(200).json(favoritedPOIs);
    } catch (error) {
        console.error('Error fetching favorited POIs:', error);
        res.status(500).json({ message: 'Server error. Could not fetch favorited POIs.' });
    }
};

// Function to remove a POI from favorites
async function removeFavoritePOI(req, res) {
    try {
        const userId = req.user.user_id; // Extract user ID from the token (fix inconsistency here)
        const { poi_id } = req.params; // Extract poi_id from the URL

        // Parse the poi_id and ensure it's a valid number
        const parsedPoiId = parseInt(poi_id, 10);

        if (!parsedPoiId || isNaN(parsedPoiId)) {
            return res.status(400).json({ message: 'Valid poi_id is required' });
        }

        // Check if userId is valid
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Call the model to remove the favorite
        const removedFavorite = await POI.removeFavorite(userId, parsedPoiId);

        if (removedFavorite) {
            return res.status(200).json({ message: 'POI removed from favorites', removedFavorite });
        } else {
            return res.status(404).json({ message: 'POI not found in favorites' });
        }
    } catch (error) {
        console.error('Error removing favorite POI:', error.message);
        return res.status(500).json({ message: 'Error removing favorite POI', error: error.message });
    }
}

module.exports = { getAllPOI, createPOI, deletePOI, favoritePOI, getFavoritedPOIs, removeFavoritePOI };