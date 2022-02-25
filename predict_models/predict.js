const tf = require('@tensorflow/tfjs-node')
const fs = require("fs");
var Path = require('path');

//var file_path = Path.join(__dirname, '..', 'public', '16_191.jpg');

//const img = fs.readFileSync(file_path)

async function predict(buffer) {

    const model = await tf.loadGraphModel('file://predict_models/tfjs_files/model.json');

    const tensor = tf.node
        .decodeImage(buffer, 3)
        .resizeNearestNeighbor([150, 150])
        .toFloat()
        .expandDims();

    const prediction = model.predict(tensor)
    const result = prediction.as1D().argMax().dataSync()[0];
    return result;
}

module.exports = predict;