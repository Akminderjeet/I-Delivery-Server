import DistanceEdgeSchema from "../Models/DistanceEdge.js";
import MidPointSchema from "../Models/MidPoints.js";
import { findDistance } from '../Computations/calDistance.js'
import { ClosestNode } from "../Computations/ClosestNode.js";
import { PathFinder } from '../Computations/PathCalculator.js'

export const createDelivery = async (req, res) => {
    console.log(req.body);
    var obj = req.body.obj;
    var startNode = await ClosestNode(obj.sourceLat, obj.sourceLong, obj.city);
    console.log(startNode);
    var endNode = await ClosestNode(obj.destinationLat, obj.destinationLong, obj.city);
    console.log(endNode);
    var path = PathFinder(startNode, endNode, obj.city);


}