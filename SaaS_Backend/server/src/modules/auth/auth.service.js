const User = require('./models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { access } = require('node:fs');

class AuthService{
    // Register New User
    async registerUser({fullName, email, password}) {
        const duplicate = await user.findOne({ email }).exec();
        if( duplicate ){
            throw new Error('An account with this email already exists');
        }

        const hashedPwd = await bcrypt.hash(password, 10);

        const newUser = await user.Create({
            fullName,
            email,
            password: hashedPwd
        });

        return {
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email
        };
    }

    // Authenticate user & issue tokens
    async loginUser({ email, password }, incomingRefreshToken){
        const foundUser = await User.findOne({ email }).exec();
        if(!foundUser)
        {
            throw new Error('Invalid email or password');
        }

        const match = await bcrypt.compare(password, foundUser.password);
        if(!match){
            throw new Error('Invalid email or password');
        }

        // Generate JWT Access Token(Short-Lived: 15 mins)
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "userId": foundUser._id,
                    "email": foundUser.email
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '15m'}
        );

        // Generate JWT Refresh Token (Long-Lived 7 days)
        const newRefreshToken = jwt.sign(
            {
                "userId": foundUser._id
            },
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '7d'}
        );

        // Handle Multiple Devices login
        let newRefreshTokenArray = !incomingRefreshToken
                                     ?foundUser.refreshToken
                                     :foundUser.refreshToken.filter(rt => rt !== incomingRefreshToken);
                                    
        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        await foundUser.save();

        return {
            user: {
                _id: foundUser._id,
                fullName: foundUser.fullName,
                email: foundUser.email
            },
            accessToken,
            newRefreshToken
        };
        
    }

    // Silent Access Token Refresh using HttpOnly cookie
    async handleRefreshToken(cookies){
        if(!cookies?.jwt) throw new Error('NO_Cookie');
        
        const refreshToken = cookies.jwt;

        const foundUser = await user.findOne({refreshToken}).exec();
        if(!foundUser){
            // Potential refresh token reuse detected! Clear cookie for safety.
            throw new Error('INVALID_REFRESH');
        }

        return new Promise((resolve, reject) => {
            jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                (err, decoded) => {
                    if (err || foundUser._id.toString() !== decoded.userId){
                        return reject(new Error('Expired_Refresh'));
                    }

                    // Issue fresh access token
                    const accessToken = jwt.sign(
                        {
                            "UserInfo": {
                                "userId": foundUser._id,
                                "email": foundUser.email
                            }
                        },
                        process.env.ACCESS_TOKEN_SECRET,
                        {expiresIn: '15m'}
                    );

                    resolve({accessToken, user: {_id: foundUser._id, email: foundUser.email, fullName: foundUser.fullName}});
                }
            );
        }
    );
    }

    // Logout (Clear Refresh Token from Database)
    async logoutUser(refreshToken){
        if(!refreshToken)
        {
            return;
        }
        const foundUser = await user.findOne({ refreshToken }).exec();
        if(!foundUser) return;

        // Remove token from user's active session array
        foundUser.refreshtoken = foundUser.refreshToken.filter(rt => rt !== refreshToken);
        await foundUser.save();
    }
};

module.exports = new AuthService();
