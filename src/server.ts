import fs from 'fs'

import express, { Request, Response, Express } from 'express'

import CONSTANTS from './constants'
import COMMON from './common'

const { BASE_URL, PORT } = CONSTANTS
const { resolvePath, readFilePath } = COMMON

class Server {
    app: Express
    chunk: string
    port: number

    constructor() {
        this.app = express()
        this.chunk = ""
        this.port = Number(process.env.PORT) || PORT
    }

    start = () => {
        this.app.get(`/${BASE_URL}/`, function (req: Request, res: Response) {
            // res.send always sent to client
            // res.send not allowed to write any chunck after sent to client
            // res.write('Start (write)')
            // res.write('Finally (write)')
            // res.send('In the middle (send)')

            // res.write('Start (write)')
            // res.end('In the middle (end)') // end the chunck cannot write any more
            // res.write('Finally (write)')

            res.status(200).send({
                "message": "Hello World"
            })
        })

        this.app.get(`/${BASE_URL}/videos/`, async (req: Request, res: Response) => {
            try {
                const lists = [{
                    id: Number.parseInt((new Date().getTime()) + (Math.random() * 99) + "") + "",
                    title: "The Weeknd Save Your Tears",
                    video_url: "assets/videos/the_weeknd_save_your_tears.mp4",
                    img_url: "assets/imgs/the_weeknd_save_your_tears.png",
                    author: "The Weeknd"
                },
                {
                    id: Number.parseInt((new Date().getTime()) + (Math.random() * 99) + "") + "",
                    title: "Pillow Talk",
                    video_url: "assets/videos/zayn_milik_pillow_talk.mp4",
                    img_url: "assets/imgs/zayn_malik_pillow_talk.png",
                    author: "Zayn Malik"
                }
                ]

                let item: {} = {}
                let arr: any = []
                for (var i = 0; i < lists.length; i++) {
                    item = {}

                    const videoData = await readFilePath(resolvePath("/" + lists[i].video_url))
                    console.log(`videoData:: ${videoData?.buffer.byteLength}`)

                    const imgData = await readFilePath(resolvePath("/" + lists[i].img_url))
                    console.log(`imgData:: ${imgData?.buffer.byteLength}`)

                    if (videoData?.buffer.byteLength > 0 && imgData?.buffer.byteLength > 0) {
                        item = {
                            id: lists[i].id,
                            title: lists[i].title,
                            video_url: `/${lists[i].video_url}`,
                            img_url: `/${lists[i].img_url}`,
                            author: lists[i].author
                        }

                        arr = [...arr, item]
                    }
                }

                this.chunk = JSON.stringify(arr)
                res.status(200).end(this.chunk)
            } catch (error: any) {
                console.log(`error:: ${error.message}`)
                if (error.message.indexOf("no such file or directory") > -1) {
                    this.chunk = JSON.stringify(
                        {
                            "message": "Internal Server Error."
                        }
                    )
                    res.status(500).end(this.chunk)
                } else {
                    this.chunk = JSON.stringify(
                        {
                            "message": error.message
                        }
                    )
                    res.status(500).end(this.chunk)
                }
            }
        })

        this.app.get(`/${BASE_URL}/assets/videos/:video_url`, async (req: Request, res: Response) => {
            try {
                let videoDirPath = req.params.video_url
                console.log("video url:: " + videoDirPath)

                videoDirPath = "assets/videos/" + videoDirPath;

                const data = await readFilePath(resolvePath(videoDirPath))
                console.log(`data:: ${data?.buffer.byteLength}`)

                if (data?.buffer.byteLength > 0) {

                    res.writeHead(200, { 'Content-Type': 'video/mp4' });

                    const readStream = fs.createReadStream(resolvePath(videoDirPath));
                    readStream.pipe(res);
                }

            } catch (error: any) {
                console.log(`error:: ${error.message}`)
                if (error.message.indexOf("no such file or directory") > -1) {
                    this.chunk = JSON.stringify(
                        {
                            "message": "Not found"
                        }
                    )
                    res.status(404).end(this.chunk)
                } else {
                    this.chunk = JSON.stringify(
                        {
                            "message": error.message
                        }
                    )
                    res.status(500).end(this.chunk)
                }
            }
        })

        this.app.get(`/${BASE_URL}/assets/imgs/:img_url`, async (req: Request, res: Response) => {
            try {
                let imgDirPath = req.params.img_url
                console.log("img url:: " + imgDirPath)

                imgDirPath = "assets/imgs/" + imgDirPath;

                const data = await readFilePath(resolvePath(imgDirPath))
                console.log(`data:: ${data?.buffer.byteLength}`)

                if (data?.buffer.byteLength > 0) {

                    res.writeHead(200, { 'Content-Type': 'image/png' });

                    const readStream = fs.createReadStream(resolvePath(imgDirPath));
                    readStream.pipe(res);
                }

            } catch (error: any) {
                console.log(`error:: ${error.message}`)
                if (error.message.indexOf("no such file or directory") > -1) {
                    this.chunk = JSON.stringify(
                        {
                            "message": "Not found"
                        }
                    )
                    res.status(404).end(this.chunk)
                } else {
                    this.chunk = JSON.stringify(
                        {
                            "message": error.message
                        }
                    )
                    res.status(500).end(this.chunk)
                }
            }
        })

        //The 404 Route (ALWAYS Keep this as the last route)
        this.app.get('*', (req: Request, res: Response) => {
            this.chunk = JSON.stringify({
                message: "Not found"
            })
            res.status(404).send(this.chunk);
        });

        this.app.listen(this.port, () => console.log(`Server is running on port :: ${this.port}`))
    }
}

export default Server

