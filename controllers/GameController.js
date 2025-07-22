const Game = require('../models/Game');

// Create a new game
exports.createGame = async (req, res) => {
  const { name, mealTime, entranceFee, prize, gameControllerId } = req.body;

  try {
    const newGame = new Game({ name, mealTime, entranceFee, prize, gameControllerId });
    await newGame.save();
    res.status(201).json({ message: 'Game created successfully', newGame });
  } catch (error) {
    res.status(500).json({ message: 'Error creating game', error });
  }
};

// Get all games
exports.getGames = async (req, res) => {
  try {
    const games = await Game.find()
      .populate('gameControllerId')
      .populate('winner')
      .populate('participants');
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving games', error });
  }
};

// Update a game
exports.updateGame = async (req, res) => {
  const { gameId } = req.params;
  const updates = req.body;

  try {
    const updatedGame = await Game.findByIdAndUpdate(gameId, updates, { new: true });
    res.status(200).json(updatedGame);
  } catch (error) {
    res.status(500).json({ message: 'Error updating game', error });
  }
};

// Delete a game
exports.deleteGame = async (req, res) => {
  const { gameId } = req.params;

  try {
    await Game.findByIdAndDelete(gameId);
    res.status(200).json({ message: 'Game deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting game', error });
  }
};

// Get a specific game by ID
exports.getGameById = async (req, res) => {
  const { gameId } = req.params;
  try {
    const game = await Game.findById(gameId)
      .populate('prize')
      .populate('winner')
      .populate('participants');
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving game', error });
  }
};

// Get all games managed by a specific controller
exports.getGamesByController = async (req, res) => {
  const { id } = req.params;
  try {
    const games = await Game.find({ gameControllerId: id })
      .populate('prize')
      .populate('winner')
      .populate('participants')
      .sort({ createdAt: -1 });
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving games for controller', error });
  }
};

// Get total revenue for a specific controller
exports.getControllerRevenue = async (req, res) => {
  const { id } = req.params;
  try {
    const games = await Game.find({ gameControllerId: id });
    const totalRevenue = games.reduce((sum, game) => sum + (game.entranceFee || 0), 0);
    res.status(200).json({ totalRevenue });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating revenue for controller', error });
  }
};
