import express from "express"
import dotenv from "dotenv"
import path from "path"
import { Server } from "http"
import { fileURLToPath } from "url"
import { Server as socketServer } from "socket.io"

const app = express();
dotenv.config();
const port = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// set static files
app.use(express.static(path.join(__dirname, "public")));

// instantiate socketio
const server = Server(app)
const socketio = new socketServer(server);

// run when cilent connects
socketio.on("connection", socket => {
    console.info(`New client is connected with id: ${socket.id}.`);
    socket.emit(`message`, `Hi, Welcome to Chat Message.`);

    // broadcast when a user connects
    socket.broadcast.emit("message", `A user has joined the chat.`);

    // run when a client disconnects
    socket.on("disconnect", () => {
        socketio.emit("message", `A user has left the chat.`);
    });

    // listen for incoming chat message
    socket.on("chatMsg", msg => {
        socketio.emit("message", msg);
    });
});

server.listen(port, () => {console.info(`Server is running on port ${port}.`)});