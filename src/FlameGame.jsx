import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const API_BASE = "https://bkflames.up.railway.app"; // your backend

const Container = styled.div`
  padding: 20px;
  font-family: sans-serif;
  text-align: center;
`;

const Video = styled.video`
  width: 320px;
  height: 240px;
  border: 2px solid red;
  margin-bottom: 10px;
`;

const Canvas = styled.canvas`
  display: none;
`;

const ImgPreview = styled.img`
  margin-top: 10px;
  width: 160px;
  height: auto;
  border: 2px solid #888;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  margin-top: 10px;
`;

const FlamesGame = () => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [capturedImage, setCapturedImage] = useState(null);

  // 🔁 Start camera on mount
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", true); // for iOS
          console.log("✅ Camera started");
        }
      } catch (err) {
        console.error("❌ Failed to access camera:", err);
        alert("Camera access denied or failed. Please allow camera permissions.");
      }
    };

    startCamera();
  }, []);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size to match actual video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    console.log("📏 Drawing from video:", video.videoWidth, "x", video.videoHeight);

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/jpeg");
    setCapturedImage(imageData);

    sendToBackend(imageData);
  };

  const sendToBackend = async (imageData) => {
    try {
      const res = await fetch(`${API_BASE}/api/save-photo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Backend error:", text);
      } else {
        console.log("📤 Photo sent to backend");
      }
    } catch (err) {
      console.error("❌ Network error:", err);
    }
  };

  return (
    <Container>
      <h1>📸 FLAMES Camera Test</h1>
      <Video ref={videoRef} autoPlay muted playsInline />
      <Canvas ref={canvasRef} />

      <Button onClick={handleCapture}>Capture Photo</Button>

      {capturedImage && (
        <>
          <h3>🖼 Captured Image:</h3>
          <ImgPreview src={capturedImage} alt="Captured preview" />
        </>
      )}
    </Container>
  );
};

export default FlamesGame;
