import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
const server = createServer(app);
const io = new Server(server,{
    cors: {
        origin: "http://localhost:5173",
        methods:["GET","POST"],
        credentials: true,
    }
});



app.get("/",(req, res)=>{
    res.send("Hello World");
})

io.on("connection",(socket) => {
    console.log(`user connected ${socket.id}`);

    socket.on("message",({room, message})=>{
        console.log({room, message});
        io.to(room).emit("recevie-message", message);
    })

    socket.on("disconnect", () => {
        console.log(`user disconnected ${socket.id}`);
    })
   
   

})


server.listen(3000,()=>{
    console.log("server is running on port 3000");
})