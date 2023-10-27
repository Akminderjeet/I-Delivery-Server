import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cron from 'node-cron'
import Orders from './Models/Orders.js'
import MidPoints from './Models/MidPoints.js'
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors'
import { Agent } from 'http';
import AgentSchema from './Models/AgentProfile.js';
const app = express();
const server = createServer(app);


app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });
});

app.get('/test', (req, res) => {
    console.log("ABCD");
    io.emit('Bat', "YES");
})

mongoose.connect('mongodb+srv://jeetakminder:heyideliverhere@i-delivery-cluster.fwv82t2.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true });

const myMap = new Map();
app.use(
    cors({
        origin: "http://localhost:3000",
        methods: "GET,POST,PUT,DELETE",
        credentials: true
    })
);



cron.schedule('* */10 * * *', () => {
    console.log('running a task 5 minutes');
    MidPoints.aggregate([
        {
            $group: {
                _id: "$city"
            }
        }
    ]).then((result) => {
        result.forEach((item) => {
            console.log(item._id);
            myMap.set(item._id, []);
            io.emit(item._id, item._id);
            setInterval(async () => {
                MidPoints.find({ city: item._id }).then((midPoints) => {
                    midPoints.forEach((point) => {
                        console.log(point.id);
                        Orders.find({ next: point.id, current: { $exists: false } }, { _id: 1 }).then((parcels) => {
                            console.log(parcels);
                            console.log("-----");
                            AgentSchema.findOne({ status: 1, city: item._id }).then((agent) => {
                                console.log(agent);
                                console.log("+++");
                            })
                        })
                        Orders.aggregate([
                            {
                                $match: {
                                    current: point._id
                                }
                            },
                            {
                                $group: {
                                    _id: "$next",
                                    ids: { $push: "$_id" }
                                }
                            }
                        ]).then((parcels) => {
                        })
                    })
                })
            }, 1000);
        })
    })

});


app.post('/setProfile', (req, res) => {
    console.log(req.body.obj)
    res.send("ABCD");
})

app.post('/setCoordinates', (req, res) => {
    if (req && req.body && req.body.obj && req.body.obj.city) {
        var cityy = req.body.obj.city;
        cityy = cityy.toString();
        console.log(cityy.toString());
        if (myMap.has(cityy)) {
            // If the key already exists, push the object to the existing array
            const key = myMap.get(cityy);
            key.push(req.body.obj); // Add a new object to the array
        } else {
            // If the key doesn't exist, create a new array and set it in the Map
            const newArray = [];
            newArray.push(req.body.obj)
            myMap.set(cityy, newArray);
        }
        // const key = myMap.get(cityy);
        // console.log(key);
        // key.push(req.body.obj);
        console.log(myMap)
    }
    res.send("ahsd")
})

server.listen(4000, () => {
    console.log('server running at http://localhost:4000');
});


// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html')
// })
