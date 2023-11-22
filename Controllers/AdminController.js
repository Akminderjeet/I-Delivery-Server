import DistanceEdgeSchema from "../Models/DistanceEdge.js";
import MidPointSchema from "../Models/MidPoints.js";
import { findDistance } from '../Computations/calDistance.js'

export const addNode = async (req, res) => {
    console.log(req.body.obj);

    if (req.user && req.user.email == 'jeetakminder@gmail.com') {
        try {
            MidPointSchema.create(req.body.obj).then((result) => {
                var Lastid = result._id;
                MidPointSchema.find({ _id: { $ne: LastId } }, (err, Innerresult) => {
                    console.log(Innerresult);
                })
            }).catch((err) => {
                console.log(err);
            })
        } catch (err) {

        }
    } else {
        //var dist = findDistance(31.479874, 76.189781, 30.206250, 74.979467);
        //console.log(dist);
        // const object = new MidPointSchema(req.body.obj);
        // object.save();
        MidPointSchema.create(req.body.obj).then((result) => {
            console.log(result);
            var Lastid = result._id;
            MidPointSchema.find({ _id: { $ne: Lastid }, city: result.city }).then((Innerresult) => {
                console.log(Innerresult.length);
                for (var j = 0; j < Innerresult.length; j++) {
                    if (Innerresult[j].latitude && Innerresult[j].longitude) {
                        var dist = findDistance(result.latitude, result.longitude, Innerresult[j].latitude, Innerresult[j].longitude);
                        if (dist > 2000) {
                            // to add multiple points int the way
                            dist = (dist) - 400;
                            var distanceObject1 = {
                                Distance: dist,
                                FirstPoint: Lastid,
                                SecondPoint: Innerresult[j]._id,
                                City: Innerresult[j].city
                            }
                            var distanceObject2 = {
                                Distance: dist,
                                FirstPoint: Innerresult[j]._id,
                                SecondPoint: Lastid,
                                City: Innerresult[j].city
                            }
                            DistanceEdgeSchema.create(distanceObject1).then((distanceResult) => {
                                console.log(distanceResult);
                            })
                            DistanceEdgeSchema.create(distanceObject2).then((distanceResult) => {
                                console.log(distanceResult);
                            })

                        }
                    }
                }
            })
        }).catch((err) => {
            console.log(err);
        })

    }
}
export const trackPoints = async (req, res) => {
    MidPointSchema.find().then((result) => {
        res.send(result);
    }).catch((err) => {
        console.log(err);
    })
}