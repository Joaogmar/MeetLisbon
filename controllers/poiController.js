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

module.exports = { getAllPOI, createPOI, deletePOI };