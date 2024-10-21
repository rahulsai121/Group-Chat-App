const bcrypt = require('bcrypt');

const User = require('../model/user');
const { where } = require('sequelize');

exports.userpost = async (req, res) => {

    const user = await User.findOne({ where: { email: req.body.email } })

    if (!user) {
        const hash = await bcrypt.hash(req.body.password, 10);
        const newuser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hash
        });
        res.status(201).json({ message: 'User created successfully' })
    }
    else {

        res.status(409).json({ message: 'User already exists' })
    }

}
