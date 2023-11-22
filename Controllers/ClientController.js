import DistanceEdgeSchema from "../Models/DistanceEdge.js";
import MidPointSchema from "../Models/MidPoints.js";
import { findDistance } from '../Computations/calDistance.js'
import { ClosestNode } from "../Computations/ClosestNode.js";
import { PathFinder } from '../Computations/PathCalculator.js'
import Orders from "../Models/Orders.js";
import mongoose from "mongoose";


export const createDelivery = async (req, res) => {
    console.log(req.body);
    if (req && req.user) {
        var obj = req.body.obj;
        var startNode = await ClosestNode(obj.sourceLat, obj.sourceLong, obj.city);
        console.log(startNode);
        var endNode = await ClosestNode(obj.destinationLat, obj.destinationLong, obj.city);
        console.log(endNode);
        var path = await PathFinder(startNode, endNode, obj.city);
        var order = {};
        order.start = { lat: obj.sourceLat, lng: obj.sourceLong };
        order.end = { lat: obj.destinationLat, lng: obj.destinationLong };
        order.owner = req.user.email;
        order.path = path;
        if (path.length > 0)
            order.next = path[0];
        order.status = 0;
        Orders.create(order).then((result) => {
            console.log(result);
            res.send(result);
        }).catch((err) => {
            console.log(err);
        })
    } else {
        res.status(400).send({ message: "Login Details missing! Please Log In" })
    }
}

export const History = async (req, res) => {
    if (req && req.user) {
        var params = { 'owner': req.user.email };
        Orders.find(params).then((result) => {
            console.log(result);
            res.send(result);
        }).catch((err) => {
            res.status(400).send({ message: "Error getting Orders" })
        })
    } else {
        console.log("Login Details Missing")
        res.status(400).send({ message: "Login Details missing! Please Log In" })
    }
}
export const GetPath = async (req, res) => {
    if (req && req.user) {
        console.log(req.body)
        var pathArray = req.body;
        MidPointSchema.find({ _id: { $in: pathArray } }, { lat: '$latitude', lng: '$longitude' }).then((result) => {
            res.send(result);
        }).catch((err) => {
            console.log(err);
        })
    } else {
        console.log("aaaaaaaaaa");
        console.log(req.body);
    }
}