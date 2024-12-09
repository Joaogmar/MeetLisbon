const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error. Could not fetch users.' });
    }
};

const getAllAdmins = async (req, res) => {
    try {
        const admins = await userModel.getAllAdmins();
        res.status(200).json(admins);
    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({ message: 'Server error. Could not fetch admins.' });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await userModel.deleteUser(id);
        if (result) {
            res.status(200).json({ message: `User with ID ${id} deleted successfully.` });
        } else {
            res.status(404).json({ message: `User with ID ${id} not found.` });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error. Could not delete user.' });
    }
};

const promoteToAdmin = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await userModel.updateUserRole(id, 'admin');
        if (result) {
            res.status(200).json({ message: `User with ID ${id} promoted to admin.` });
        } else {
            res.status(404).json({ message: `User with ID ${id} not found.` });
        }
    } catch (error) {
        console.error('Error promoting user:', error);
        res.status(500).json({ message: 'Server error. Could not promote user.' });
    }
};

const demoteToUser = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await userModel.updateUserRole(id, 'user');
        if (result) {
            res.status(200).json({ message: `Admin with ID ${id} demoted to user.` });
        } else {
            res.status(404).json({ message: `User with ID ${id} not found.` });
        }
    } catch (error) {
        console.error('Error demoting admin:', error);
        res.status(500).json({ message: 'Server error. Could not demote admin.' });
    }
};

const changePassword = async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    if (!password || password.length < 3) {
        return res.status(400).json({ message: 'Password must be at least 3 characters long.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await userModel.updateUserPassword(id, hashedPassword);

        if (result) {
            res.status(200).json({ message: `Password for user with ID ${id} updated successfully.` });
        } else {
            res.status(404).json({ message: `User with ID ${id} not found.` });
        }
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Server error. Could not update password.' });
    }
};

module.exports = { getAllUsers, getAllAdmins, deleteUser, promoteToAdmin, demoteToUser, changePassword };