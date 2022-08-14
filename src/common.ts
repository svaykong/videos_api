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

const COMMON = {
    resolvePath,
    readFilePath,
}

export default COMMON;