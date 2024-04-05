const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel.js');
const jwt = require('jsonwebtoken');
 
 
 /** Middleware for verifying user */
 
 
// Registering a new user
exports.register = async function (req, res) {
  try {
    const { username, address } = req.body;

    // Check for existing username
    const existingUsername = await UserModel.findOne({ username });
    if (existingUsername) {
      throw new Error("Please use a unique username");
    }

    // Check for existing email
    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      throw new Error("Please use a unique email");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
     
    // Create a new user instance
    const user = new UserModel({
      username,
      address
    });
    // Save the user to the database
    const result = await user.save();
    res.status(201).send({ msg: "User Registered Successfully", result });

  
  } catch (error) {
    // Handle errors
    res.status(500).send({ error: error.message || "Internal Server Error" });
  }
};

// Login Users
exports.login = async function (req, res) {
  const { usernameOrEmail, password } = req.body;

  try {
    // Use a single query to find a user by either username or email
    const user = await UserModel.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    });

    if (!user) {
      return res.status(404).json({ error: 'User does not exist' });
    }
    
    const passwordIsValid = await bcrypt.compare(password, user.password);
    
 
    if (!passwordIsValid) {
      return res.status(400).json({ error: 'Wrong password' });
    }
     const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({ message: "Login Successful", token, userId: user._id, username: user.username });
  } catch (error) {
    return res.status(500).json({ error: 'Login failed', message: error.message });
  }
};


 