import dotenv from "dotenv"
import Server from "./server"

// running dotenv first
dotenv.config()

// create instance of Server
const server = new Server();
server.start()





