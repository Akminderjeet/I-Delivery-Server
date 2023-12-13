import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cron from 'node-cron'
import dotenv from 'dotenv';
import Orders from './Models/Orders.js'
import MidPoints from './Models/MidPoints.js'
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors'
import { Agent } from 'http';
import AgentSchema from './Models/AgentProfile.js';
import passport from "passport";
import GoogleAuth from 'passport-google-oauth2';
import session from 'express-session';
import OrdersAssigned from './Models/OrdersAssigned.js';
import { ObjectId } from 'mongodb';
const app = express();
const server = createServer(app);
dotenv.config();

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

mongoose.connect(process.env.MONGOOSEURL, { useNewUrlParser: true });

const myMap = new Map();
app.use(
    cors({
        origin: "http://localhost:3000",
        methods: "GET,POST,PUT,DELETE",
        credentials: true
    })
);

passport.serializeUser(function (user, done) {
    done(null, user);
})

passport.deserializeUser(function (user, done) {
    done(null, user);
})


app.enable('trust proxy');
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    proxy: true
}));
app.use(passport.initialize());
app.use(passport.session());


var GoogleStrategy = GoogleAuth.Strategy;
passport.use(new GoogleStrategy({
    clientID: process.env.AGENT_GOOGLE_ID,
    clientSecret: process.env.AGENT_GOOGLE_SECRET,
    callbackURL: "http://localhost:4000/google/callback",
    passReqToCallback: true
},
    function (request, accessToken, refreshToken, profile, done) {
        console.log("REACHED")
        /*if (profile && profile._json && profile._json.email && profile._json.email == 'jeetakminder@gmail.com')
            return done(null, profile);
        else return done(null);*/
        done(null, profile);

    }
));


app.get('/auth/google',
    passport.authenticate('google', {
        scope: [
            'profile',
            'email'
        ]
    })
);

app.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    function (req, res) {
        console.log(req.user);
        // res.redirect('http://localhost:3000/');
        res.redirect('http://localhost:3000/agent/profile');
    }
);






cron.schedule('* * * * *', () => {
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
                        // Bangl
                        Orders.find({ next: point.id, stage: 0, current: { $exists: false } }, { _id: 1 }).then((parcels) => {
                            console.log(parcels);
                            console.log("-----");
                            //Banglar 
                            // Banl---Delhi
                            // banl-wesb -  
                            AgentSchema.findOne({ status: 1, city: item._id }).then((agent) => {
                                if (agent) {
                                    AgentSchema.updateOne({ _id: agent._id }, { $set: { status: 4 } })
                                    parcels.forEach((parcel) => {
                                        //Add code for parcel stage update
                                        OrdersAssigned.create({ agent: agent._id, order: parcel._id, activeStatus: 1 }).then(() => {
                                            console.log("Updated++++++++++++++++++++++++++++++++++++++++")

                                        })
                                    })
                                } else {
                                    console.log(agent);
                                    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
                                }
                            }).catch((err) => {
                                console.log(err);
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

app.get('/agent/getOrders/', (req, res) => {
    console.log("asdff");
    if (req && req.user) {
        AgentSchema.find({ email: req.user.email }, { _id: 1 }).then((result) => {
            if (result.length) {
                console.log(result);
                OrdersAssigned.find({ agent: result[0]._id, activeStatus: 1 }).populate('order').then((result) => {
                    console.log(result);
                    res.send(result);
                }).catch((err) => {
                    console.log(err);
                })
            } else {
                res.status(400).send({ message: "Profile Details Missing" });
            }
        }).catch((err) => {
            console.log(err);
        })
    } else {
        res.status(400).send({ message: "Not Logged In" });
    }
})

app.post('/setProfile', (req, res) => {
    console.log("asdf")
    console.log(req.user);
    if (req.user && req.body && req.body.obj) {
        var data = {};
        var obj = req.body.obj;
        data.name = obj.name;
        data.email = req.user.email;
        data.mobile = obj.mobile;
        data.city = obj.city;
        data.gender = obj.gender;
        data.adhar = obj.aadharCard;
        data.upi = obj.bankUpi;
        data.status = 0;
        AgentSchema.findOne({ email: req.user.email }).then((result) => {
            console.log("++++++++++++++++++++++++++++++++++++==========================");
            console.log(result);
            if (result != null) {
                console.log("--------------------------------")
                AgentSchema.updateOne({ email: req.user.email }, data).then((updated) => {
                    console.log(updated);
                }).catch((err) => {
                    console.log(err);
                })
            } else {
                console.log("________________________________")
                console.log(data)
                AgentSchema.create(data).then((created) => {
                    console.log(created);
                }).catch((err) => {
                    console.log(err);
                })
            }
        }).catch((err) => {

        })

    } else {
        res.status(400).json({ error: "Login Credentials Missing. Please Log In" });
    }
})

app.post("/agent/pickup", (req, res) => {
    if (req && req.user) {
        console.log(req.body);
        Orders.updateOne({ _id: req.body.orderId }, { $set: { stage: 1 } }).then((result) => {
            res.send(result);
        })
    } else {
        res.status(400).json({ error: "Login Credentials Missing. Please Log In" });
    }
})
app.post("/agent/deliver", (req, res) => {
    if (req && req.user) {
        var orderId = req.body.orderId;
        console.log(orderId);
        console.log("---------------------------------------------------")
        Orders.findOne({ _id: orderId }).then((result) => {
            console.log("???????????????????????????????????????????????????????");
            console.log(result);
            if (result == null) {
                res.status(400).json({ error: "Error updating Data" });
            } else if (result.status == 1000) {
                Orders.updateOne({ _id: orderId }, { $set: { stage: 0, status: 100000 } }).then((updatedResult) => {
                    OrdersAssigned.updateMany({ order: orderId }, { $set: { activeStatus: 2 } });
                    res.send(updatedResult);

                })
            } else if (result.status == result.path.length) {
                Orders.updateOne({ _id: orderId }, { $set: { stage: 0, status: 1000, current: result.next, next: "Home" } }).then((updatedResult) => {
                    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                    var orderID = orderId.toString();
                    OrdersAssigned.updateMany({ order: orderID }, { $set: { activeStatus: 2 } }).then((resultt) => {
                        console.log(resultt);
                    })
                    res.send(updatedResult);
                }).catch((err) => {
                    console.log(err);
                })
            } else {
                Orders.updateOne({ _id: orderId }, { $set: { stage: 0, status: result.status + 1, current: result.next, next: result.path[result.status] } }).then((updatedResult) => {
                    console.log(updatedResult)
                    var objj = { order: orderId };
                    OrdersAssigned.updateMany(objj, { $set: { activeStatus: 2 } }).then((resultt) => {
                        console.log(resultt);
                    });
                    res.send(updatedResult);
                })
            }
        }).catch((err) => {
            console.log(err);
        })
    } else {
        res.status(400).json({ error: "Login Credentials Missing. Please Log In" });
    }
})
app.post('/agent/getLocation', (req, res) => {
    if (req && req.user) {
        var obj = req.body;
        console.log(obj);
        if (obj.order.status == 0) {
            var location = {};
            location.source = obj.order.start;
            MidPoints.findOne({ _id: obj.order.next }).then((result) => {
                location.destination = {};
                location.destination.lat = result.latitude;
                location.destination.lng = result.longitude;
            })
        } else if (obj.order.status == obj.order.path.length) {
            var location = {};
            location.destination = obj.order.end;
            MidPoints.findOne({ _id: obj.order.current }).then((result) => {
                location.source = {};
                location.source.lat = result.latitude;
                location.source.lng = result.longitude;
            })
        } else {
            var location = {};
            MidPoints.findOne({ _id: obj.order.current }).then((result) => {
                location.source = {};
                location.source.lat = result.latitude;
                location.source.lng = result.longitude;
            })
            MidPoints.findOne({ _id: obj.order.next }).then((result) => {
                location.destination = {};
                location.destination.lat = result.latitude;
                location.destination.lng = result.longitude;
            })

        }
        res.send(location);
    } else {
        res.status(400).json({ error: "Login Credentials Missing. Please Log In" });
    }
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
