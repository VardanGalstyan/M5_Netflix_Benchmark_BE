import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

export const mediaStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "M5_Netflix_BE"
    }
})



// mediaRouter.put("/:id/poster", multer().single('poster'), async (req, res, next) => {
//     try {
//         const extension = extname(req.file.originalname)
//         const fileName = `${req.params.id}${extension}`
//         const mediaPosts = await readMedia()
//         const mediaPost = mediaPosts.find(post => post.imdbID === req.params.id)
//         const errorList = validationResult(req)
//         if (mediaPost) {
//             await saveFile(fileName, req.file.buffer)
//             const posterPath = `http://localhost:${process.env.PORT}/${fileName}`
//             const updatedMediaPost = { imdbID: req.params.id, ...mediaPost, Poster: posterPath, updatedAt: new Date().toISOString() }
//             const filteredMediaPost = mediaPosts.filter(posts => posts.imdbID !== req.params.id)
//             filteredMediaPost.push(updatedMediaPost)
//             await writeMedia(filteredMediaPost)
//             res.status(201).send(updatedMediaPost)
//         } else {
//             next(createHttpError(404, { errorList }))
//         }
//     } catch (error) {
//         console.log(error);
//         next(error)
//     }
// })