const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const User = require('../model/user');
const { where } = require('sequelize');

exports.userPost = async (req, res) => {
    try {
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

    catch (error) {
        res.status(500).json({ error: error.message })
    }

}


exports.userLogin= async (req,res)=>{
    try {
        const { email, password } = req.body;
        

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(404).json({ message: 'Invalid password' });
        }
        
         const token = jwt.sign({ userId: user.id }, 'your_jwt_secret');
         res.status(200).json({ message: 'Login successful', token });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
