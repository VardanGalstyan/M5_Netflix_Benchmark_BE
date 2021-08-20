import { body } from 'express-validator'

export const mediaValidator =
    [
        body("Title").exists().withMessage("Title is a  mandatory filed!"),
        body("Year").exists().withMessage("Year is a mandatory filed!"),
        body("Type").exists().withMessage("Type is a mandatory filed!"),
        body("Poster").exists().withMessage("Poster is a mandatory filed!"),
    ]


export const mediaReviewValidator =
    [
        body("comment").exists().withMessage("Comment is a  mandatory filed!"),
        body("rate").exists().withMessage("Rate is a mandatory filed!"),

    ]

