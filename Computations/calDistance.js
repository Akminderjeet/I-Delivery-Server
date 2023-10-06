import geolib from 'geolib'
// Initialize the map
export const findDistance = (x1, y1, x2, y2) => {
    const point1 = { latitude: x1, longitude: y1 };
    const point2 = { latitude: x2, longitude: y2 };

    // Calculate the distance in meters
    const distanceInMeters = geolib.getDistance(point1, point2);

    //console.log(`Distance between the two points: ${distanceInMeters} meters`);
    return distanceInMeters;

}