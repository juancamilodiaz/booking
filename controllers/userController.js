const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');

exports.login = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Authentication successful
    return res.status(200).json({ message: 'Login successful', user: user });
  } catch (error) {
    console.error('Error during login', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password, name, phone, house_number, condo_name } = req.body;

    // Check if the user already exists
    console.log(email);
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the user
    const newUser = await UserModel.create({
      email,
      password: hashedPassword,
      name,
      phone,
      house_number,
      condo_name,
      // You can add more user attributes here if needed
    });

    return res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error during registration', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
