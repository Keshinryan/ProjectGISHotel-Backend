// utils/token.js
const jwt = require('jsonwebtoken');

function generateToken(user) {
  // Generate token logic here using user data
  const token = jwt.sign({ user }, process.env.TOKEN_SECRET, { expiresIn: 86400 });
  return token;
}

function CheckToken(req, res, next) {
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

  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized' });
      } else {
        const currentTimeInSeconds = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTimeInSeconds) {
          return res
            .status(401)
            .json({ message: 'The session is already expired. Please Login Again' });
        } else {
          next();
        }
      }
    });
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
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
    var id = null;
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      id = decoded.user.id;
      if (err) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    });
    console.log(id);
    return id;
  } catch (err) {
    return res.status(403).json({ message: "You haven't Loggged in" });
  }

}

module.exports = {
  generateToken, decodedUserid,CheckToken
};
