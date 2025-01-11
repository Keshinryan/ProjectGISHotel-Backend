// utils/token.js
const jwt = require('jsonwebtoken');

function generateToken(user) {
  // Generate token logic here using user data
  const token = jwt.sign({ user }, process.env.TOKEN_SECRET, { expiresIn: 86400 });
  return token;
}

function CheckToken(req, res, next) {
  const tokenName = 'hotelgistoken';
  const cookies = req.headers.cookie;

  // Check if cookies exist
  if (!cookies) {
    return res.status(401).json({ message: 'Unauthorized: No cookies found' });
  }

  // Parse the cookies to find the token
  const token = cookies
    .split('; ')
    .find((cookie) => cookie.trim().startsWith(`${tokenName}=`))
    ?.split('=')[1];

  // If token is found
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.error('JWT verification error:', err);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }

      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTimeInSeconds) {
        console.warn('Token expired:', decoded);
        return res
          .status(401)
          .json({ message: 'Session expired. Please login again.' });
      }
      req.user = decoded.user; // Attach user info to the request
      next();
    });
  } else {
    return res.status(401).json({ message: 'Unauthorized: Token not found' });
  }
}



function decodedUserid(req, res) {
  try {
    const tokenName = 'hotelgistoken'; // Replace with the actual name of your token
    const cookies = req.headers.cookie;
    
    if (!cookies) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    // Find the token in the cookies
    const token = cookies
      .split('; ')
      .find((cookie) => cookie.startsWith(`${tokenName}=`))
      ?.split('=')[1];
    let id = null;
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      id = decoded.user.id;
      if (err) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    });
    return id;
  } catch (err) {
    return res.status(403).json({ message: "You haven't Loggged in" });
  }

}

module.exports = {
  generateToken, decodedUserid,CheckToken
};
