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
// Event listener for the "Capture Image" button
captureBtn.addEventListener('click', async () => {
  setTimeout(() => {
    captureImage();
    setTimeout(async () => {
      const inputImage = document.getElementById('capturedImage'); // Get input image element

      // Ensure the model is loaded before making predictions
      const model = await loadModel();

      const predictions = await predict(model, inputImage);
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
   const model = await loadModel();
  //  if (model) {
  //   console.log('Layer names:', model.layers.map(layer => layer.name));
  // }
  // const model2 = await loadModel();
  //  if (model2) {
  //   console.log(model2.summary());
  //  }
  // You can store the model in a global variable or use it as needed
});

async function loadModel() {
  const modelConfigURL = 'http://localhost:3000/get-model';
  try {
    const model = await tf.loadLayersModel(modelConfigURL);
    console.log('Model loaded successfully:', model);
    return model;
  } catch (error) {
    console.error('Error loading the model:', error);
    return null;
  }
}
// Function to preprocess an image
function preprocessImage(image) {
  // Create a canvas element to manipulate the image
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');

  // Define the target size for your image (20x20 pixels)
  var targetWidth = 20;
  var targetHeight = 20;

  // Set the canvas size to match the target size
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  // Draw the image onto the canvas and resize it
  ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

  // Get the pixel data from the canvas
  var imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);

  // Normalize and convert to grayscale (1 channel)
  var inputBuffer = new Float32Array(targetWidth * targetHeight);
  for (var i = 0; i < imageData.data.length / 4; i++) {
    // Convert RGB to grayscale using luminance formula (0.2989 R + 0.5870 G + 0.1140 B)
    var grayscaleValue =
      0.2989 * imageData.data[i * 4] +
      0.5870 * imageData.data[i * 4 + 1] +
      0.1140 * imageData.data[i * 4 + 2];

    // Normalize the pixel value to the range [0, 1]
    inputBuffer[i] = grayscaleValue / 255;
  }

  // Create a tensor with shape [1, 20, 20, 1]
  var preprocessedImage = tf.tensor([inputBuffer], [1, targetWidth, targetHeight, 1]);

  return preprocessedImage;
}

// Function to preprocess an image and make predictions
async function predict(model, inputImage) {
  try {
    const preprocessedImage = preprocessImage(inputImage);
    
    if (model) {
      const predictions = await model.predict(preprocessedImage);
      console.log('Predictions:', predictions); // Log predictions for debugging
      // Get the class with the highest probability
      return predictions.argMax(1).dataSync()[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error in predict function:', error);
    return null; // Return a placeholder or handle the error gracefully
  }
}



