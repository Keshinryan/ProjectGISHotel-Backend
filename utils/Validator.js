const { validationResult } = require('express-validator');
const validatorResult = (req, res, next) => {
    const validatorError = validationResult(req);
    if (!validatorError.isEmpty()) {
        return res.status(400).json(validatorError.array());
    } else {
        next();
    }
}

module.exports = { validatorResult }