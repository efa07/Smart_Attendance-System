"use client";

import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

const WebcamFaceDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null); // To store the interval ID

  // Load models
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      setLoading(false);
    };

    loadModels();
  }, []);

  // Start webcam and detect faces
  useEffect(() => {
    if (!videoRef.current || loading) return;

    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    };

    const detectFaces = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas) return;

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      faceapi.matchDimensions(canvas, displaySize);

      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      // Clear canvas before drawing new detections
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw detections
      faceapi.draw.drawDetections(canvas, resizedDetections);

      // Add your name to the bounding box
      resizedDetections.forEach((detection) => {
        const { x, y, width, height } = detection.detection.box;
        const text = "Efa Tariku"; // Replace with your name
        const textOptions = {
          fontSize: 40,
          fontStyle: 'bold',
          fillStyle: 'green',
        };

        // Draw the name above the bounding box
        context.font = `${textOptions.fontSize}px Arial`;
        context.fillStyle = textOptions.fillStyle;
        context.fillText(text, x, y - 10);
      });
    };

    startWebcam();

    // Start detecting faces every 100ms
    intervalRef.current = setInterval(detectFaces, 100);

    // Cleanup function to stop the interval and webcam stream
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [loading]); // Only re-run when `loading` changes

  return (
    <div style={{ position: 'relative' }}>
      <video ref={videoRef} autoPlay muted width="640" height="480" style={{ display: 'block' }} />
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
    </div>
  );
};

export default WebcamFaceDetection;