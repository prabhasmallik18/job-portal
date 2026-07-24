import jwt from 'jsonwebtoken'

// User Protection (Traditional JWT Auth)
export const protectUser = async (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader?.split(' ')[1] || req.headers.token

    if (!token) {
        return res.json({ success: false, message: 'Not authorized, login again' });
    }

    try {
        // Verify JWT token (traditional auth only)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded.id) {
            return res.json({ success: false, message: 'Invalid token. Please login again.' });
        }
        
        req.body.userId = decoded.id; 
        next();
    } catch (error) {
        console.error('Auth error:', error.message)
        if (error.name === 'JsonWebTokenError') {
            return res.json({ success: false, message: 'Invalid token format. Please login again.' });
        } else if (error.name === 'TokenExpiredError') {
            return res.json({ success: false, message: 'Token expired. Please login again.' });
        }
        return res.json({ success: false, message: 'Authentication failed. Please login again.' });
    }
}

// Company Protection (Recruiter dashboard access kosam)
export const protectCompany = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || req.headers.token;

    if (!token) {
        console.log('❌ No token found in headers')
        return res.json({ success: false, message: 'Not authorized, login again' });
    }

    try {
        console.log('🔐 Verifying company token...')
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('✅ Token verified. CompanyId:', decoded.id)
        req.company = { _id: decoded.id };
        req.body.companyId = decoded.id;
        next();
    } catch (error) {
        console.error('❌ Token verification failed:', error.message)
        if (error.name === 'JsonWebTokenError') {
            return res.json({ success: false, message: 'Invalid token format. Please login again.' });
        } else if (error.name === 'TokenExpiredError') {
            return res.json({ success: false, message: 'Token expired. Please login again.' });
        }
        res.json({ success: false, message: error.message });
    }
}