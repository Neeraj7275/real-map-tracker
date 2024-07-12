const express = require("express");
const app = express();
const http = require("http");
const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio(server);
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

io.on("connection", function(socket){

    socket.on("send-location",function(data){
        io.emit("recive-location",{id: socket.id, ...data});
    });
    socket.on("disconnect", function(){
        io.emit("user-disconnect",{id:socket.id})
    })
})

app.get("/", function(req, res){
    res.render("index");
});

server.listen(3000);