const { body, validationResult } = require('express-validator');

const userValidationRules = () => {
    return [
        body('name').notEmpty().withMessage('Username is required'),
        body('email').notEmpty().withMessage('Email is required'),
        body('password').notEmpty().withMessage('Password is required'),
        body('password').isLength({ min: 5 }).withMessage('Password must be at least five characters long'),
    ]
}

const updateUserValidationRules = () => {
    return [
        body('name').notEmpty().withMessage('Username is required'),
        body('password').notEmpty().withMessage('Password is required'),
        body('password').isLength({ min: 5 }).withMessage('Password must be at least five characters long'),
    ]
}

const postValidationRules = () => {
    return [
        body('title').notEmpty().withMessage('Post title is required'),
        body('contents').notEmpty().withMessage('Post contents are required'),
        body('steps').notEmpty().withMessage('Post steps are required'),
    ]
}



const validate = (req, res, next) => {
    const errors = validationResult(req)

    if(errors.isEmpty()) {
        return next()
    }

    return res.status(400).json({errors: errors.array()})
}

module.exports = {
    userValidationRules,
    updateUserValidationRules,
    postValidationRules,
    validate
}