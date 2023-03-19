const User = require("../models/User.model");

const createUser = async (req, res) => {
    const user = await User.create(req.body);
    res.status(200).json(user);
};

const getUsers = async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
};

module.exports = { createUser, getUsers };
