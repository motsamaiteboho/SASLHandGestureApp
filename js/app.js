// Get elements from the DOM
//import * as tf from '@tensorflow/tfjs';
//import { loadLayersModel, io } from '@tensorflow/tfjs-node';
const gestureImage = document.getElementById('gesture-image');
const captureBtn = document.getElementById('capture-btn');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const capturedImage = document.getElementById('capturedImage');
const feedBack = document.getElementById('feedback');
// Dummy data for demonstration (replace with actual SASL gesture data)
const saslGestures = [
  { letter: 'A', imageUrl: 'images/A_HAND.png' },
  { letter: 'E', imageUrl: 'images/E_HAND.png' },
  { letter: 'I', imageUrl: 'images/I_HAND.png' },
  { letter: 'O', imageUrl: 'images/O_HAND.png' },
  { letter: 'U', imageUrl: 'images/U_HAND.png' },

];

// Function to randomly select a gesture and display it on the page
function displayRandomGesture() {
  const randomIndex = Math.floor(Math.random() * saslGestures.length);
  const randomGesture = saslGestures[randomIndex];
  gestureImage.src = randomGesture.imageUrl;
  gestureImage.alt = `SASL Hand Gesture for ${randomGesture.letter}`;
  gestureImage.style.display = 'block';
}

// Event listener for the "Capture Image" button
captureBtn.addEventListener('click', () => {
  setTimeout(() => {
    captureImage();
    setTimeout(async () => {
      const loadedModel = await loadModel();
      const inputImage = document.getElementById('capturedImage'); // Get input image element
      const predictions =  await predict(loadedModel, inputImage);
      feedBack.textContent = predictions;
      displayRandomGesture(); 
    }, 1000);
  }, 1000);
});

displayRandomGesture();

// Check if getUserMedia is supported by the browser
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            // Set the video stream as the source for the video element
            video.srcObject = stream;
            video.play();
        })
        .catch(function(error) {
            console.error('Error accessing the camera: ', error);
        });
} else {
    console.error('getUserMedia is not supported in this browser.');
}

// Function to capture the image from the video stream
function captureImage() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert the canvas content to a data URL and display it as an image
    capturedImage.src = canvas.toDataURL('image/jpeg');
    capturedImage.style.display = 'block';
    capturedImage.style.width = "300px"
    capturedImage.style.height = "300px"
}

// Load the model once the page is loaded
document.addEventListener('DOMContentLoaded', async () => {
  tf.ready().then(function () {
    // Now you can access tf.io
    const myData = tf.io.fromJSON(yourJSONData);
    console.log(myData);
});
  //const model = await loadModel();
  // You can store the model in a global variable or use it as needed
});

async function loadModel() {
  const modelConfigURL = 'http://localhost:3000/get-model';

  const response = await fetch(modelConfigURL);
    const modelConfig = await response.json();

  const model = await tf.loadLayersModel(tf.io.fromJSON(JSON.stringify(modelConfig)));
  //const model = await  tf.loadModel('http://localhost:3000/get-model').result;
 
  return model;
}

// Preprocess input image
function preprocessImage(image) {
  // Resize, normalize, and preprocess image here
  return preprocessedImage;
}

// Make predictions
async function predict(model, inputImage) {
  const preprocessedImage = preprocessImage(inputImage);
  const predictions = await model.predict(preprocessedImage).data();;
  return predictions;
}

