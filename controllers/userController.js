const bcrypt = require('bcrypt');
const { User } = require('../models/userModel');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({
      where: {
        email
      },
    });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Authentication successful, store user information in the session
    req.session.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      // Add any other user data you want to store in the session
    };

    return res.status(200).json({ message: 'Login successful', user: user });
  } catch (error) {
    console.error('Error during login', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.logout = async (req, res) => {
  try {
    // Destroy the session to log out the user
    req.session.destroy((err) => {
      if (err) {
        console.error('Error logging out:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      return res.status(200).json({ message: 'Logged out successfully' });
    });
  } catch (error) {
    console.error('Error during logout', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password, name, phone, house_number, condo_name } = req.body;

    // Check if the user already exists
    console.log(email);
    const existingUser = await User.findOne({
      where: {
        email
      },
    });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the user
    const newUser = await User.create({
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

exports.sessionStatus = (req, res) => {
  console.log(req.session.user);
  if (req.session.user) {
    // User is logged in, send session status as true
    res.status(200).json({ sessionValid: true });
  } else {
    // User is not logged in, send session status as false
    res.status(200).json({ sessionValid: false });
  }
};