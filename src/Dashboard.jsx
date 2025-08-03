import React, { useEffect, useState } from "react";
import styled from "styled-components";

const API_BASE = "https://bkflames.up.railway.app"; // Your backend on Railway

const Container = styled.div`
  padding: 20px;
  max-width: 960px;
  margin: auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Section = styled.div`
  margin-bottom: 50px;
`;

const Title = styled.h2`
  color: #d43f5e;
  margin-bottom: 20px;
  text-align: center;
`;

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
`;

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #eee;
  padding: 16px;
  border-radius: 10px;
  width: 220px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  text-align: center;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  border-radius: 6px;
  margin-bottom: 10px;
`;

const Timestamp = styled.p`
  font-size: 12px;
  color: #777;
  margin: 0;
`;

const Names = styled.p`
  font-size: 14px;
  margin: 4px 0;
  color: #333;
`;

const ResultText = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: #d43f5e;
`;

const Dashboard = () => {
  const [photos, setPhotos] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/photos`);
        const data = await res.json();
        setPhotos(data);
      } catch (err) {
        console.error("❌ Error fetching photos:", err);
      }
    };

    const fetchResults = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/results`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("❌ Error fetching results:", err);
      }
    };

    fetchPhotos();
    fetchResults();
  }, []);

  return (
    <Container>
      <Section>
        <Title>📸 Captured Photos</Title>
        <Grid>
          {photos.length === 0 ? (
            <p>No photos available.</p>
          ) : (
            photos.map(photo => (
              <Card key={photo._id}>
                <Image src={photo.image} alt="Captured" />
                <Timestamp>{new Date(photo.timestamp || photo.createdAt).toLocaleString()}</Timestamp>
              </Card>
            ))
          )}
        </Grid>
      </Section>

      <Section>
        <Title>💘 FLAMES Results</Title>
        <Grid>
          {results.length === 0 ? (
            <p>No results available.</p>
          ) : (
            results.map(result => (
              <Card key={result._id}>
                <Names>{result.name1} ❤ {result.name2}</Names>
                <ResultText>💞 {result.result}</ResultText>
                <Timestamp>{new Date(result.timestamp || result.createdAt).toLocaleString()}</Timestamp>
              </Card>
            ))
          )}
        </Grid>
      </Section>
    </Container>
  );
};

export default Dashboard;
