import fs from 'fs-extra'
import {join, dirname} from 'path'
import { fileURLToPath } from 'url'

const {readJSON, writeJSON, writeFile, createReadStream} = fs

export const pathToJsonMedia = join(dirname(fileURLToPath(import.meta.url)), "../data/media.json")
export const pathToPublicImg = join(dirname(fileURLToPath(import.meta.url)), "../../public/img")

export const readMedia = () => readJSON(pathToJsonMedia)
export const writeMedia = (content) => writeJSON(pathToJsonMedia, content)
export const saveFile = (filename, content) => writeFile(join(pathToPublicImg, filename), content)
export const readableStream = () => createReadStream(pathToJsonMedia)