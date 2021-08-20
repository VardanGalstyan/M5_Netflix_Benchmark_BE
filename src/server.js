import express from 'express'
import mediaRouter from './services/media/index.js'
import listEndpoints from 'express-list-endpoints'
import {join} from 'path'
import cors from 'cors'


const server = express()
const port = process.env.PORT

const publicFolderPath = join(process.cwd(), "public")
server.use(express.static(publicFolderPath)) // this is to access the public folder
server.use(cors())
server.use(express.json())

server.use("/media", mediaRouter)

console.table(listEndpoints(server))

server.listen(port, () => console.log(`Server is running on Port #: ${port}`))
server.on('error', (error) => console.log(`Server is not running due to ${error}`))
