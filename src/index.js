import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'

const app = express();
const httpServer = http.createServer(app)
const io = new Server(httpServer, {
  cors : {
    origin: "*",
   }
});



dotenv.config({
    path: './.env'
})

const Port = process.env.PORT || 3000;
app.use(express.json())
app.use(cors())

var clients={}
io.on("connection", (socket) => {
     console.log(socket.id, "joined user")
   //   socket.emit("hello world")
     socket.on("signin", (userId) => {
      console.log(userId);
      clients[userId] = socket;
      console.log(clients);

      socket.on("message", (msg) => {
         console.log(msg)
         let receiverId = msg.receiverId;
         if(clients[receiverId]) clients[receiverId].emit("message", msg);
      })
     })
})


app.get('/', (req, res) => {
   res.send({
    message : "server if fine"
   })
})
httpServer.listen(Port,"0.0.0.0", () => {
   console.log(`server is listening at http://localhost:${Port}`)
})
