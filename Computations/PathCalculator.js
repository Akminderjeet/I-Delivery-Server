import MidPointSchema from "../Models/MidPoints.js"
import { findDistance } from "./calDistance.js";
import DistanceEdgeSchema from "../Models/DistanceEdge.js";

export const PathFinder = async (source, destination, city) => {
    const map = new Map();
    await MidPointSchema.find({ city: city }).then((result) => {
        for (var j = 0; j < result.length; j++) {
            var idd = result[j]._id.toString();
            map.set(idd, 1000000000);
        }
    })
    var idd = source.toString();
    map.set(idd, 0);
    const parent = new Map();
    await DistanceEdgeSchema.find({ City: city }).then((result) => {
        // console.log(result);
        for (var j = 0; j < result.length; j++) {
            for (var k = 0; k < result.length; k++) {
                var dist = result[k].Distance;
                var firstPoint = result[k].FirstPoint.toString();
                var secondPoint = result[k].SecondPoint.toString();
                var valueAtFirst = map.get(firstPoint);
                var valueAtSecond = map.get(secondPoint);
                if (valueAtFirst + dist < valueAtSecond) {
                    parent.set(secondPoint, firstPoint);
                    map.set(secondPoint, valueAtFirst + dist);
                }
            }
        }
    })
    console.log(source + ":::" + destination);
    console.log(map);
    console.log(parent);
    var res = [];
    source = source.toString();
    destination = destination.toString();
    while (destination != source && destination != undefined) {
        //console.log(destination);
        res.push(destination);
        destination = parent[destination];
    }
    res.push(source);
    console.log(res);
    return res;
}