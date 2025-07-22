const express = require('express');
const router = express.Router();
const prizeController = require('../controllers/PrizeController');
const { upload, handleUploadError } = require('../middleware/uploadMiddleware');

// Prize routes
router.post('/prizes', upload.single('image'), handleUploadError, prizeController.createPrize); // Create a new prize
router.get('/prizes', prizeController.getPrizes); // Get all prizes
router.put('/prizes/:prizeId', prizeController.updatePrize); // Update a prize
router.delete('/prizes/:prizeId', prizeController.deletePrize); // Delete a prize

module.exports = router;
