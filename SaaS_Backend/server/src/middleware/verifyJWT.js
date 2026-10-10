const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if(!authHeader?.startsWith('Bearer ')){
        return res.status(401).json({message: 'Unauthorized: Missing or invalid token format'});
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err){
                return res.status(403).json({ message : 'Forbidden: Invalid or expired Access Token'});
            }
            req.userId = decoded.UserInfo.userId;
            req.email = decoded.UserInfo.email;
            next();
        }
    );
};

module.exports = verifyJWT;