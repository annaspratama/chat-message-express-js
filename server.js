import express from "express";
import dotenv from "dotenv";
import path from "path";
import { Server } from "http";
import { fileURLToPath } from "url";
import { Server as socketServer } from "socket.io";
import formatMessage from "./services/messages.js";
import { userJoins, getCurrentUser, getGroupUsers, userLeaves } from "./services/users.js";

const app = express();
dotenv.config();
const port = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const botName = "Chat Message Bot";

// set static files
app.use(express.static(path.join(__dirname, "public")));

// instantiate socketio
const server = Server(app)
const socketio = new socketServer(server);

// run when cilent connects
socketio.on("connection", socket => {
    // console.info(`New client is connected with id: ${socket.id}.`);

    // when user connects
    socket.on("join-group", ({username, group}) => {
        const user = userJoins(socket.id, username, group);

        socket.join(user.group);

        // welcome current connected user
        socket.emit("message", formatMessage(botName, `Hi, Welcome to Chat Message.`));

        // broadcast when a user connects
        socket.broadcast.to(user.group).emit("message", formatMessage(botName, `${user.username} has joined the chat.`));

        // user and group info
        socketio.to(user.group).emit("group-users", {
            group: user.group,
            users: getGroupUsers(user.group)
        });
    });

    // listen for incoming chat message
    socket.on("chat-message", obj => {
        const user = getCurrentUser(socket.id);
        socketio.to(user.group).emit("message", formatMessage(user.username, obj.message, obj.isOwnMsg));
    });

    // run when a client disconnects
    socket.on("disconnect", () => {
        const user = userLeaves(socket.id);

        if (user) socketio.to(user.group).emit("message", formatMessage(botName, `${user.username} has left the chat.`));
    });
});

server.listen(port, () => {console.info(`Server is running on port ${port}.`)});