// userExtractor.js

const jwt = require('jsonwebtoken')
const User = require('../models/user')

const userExtractor = async (request, response, next) => {
    const { token } = request

    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.SECRET)
            if (decodedToken.id) {
                const user = await User.findById(decodedToken.id)
                request.user = user // Set the user in the request object
            }
        } catch (error) {
            // Token verification failed or user not found, do nothing
        }
    }

    next()
}

module.exports = userExtractor