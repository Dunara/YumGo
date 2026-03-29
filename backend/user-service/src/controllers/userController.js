const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Debug flag - set to true for detailed logs
const DEBUG = true;

// Helper function for debug logs
const debugLog = (functionName, message, data = null) => {
    if (DEBUG) {
        console.log(`[DEBUG] ${functionName}: ${message}`);
        if (data) {
            console.log(`[DEBUG] ${functionName} Data:`, JSON.stringify(data, null, 2));
        }
    }
};

// Generate unique user_id
const generateUserId = async () => {
    debugLog('generateUserId', 'Starting user_id generation');
    try {
        const count = await User.countDocuments();
        debugLog('generateUserId', `Current user count: ${count}`);
        const userId = `USR${String(count + 1).padStart(4, '0')}`;
        debugLog('generateUserId', `Generated user_id: ${userId}`);
        return userId;
    } catch (error) {
        console.error(`[ERROR] generateUserId: ${error.message}`);
        throw error;
    }
};

// Generate JWT Token
const generateToken = (userId, email) => {
    debugLog('generateToken', `Generating token for userId: ${userId}, email: ${email}`);
    try {
        const token = jwt.sign(
            { userId, email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        debugLog('generateToken', 'Token generated successfully');
        return token;
    } catch (error) {
        console.error(`[ERROR] generateToken: ${error.message}`);
        throw error;
    }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res) => {
    console.log('\n=========================================');
    console.log('[INFO] REGISTER USER - Request received');
    console.log('=========================================');
    
    try {
        const { name, email, password, address } = req.body;
        
        // Log request body (excluding password for security)
        debugLog('registerUser', 'Request body received', {
            name,
            email,
            address,
            passwordProvided: !!password
        });

        // Validate required fields
        const missingFields = [];
        if (!name) missingFields.push('name');
        if (!email) missingFields.push('email');
        if (!password) missingFields.push('password');
        if (!address) missingFields.push('address');
        
        if (missingFields.length > 0) {
            console.log(`[WARN] registerUser: Missing required fields: ${missingFields.join(', ')}`);
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Check if user already exists
        debugLog('registerUser', `Checking if user exists with email: ${email}`);
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            console.log(`[WARN] registerUser: User already exists with email: ${email}`);
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }
        debugLog('registerUser', 'Email is available - user does not exist');

        // Generate user_id
        const user_id = await generateUserId();
        debugLog('registerUser', `Assigned user_id: ${user_id}`);

        // Create user
        console.log('[INFO] registerUser: Creating new user in database...');
        const user = await User.create({
            user_id,
            name,
            email,
            password,
            address
        });
        
        console.log(`[SUCCESS] registerUser: User created with ID: ${user.user_id}`);

        // Generate token
        const token = generateToken(user.user_id, user.email);

        // Prepare response data (excluding password)
        const responseData = {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            address: user.address,
            token
        };
        
        debugLog('registerUser', 'Response data prepared', responseData);

        console.log('=========================================');
        console.log('[SUCCESS] REGISTER USER - Complete');
        console.log('=========================================\n');

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: responseData
        });
        
    } catch (error) {
        console.error('\n=========================================');
        console.error('[ERROR] REGISTER USER - Failed');
        console.error('=========================================');
        console.error(`Error Name: ${error.name}`);
        console.error(`Error Message: ${error.message}`);
        
        // Handle MongoDB duplicate key error
        if (error.code === 11000) {
            console.error('[ERROR] Duplicate key error - likely duplicate email or user_id');
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                message: `Duplicate value for ${field}. Please use a different ${field}.`
            });
        }
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            console.error('[ERROR] Validation errors:', validationErrors);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: validationErrors
            });
        }
        
        console.error(`Stack trace: ${error.stack}`);
        console.log('=========================================\n');
        
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
    console.log('\n=========================================');
    console.log('[INFO] LOGIN USER - Request received');
    console.log('=========================================');
    
    try {
        const { email, password } = req.body;
        
        // Log request (excluding password for security)
        debugLog('loginUser', 'Login attempt', { email, passwordProvided: !!password });

        // Validate required fields
        if (!email || !password) {
            console.log('[WARN] loginUser: Missing email or password');
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Check if user exists
        debugLog('loginUser', `Searching for user with email: ${email}`);
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log(`[WARN] loginUser: No user found with email: ${email}`);
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        debugLog('loginUser', `User found: ${user.user_id} - ${user.name}`);

        // Check password
        debugLog('loginUser', 'Verifying password...');
        const isPasswordValid = await user.comparePassword(password);
        
        if (!isPasswordValid) {
            console.log(`[WARN] loginUser: Invalid password attempt for user: ${user.email}`);
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        debugLog('loginUser', 'Password verified successfully');

        // Generate token
        const token = generateToken(user.user_id, user.email);

        // Prepare response data
        const responseData = {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            address: user.address,
            token
        };
        
        console.log(`[SUCCESS] loginUser: User logged in successfully: ${user.user_id}`);
        console.log('=========================================');
        console.log('[SUCCESS] LOGIN USER - Complete');
        console.log('=========================================\n');

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: responseData
        });
        
    } catch (error) {
        console.error('\n=========================================');
        console.error('[ERROR] LOGIN USER - Failed');
        console.error('=========================================');
        console.error(`Error Message: ${error.message}`);
        console.error(`Stack trace: ${error.stack}`);
        console.log('=========================================\n');
        
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get user details by ID
// @route   GET /api/users/:id
// @access  Public
exports.getUserById = async (req, res) => {
    console.log('\n=========================================');
    console.log('[INFO] GET USER BY ID - Request received');
    console.log('=========================================');
    
    try {
        const { id } = req.params;
        console.log(`[INFO] getUserById: Searching for user_id: ${id}`);

        if (!id) {
            console.log('[WARN] getUserById: No user ID provided');
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        debugLog('getUserById', `Querying database for user_id: ${id}`);
        const user = await User.findOne({ user_id: id }).select('-password');
        
        if (!user) {
            console.log(`[WARN] getUserById: User not found with ID: ${id}`);
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        debugLog('getUserById', 'User found', { user_id: user.user_id, name: user.name });
        console.log(`[SUCCESS] getUserById: User retrieved - ${user.user_id}`);
        console.log('=========================================\n');

        res.status(200).json({
            success: true,
            data: user
        });
        
    } catch (error) {
        console.error('\n=========================================');
        console.error('[ERROR] GET USER BY ID - Failed');
        console.error('=========================================');
        console.error(`Error Message: ${error.message}`);
        console.error(`Stack trace: ${error.stack}`);
        console.log('=========================================\n');
        
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Update user details
// @route   PUT /api/users/:id
// @access  Public
exports.updateUser = async (req, res) => {
    console.log('\n=========================================');
    console.log('[INFO] UPDATE USER - Request received');
    console.log('=========================================');
    
    try {
        const { id } = req.params;
        const { name, address, password } = req.body;
        
        console.log(`[INFO] updateUser: Updating user_id: ${id}`);
        debugLog('updateUser', 'Update fields', { name, address, passwordProvided: !!password });

        if (!id) {
            console.log('[WARN] updateUser: No user ID provided');
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        // Check if at least one field is provided for update
        if (!name && !address && !password) {
            console.log('[WARN] updateUser: No update fields provided');
            return res.status(400).json({
                success: false,
                message: 'At least one field (name, address, or password) is required for update'
            });
        }

        // Find user
        debugLog('updateUser', `Searching for user: ${id}`);
        const user = await User.findOne({ user_id: id });
        
        if (!user) {
            console.log(`[WARN] updateUser: User not found with ID: ${id}`);
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        console.log(`[INFO] updateUser: Current user data:`, {
            user_id: user.user_id,
            name: user.name,
            address: user.address,
            passwordHashProvided: !!user.password
        });

        // Update fields
        let updatedFields = [];
        
        if (name) {
            user.name = name;
            updatedFields.push('name');
            console.log(`[INFO] updateUser: Name updated to: ${name}`);
        }
        
        if (address) {
            user.address = address;
            updatedFields.push('address');
            console.log(`[INFO] updateUser: Address updated to: ${address}`);
        }
        
        if (password) {
            user.password = password;
            updatedFields.push('password');
            console.log('[INFO] updateUser: Password updated (will be hashed by pre-save hook)');
        }

        console.log(`[INFO] updateUser: Saving user with updated fields: ${updatedFields.join(', ')}`);
        await user.save();
        
        console.log(`[SUCCESS] updateUser: User ${user.user_id} updated successfully`);

        // Return user without password
        const updatedUser = await User.findOne({ user_id: id }).select('-password');
        debugLog('updateUser', 'Updated user data', { user_id: updatedUser.user_id, name: updatedUser.name });
        
        console.log('=========================================');
        console.log('[SUCCESS] UPDATE USER - Complete');
        console.log('=========================================\n');

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser
        });
        
    } catch (error) {
        console.error('\n=========================================');
        console.error('[ERROR] UPDATE USER - Failed');
        console.error('=========================================');
        console.error(`Error Message: ${error.message}`);
        
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            console.error('[ERROR] Validation errors:', validationErrors);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: validationErrors
            });
        }
        
        console.error(`Stack trace: ${error.stack}`);
        console.log('=========================================\n');
        
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get all users (Admin only - for testing)
// @route   GET /api/users
// @access  Public (for testing)
exports.getAllUsers = async (req, res) => {
    console.log('\n=========================================');
    console.log('[INFO] GET ALL USERS - Request received');
    console.log('=========================================');
    
    try {
        debugLog('getAllUsers', 'Fetching all users from database');
        const users = await User.find().select('-password');
        
        console.log(`[INFO] getAllUsers: Found ${users.length} users in database`);
        
        if (users.length === 0) {
            console.log('[WARN] getAllUsers: No users found in database');
        } else {
            users.forEach((user, index) => {
                debugLog('getAllUsers', `User ${index + 1}`, { user_id: user.user_id, name: user.name, email: user.email });
            });
        }
        
        console.log('[SUCCESS] getAllUsers: Users retrieved successfully');
        console.log('=========================================\n');

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
        
    } catch (error) {
        console.error('\n=========================================');
        console.error('[ERROR] GET ALL USERS - Failed');
        console.error('=========================================');
        console.error(`Error Message: ${error.message}`);
        console.error(`Stack trace: ${error.stack}`);
        console.log('=========================================\n');
        
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Environment check on startup
console.log('\n=========================================');
console.log('[INFO] USER CONTROLLER LOADED');
console.log('=========================================');
console.log(`[INFO] Debug mode: ${DEBUG ? 'ENABLED' : 'DISABLED'}`);
console.log(`[INFO] JWT_SECRET exists: ${process.env.JWT_SECRET ? 'YES' : 'NO'}`);
if (!process.env.JWT_SECRET) {
    console.error('[ERROR] WARNING: JWT_SECRET is not set in environment variables!');
}
console.log('=========================================\n');