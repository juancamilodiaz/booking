const { Sport } = require('../models/sportModel');

exports.getSports = async (req, res) => {
    try {
      // Find all sports from the database
      const sports = await Sport.findAll();
  
      return res.status(200).json({ sports });
    } catch (error) {
      console.error('Error fetching sports', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

exports.createSport = async (req, res) => {
  try {
    const { sport_name } = req.body;

    // Check if the sport already exists
    const existingSport = await Sport.findOne({ where: { sport_name } });
    if (existingSport) {
      return res.status(409).json({ error: 'Sport already exists' });
    }

    // Create the sport
    const sport = await Sport.create({ sport_name });

    return res.status(201).json({ message: 'Sport created successfully', sport });
  } catch (error) {
    console.error('Error creating sport', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateSport = async (req, res) => {
    try {
      const { sportId } = req.params;
      const { sport_name } = req.body;
  
      // Check if the sport exists
      const existingSport = await Sport.findByPk(sportId);
      if (!existingSport) {
        return res.status(404).json({ error: 'Sport not found' });
      }
  
      // Update the sport
      await existingSport.update({ sport_name });
  
      return res.status(200).json({ message: 'Sport updated successfully', sport: existingSport });
    } catch (error) {
      console.error('Error updating sport', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  exports.deleteSport = async (req, res) => {
    try {
      const { sport_name } = req.params;
  
      // Check if the sport exists
      const existingSport = await Sport.findOne({ where: { sport_name } })
      if (!existingSport) {
        return res.status(404).json({ error: 'Sport not found' });
      }
  
      // Delete the sport
      await existingSport.destroy();
  
      return res.status(200).json({ message: 'Sport deleted successfully' });
    } catch (error) {
      console.error('Error deleting sport', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  