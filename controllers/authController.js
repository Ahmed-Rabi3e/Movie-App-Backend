import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from "../models/userModel.js";

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token, userId: user._id, username: user.username, msg: "User Created Succussfuly" });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User Not Exists' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, userId: user._id, username: user.username });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


export const getUserProfile = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Extract token from Bearer

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select('-password');

        res.json(user);
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};
