import fs from 'fs'
import path from 'path'

const resolvePath = (dirPath: string): string => {
    return path.join(__dirname, dirPath)
}

const readFilePath = (dirPath: string): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        fs.readFile(dirPath, (error, data) => {
            if (error) {
                console.log(`error:: ${error.message}`)
                reject(error)
            } else {
                console.log('Successfully readFile from assets ...')
                resolve(data)
            }
        })
    })
}

const getChunkProps = (range: string, fileSize: number) => {
    const parts = range.replace(/bytes=/, '').split('-')

    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
    const chunkSize = end - start + 1

    return {
        start,
        end,
        chunkSize,
    }
};

const getFileSizeAndResolvedPath = (filePath: string) => {
    const resolvedPath = path.resolve(filePath)
    const stat = fs.statSync(resolvedPath)
    return { fileSize: stat.size, resolvedPath: resolvedPath }
};

const COMMON = {
    resolvePath,
    readFilePath,
    getChunkProps,
    getFileSizeAndResolvedPath,
}

export default COMMON;