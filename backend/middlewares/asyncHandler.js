const asyncHandler = (func) => (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch((error) => {
        res.status(500).json({Message: error.message})
    })
}

export default asyncHandler