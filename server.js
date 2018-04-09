var express = require("express")
var mongoose = require("mongoose")
var app = express()
var conString = "mongodb://admin:admin@ds038319.mlab.com:38319/mylearning"
var http = require("http").Server(app)
var io= require("socket.io")(http)

io.on("connection", (socket) => {
    console.log("Socket is connected...")
})

mongoose.Promise = Promise

app.use(express.static(__dirname))

app.post("/chats", async (req, res) => {
    try {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }))
        var chat = new Chats(req.body)
        await chat.save()
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
        console.error(error)
    }
})

var Chats = mongoose.model("Chats", {
    name: String,
    chat: String
})

mongoose.connect('mongodb://localhost/chatapp');

/*mongoose.connect(conString, { useMongoClient: true }, (err) => {
    console.log("Database connection", err)
})*/

app.get("/chats", (req, res) => {
    Chats.find({}, (error, chats) => {
        res.send(chats)
    })
})

app.post("/chats", async (req, res) => {
    try {
        var chat = new Chats(req.body)
        await chat.save()
        res.sendStatus(200)
        //Emit the event
        io.emit("chat", req.body)
    } catch (error) {
        res.sendStatus(500)
        console.error(error)
    }
})

var server = http.listen(3020, () => {
    console.log("Well done, now I am listening on ", server.address().port)
})