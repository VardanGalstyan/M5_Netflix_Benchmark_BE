export const notFoundError = (err, req, res, next) => {
    if (err.status === 404) {
        res.status(404).send({ success: false, message: err.message })
    } else {
        next(err)
    }
}

export const badRequestError = (err, req, res, next) => {
    if (err.status === 400) {
        res.status(400).send(err.errorList)
    } else {
        next(err)
    }
}

export const forbiddenError = (err, req, res, next) => {
    if (err.status === 403) {
        res.status(403).send({ success: false, message: err.message })
    } else {
        next(err)
    }
}

export const genericServerError = (err, req, res, next) => {
    res.status(500).send('Generic Server Error!')
}

