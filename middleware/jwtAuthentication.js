const jwt = require('jsonwebtoken')

require('dotenv').config();


const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']


    if (!token) {
        return res.status(401).json({ message: 'Access denied' })
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY ); 

        req.userId = decoded.userId;

        next();
    } 
    catch (err) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
}

module.exports=authMiddleware