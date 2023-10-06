import MidPointSchema from "../Models/MidPoints.js"
import { findDistance } from "./calDistance.js";

export const ClosestNode = async (lat, lng, city) => {
    var idd = 'abfdb';
    var maxi = 1000000000;
    try {
        await MidPointSchema.find({ city: city }).then((result) => {
            //console.log(result);
            for (var j = 0; j < result.length; j++) {
                var dist = findDistance(lat, lng, result[j].latitude, result[j].longitude);
                //console.log(dist);
                if (dist < maxi) {
                    //console.log(dist + " " + maxi);
                    maxi = dist;
                    idd = result[j]._id;
                }
            }
        }).catch((err) => {
            console.log(err);
        })
        return idd;
    }
    catch (errBlock) {
        console.log(errBlock);
    }
}