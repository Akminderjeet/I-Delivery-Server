import DistanceEdgeSchema from "../Models/DistanceEdge.js";
import MidPointSchema from "../Models/MidPoints.js";
import { findDistance } from '../Computations/calDistance.js'
import { ClosestNode } from "../Computations/ClosestNode.js";
import { PathFinder } from '../Computations/PathCalculator.js'
import Orders from "../Models/Orders.js";

export const createDelivery = async (req, res) => {
    console.log(req.body);
    var obj = req.body.obj;
    var startNode = await ClosestNode(obj.sourceLat, obj.sourceLong, obj.city);
    console.log(startNode);
    var endNode = await ClosestNode(obj.destinationLat, obj.destinationLong, obj.city);
    console.log(endNode);
    var path = await PathFinder(startNode, endNode, obj.city);
    var order = {};
    order.start = { lat: obj.sourceLat, lng: obj.sourceLong };
    order.end = { lat: obj.destinationLat, lng: obj.destinationLong };
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
}