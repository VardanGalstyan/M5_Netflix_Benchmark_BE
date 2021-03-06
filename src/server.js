import express from 'express'
import mediaRouter from './services/media/index.js'
import userRouter from './services/users/index.js'
import listEndpoints from 'express-list-endpoints'
import { join } from 'path'
import cors from 'cors'


const server = express()
const port = process.env.PORT

const whiteList = [process.env.FE_DEV_URL, process.env.FE_PROD_URL]

const corsOption = {
    origin: function (origin, callback) {
        if (!origin || whiteList.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Origin not allowed!"))
        }
    }
}

const publicFolderPath = join(process.cwd(), "public")
server.use(express.static(publicFolderPath)) // this is to access the public folder
server.use(cors(corsOption))
server.use(express.json())

server.use("/media", mediaRouter)
server.use("/users", userRouter)

console.table(listEndpoints(server))

server.listen(port, () => console.log(`Server is running on Port #: ${port}`))
server.on('error', (error) => console.log(`Server is not running due to ${error}`))
