// controllers/AuthController.js
const bcrypt = require("bcrypt");
const UserModel = require("../models/UserModel.js");
const jwt = require("jsonwebtoken");

/** Middleware for verifying user */

// Registering a new user
const clientID = "223799229324-6ue35s4ggqsdj7bct08qefaqbr280fig.apps.googleusercontent.com"


const express = require('express');
const { OAuth2Client } = require('google-auth-library');
 
const client = new OAuth2Client(clientID);

exports.googleLogin = async function (req, res) {
  const { idToken } = req.body;

  try {
    // Verify the token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: clientID,
    });
    const payload = ticket.getPayload();

    // Check if user exists in your DB
    let user = await UserModel.findOne({ email: payload.email });
    if (!user) {
      // If user doesn't exist, create a new user
      user = new User({
        firstname,
        lastname,
        email: payload.email,
        avatar: payload.picture,
        googleId: payload.sub,  
      });
      await user.save()
    }

     
    // Send the user data and token back to the frontend
    res.json({ msg: "User Registered Successfully", user: user });
  } catch (error) {
    console.error("Error verifying Google ID token:", error);
    res.status(401).json({ message: "Invalid Google token" });
  }
}

 

exports.register = async function (req, res) {
  try {
    const { firstname, lastname, email, password, description, wallet } =
      req.body;

    console.log(req.body);
    if (!firstname || !lastname || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields." });
    }

    // Check for existing email
    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Please use a unique email." });
    }

    // Create a new user instance with plain password
    const user = new UserModel({
      firstname,
      lastname,
      email,
      password, // Password will be hashed by pre-save middleware
      description,
      wallet,
    });

    // Save the user to the database (password will be hashed automatically)
    const result = await user.save();

    // Prepare user data to send in response (exclude password)
    const userData = {
      _id: result._id,
      firstname: result.firstname,
      lastname: result.lastname,
      email: result.email,
      description: result.description,
      wallet: result.wallet,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };

    res
      .status(201)
      .json({ msg: "User Registered Successfully", user: userData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

// Login Users
exports.login = async function (req, res) {
  const { email, password } = req.body;

  try {
    // Validate required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields." });
    }

    // Find user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User does not exist." });
    }

    // Compare password using the comparePassword method
    const passwordIsValid = await user.comparePassword(password);

    if (!passwordIsValid) {
      return res.status(400).json({ error: "Wrong password." });
    }

    // // Generate JWT token
    // const token = jwt.sign(
    //   {
    //     userId: user._id,
    //     email: user.email
    //   },
    //   process.env.JWT_SECRET,
    //   { expiresIn: '24h' }
    // );

    return res.status(200).json({ message: "Login Successful", user: user });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Login failed.", message: error.message });
  }
};

// Update user information
// Controller for updating user data
exports.updateUser = async (req, res) => {
  try {
    const { userId, skills, description } = req.body;

    // Find the user by their ID
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update description
    if (description !== undefined) {
      user.description = description;
    }

    // Handle skills update (overwrite or merge depending on frontend logic)
    if (skills) {
      user.skills = skills; // This will overwrite the entire skills array. Handle accordingly from the frontend
    }

    // Save updated user data
    const updatedUser = await user.save();

    // Send updated user info back to the frontend
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUser = async function (req, res) {
  try {
    const { applicantIds } = req.body; // Array of applicant IDs from the frontend

    // Find all users whose IDs are in the applicantIds array
    const applicants = await UserModel.find({
      _id: { $in: applicantIds },
    }).select("-password");

    if (!applicants || applicants.length === 0) {
      return res.status(404).json({ message: "No applicants found" });
    }

    return res.status(200).json({ applicants });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching applicants." });
  }
};

exports.getProfile = async function (req, res) {
  const { profileId } = req.body; // Extract the ID from the route parameters

  try {
    // Find the user by their ID
    const user = await UserModel.findById(profileId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

 

exports.cancelApplication = async function (req, res) {
  try {
    const { applicantId, jobId } = req.body;  

    
    const user = await UserModel.findById(applicantId);

    if (!user) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    
    const existingOrder = user.orders.find((order) => order.id === jobId);

    if (!existingOrder) {
      return res
        .status(400)
        .json({ message: "Job not found in user's orders" });
    }

    
    user.orders = user.orders.filter((order) => order.id.toString() !== jobId);

    await user.save();

    res.status(200).json({
      message: "Application canceled and job removed from user's orders",
      user,
    });
  } catch (error) {
    console.error("Error canceling application:", error);
    res.status(500).json({ message: "Server error canceling application" });
  }
};



exports.acceptApplication = async function (req, res) {
  try {
    const { applicantId, jobId } = req.body;

    
    const user = await UserModel.findById(applicantId);

    if (!user) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    
    const existingOrder = user.orders.find((order) => order.id === jobId);

    if (existingOrder) {
      return res.status(400).json({
        message: "Application has already been accepted for this job",
      });
    }

    
    user.orders.push({ id: jobId, completedStatus: false });

    await user.save();

    res.status(200).json({
      message: "Application accepted and job added to user's orders",
      user,
    });
  } catch (error) {
    console.error("Error accepting application:", error);
    res.status(500).json({ message: "Server error accepting application" });
  }
};

exports.updateOrder = async function (req, res) {
  const { userId, orders } = req.body;

  try {
     
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

     
    user.orders = orders;

    
    await user.save();

    return res
      .status(200)
      .json({ message: "Order updated successfully", orders: user.orders });
  } catch (error) {
    console.error("Error updating order:", error);
    return res
      .status(500)
      .json({ message: "Failed to update the order", error });
  }
};

exports.saveReview = async function (req, res) {
  const { applicantId, rating, feedback } = req.body;

  try {
   
    await UserModel.findByIdAndUpdate(applicantId, {
      $push: {
        reviews: { rating, feedback },
      },
    });
    res.status(200).json({ message: "Review saved successfully" });
  } catch (error) {
    console.error("Error saving review:", error);
    res.status(500).json({ message: "Failed to save review" });
  }
};
