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
        const userId = req.user.userId; // Extract user ID from JWT (ensure this is correct)
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

        console.log('Calling favoritePOI with:', { userId, poi_id });

        // Call the model to handle favoriting the POI
        const favorite = await POI.favoritePOI(userId, poi_id);
        console.log('Favorite POI result:', favorite);

        // Send the success response
        res.status(201).json({ message: 'POI favorited successfully', favorite });

    } catch (error) {
        console.error('Error favoriting POI:', error.message);

        // Check if response has already been sent
        if (!res.headersSent) {
            res.status(500).json({ message: 'Error favoriting POI', error: error.message });
        }
    }
}

const getFavoritedPOIs = async (req, res) => {
    const user_id = req.user.user_id; 

    console.log('Controller received user_id:', user_id);

    try {
        const favoritedPOIs = await POI.getFavoritedPOIs(user_id);
        res.status(200).json(favoritedPOIs);
    } catch (error) {
        console.error('Error fetching favorited POIs:', error);
        res.status(500).json({ message: 'Server error. Could not fetch favorited POIs.' });
    }
};


async function removeFavoritePOI(req, res) {
    try {
        const userId = req.user.userId; // Extract user ID from the token
        const { poi_id } = req.params; // Extract poi_id from the URL

        if (!poi_id || isNaN(parseInt(poi_id, 10))) {
            return res.status(400).json({ message: 'Valid poi_id is required' });
        }

        // Call the model to remove the favorite
        const removedFavorite = await POI.removeFavorite(userId, parseInt(poi_id, 10));

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