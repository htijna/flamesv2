import React from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const Popup = styled.div`
  background: white;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 90%;
  max-width: 360px;
`;

const Emoji = styled.div`
  font-size: 30px;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  font-size: 20px;
  margin-bottom: 14px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const AllowButton = styled.button`
  flex: 1;
  background: #4caf50;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #45a049;
  }
`;

const DenyButton = styled.button`
  flex: 1;
  background: #ccc;
  color: #333;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #bbb;
  }
`;

const PermissionPopup = ({ onAllow, onDeny }) => (
  <Overlay>
    <Popup>
      <Emoji>📷 🎤 📍</Emoji>
      <Title>Allow access to Camera, Mic & Location?</Title>
      <ButtonGroup>
        <AllowButton onClick={onAllow}>Allow</AllowButton>
        <DenyButton onClick={onDeny}>Deny</DenyButton>
      </ButtonGroup>
    </Popup>
  </Overlay>
);

export default PermissionPopup;
