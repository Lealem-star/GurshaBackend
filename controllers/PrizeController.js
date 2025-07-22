const Prize = require('../models/Prize');

// Create a new prize
exports.createPrize = async (req, res) => {
    const { name, amount } = req.body;
    // Get image path if file was uploaded
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const newPrize = new Prize({ name, amount, image });
        await newPrize.save();
        res.status(201).json({ message: 'Prize created successfully', newPrize });
    } catch (error) {
        res.status(500).json({ message: 'Error creating prize', error });
    }
};

// Get all prizes
exports.getPrizes = async (req, res) => {
    try {
        const prizes = await Prize.find();
        res.status(200).json(prizes);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving prizes', error });
    }
};

// Update a prize
exports.updatePrize = async (req, res) => {
    const { prizeId } = req.params;
    const updates = req.body;

    try {
        const updatedPrize = await Prize.findByIdAndUpdate(prizeId, updates, { new: true });
        res.status(200).json(updatedPrize);
    } catch (error) {
        res.status(500).json({ message: 'Error updating prize', error });
    }
};

// Delete a prize
exports.deletePrize = async (req, res) => {
    const { prizeId } = req.params;

    try {
        await Prize.findByIdAndDelete(prizeId);
        res.status(200).json({ message: 'Prize deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting prize', error });
    }
};
