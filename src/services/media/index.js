import { Router } from "express";
import { readableStream, readMedia, writeMedia } from "../../utilities/fs-utilities.js";
import { mediaReviewValidator, mediaValidator } from "../../validation.js";
import { validationResult } from "express-validator";
import { generatePdfStream } from "../../utilities/pdf.js";
import { pipeline } from "stream";
import createHttpError from "http-errors";
import uniqid from 'uniqid'
import multer from "multer"
import { mediaStorage } from '../../utilities/fileupload.js'
import { Transform } from "json2csv";


const mediaRouter = Router()


mediaRouter.get("/", async (req, res, next) => {

    try {
        const mediaPosts = await readMedia()
        res.status(201).send(mediaPosts)

    } catch (error) {
        console.log(error);
        next(error)
    }
})

mediaRouter.get("/:id", async (req, res, next) => {
    try {
        const mediaPosts = await readMedia()
        const mediaPost = mediaPosts.find(post => post.imdbID === req.params.id)
        if (mediaPost) {
            res.status(201).send(mediaPost)
        } else {
            next(createHttpError(404, `Media post with ID #: ${req.params.id} cannot be found!`))
        }
    } catch (error) {
        console.log(error);
        next(error)
    }
})

mediaRouter.post("/", mediaValidator, async (req, res, next) => {
    try {
        const errorList = validationResult(req)
        if (!errorList.isEmpty()) {
            next(createHttpError(400, { errorList }))
        } else {
            const mediaPosts = await readMedia()
            const newMedia = { imdbID: uniqid(), ...req.body, reviews: [], createdAt: new Date().toISOString() }
            mediaPosts.push(newMedia)
            await writeMedia(mediaPosts)
            res.status(201).send(newMedia)
        }
    } catch (error) {
        console.log(error);
        next(error)
    }
})

mediaRouter.post("/:id/reviews", mediaReviewValidator, async (req, res, next) => {
    try {
        const mediaPosts = await readMedia()
        const filteredMediaPosts = mediaPosts.filter(post => post.imdbID !== req.params.id)
        const mediaPost = mediaPosts.find(p => p.imdbID === req.params.id)
        if (mediaPost) {
            const errorList = validationResult(req)
            if (!errorList.isEmpty()) {
                next(createHttpError(400, { errorList }))
            } else {
                const newReview = { _id: uniqid(), ...req.body, elementId: mediaPost.imdbID, createdAt: new Date().toISOString() }
                mediaPost.reviews.push(newReview)
                mediaPosts.push(newReview)
                filteredMediaPosts.push(mediaPost)
                await writeMedia(filteredMediaPosts)
                res.status(201).send(newReview)
            }
        }
    } catch (error) {
        console.log(error);
        next(error)
    }
})

mediaRouter.put("/:id", async (req, res, next) => {
    try {
        const mediaPosts = await readMedia()
        const filteredMedia = mediaPosts.filter(post => post.imdbID !== req.params.id)
        const updatedPost = { imdbID: req.params.id, ...req.body, updatedAt: new Date().toISOString() }
        filteredMedia.push(updatedPost)
        await writeMedia(filteredMedia)
        res.status(201).send(updatedPost)

    } catch (error) {
        console.log(error);
        next(error)
    }
})

mediaRouter.put("/:id/poster", multer({ storage: mediaStorage }).single('poster'), async (req, res, next) => {

    try {
        const mediaPosts = await readMedia()
        const mediaPost = mediaPosts.find(post => post.imdbID === req.params.id)
        const errorList = validationResult(req)
        if (mediaPost) {
            const posterPath = req.file.path
            const updatedMediaPost = { imdbID: req.params.id, ...mediaPost, Poster: posterPath, updatedAt: new Date().toISOString() }
            const filteredMediaPost = mediaPosts.filter(posts => posts.imdbID !== req.params.id)
            filteredMediaPost.push(updatedMediaPost)
            await writeMedia(filteredMediaPost)
            res.status(201).send(updatedMediaPost)
        } else {
            next(createHttpError(404, { errorList }))
        }
    } catch (error) {
        console.log(error);
        next(error)
    }
})

mediaRouter.delete("/:id", async (req, res, next) => {
    try {
        const mediaPosts = await readMedia()
        const filteredMedia = mediaPosts.filter(post => post.imdbID !== req.params.id)
        await writeMedia(filteredMedia)
        res.send("deleted")

    } catch (error) {
        console.log(error);
        next(error)
    }
})

mediaRouter.delete("/:id/reviews/:elementId", async (req, res, next) => {
    console.log('dhid');
    try {
        const mediaPosts = await readMedia()
        const filteredMediaPosts = mediaPosts.filter(post => post.imdbID !== req.params.id)
        const mediaPost = mediaPosts.find(p => p.imdbID === req.params.id)
        console.log(mediaPost);
        if (mediaPost) {
            const filteredReviews = mediaPost.reviews.filter(review => review._id !== req.params.elementId)
            console.log(filteredReviews);
            mediaPost.reviews = filteredReviews
            filteredMediaPosts.push(mediaPost)
            await writeMedia(filteredMediaPosts)
            res.send("The review is deleted!")
        } else {
            next(createHttpError(404, `Media post with ID #: ${req.params.id} cannot be found!`))
        }
    } catch (error) {
        console.log(error);
        next(error)
    }
})

mediaRouter.get("/:id/pdf", async (req, res, next) => {
    try {
        const mediaPosts = await readMedia();
        const mediaPost = mediaPosts.find(post => post.imdbID === req.params.id);
        if (mediaPost) {
            res.setHeader("Content-Disposition", "attachment; filename=mediaPost.pdf");
            const source = await generatePdfStream(mediaPost);
            const destination = res;

            pipeline(source, destination, (err) => {
                if (err) next(err);
            });
        } else {
            res.send(
                createHttpError(404, `Blog post with the id: ${paramsID} not found.`)
            );
        }
    } catch (error) {
        next(error);
    }
});

mediaRouter.get("/csv", async (req, res, next) => {
    try {
        res.setHeader("Content-Disposition", "attachment; filename=mediaPost.pdf");
        const source = readableStream()
        const transform = new Transform({ fields: ["Title", "Year", "Type"] })
        const destination = res;

        pipeline(source, transform, destination, (err) => {
            if (err) next(err);
        });

    } catch (error) {
        next(error);
    }
});

export default mediaRouter