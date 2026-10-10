const authService = require('./auth.service');

const register = async (req, res) => {
    try {
        const {fullName, email, password} = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'Full name, email, and password are required.' });
        }

        const user = await authService.registerUser({ fullName, email, password });
        res.status(201).json({ message: 'User registered successfully.', user });
        }
    catch (error) {
            res.status(400).json({ message: error.message });
        }

    };

const login = async (req, res ) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({message: 'email and password are required'});
        }

        const cookies = req.cookies;
        const { user, accessToken, newRefreshToken } = await authService.loginUser(
            {email, password},
            cookies?.jwt
        );

        // Send Refresh Token as secure HttpOnly cookie
        res.cookie('jwt', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 7*24*60*60*1000
        });

        res.status(200).json({user, accessToken});
    } catch(error){
        res.status(401).json({message: error.message});
    }
};

const refreshToken = async (req, res) => {
    try {
        const { accessToken, user} = await authService.handleRefreshToken(req.cookies);
        res.status(200).json({user, accessToken});
    } catch (error){
        if (error.message === 'NO_COOKIE'){
            return res.status(401).json({ message: 'Unauthorized: No refresh cookie found.'});
        }
        res.clearCookie('jwt', {httpOnly:true, sameSite: 'None', secure: process.env.NODE_ENV === 'production'});
        res.status(403).json({message: 'Forbidden: Session expired or invalid.'});
    }
};

const logout = async(req, res) => {
    try{
        const cookies = req.cookies;
        if(!cookies?.jwt)
        {
            return res.sendStatus(204); 
        }
        await authService.logoutUser(cookies.jwt);

        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'None',
            secure: process.env.NODE_ENV === 'production'
        });
        res.status(200).json({message: 'Logged out successfully.'});
    } catch(error)
    {
        res.status(500).json({message: 'Logout failed.'});
    }
};

module.exports = {
    register,
    login,
    refreshToken,
    logout
};
