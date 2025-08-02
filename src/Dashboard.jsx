import React, { useEffect, useState } from "react";
import styled from "styled-components";

const DashboardContainer = styled.div`
  padding: 40px;
  max-width: 900px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
`;

const Section = styled.div`
  margin-bottom: 50px;
`;

const Heading = styled.h2`
  color: #d43f5e;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
`;

const Th = styled.th`
  background-color: #ffdde2;
  color: #d43f5e;
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
`;

const Td = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
`;

const Image = styled.img`
  width: 100px;
  height: auto;
  border-radius: 8px;
`;

const Dashboard = () => {
  const [photos, setPhotos] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/photos")
      .then(res => res.json())
      .then(data => setPhotos(data))
      .catch(err => console.error("Error fetching photos:", err));

    fetch("http://localhost:3001/api/results")
      .then(res => res.json())
      .then(data => setResults(data))
      .catch(err => console.error("Error fetching results:", err));
  }, []);

  return (
    <DashboardContainer>
      <Section>
        <Heading>📸 Captured Photos</Heading>
        <Table>
          <thead>
            <tr>
              <Th>Time</Th>
              <Th>Image</Th>
            </tr>
          </thead>
          <tbody>
            {photos.map((photo, idx) => (
              <tr key={idx}>
                <Td>{new Date(photo.receivedAt).toLocaleString()}</Td>
                <Td>
                  <Image src={photo.image} alt="Snapshot" />
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>

      <Section>
        <Heading>💖 FLAMES Results</Heading>
        <Table>
          <thead>
            <tr>
              <Th>Your Name</Th>
              <Th>Crush's Name</Th>
              <Th>Result</Th>
              <Th>Time</Th>
            </tr>
          </thead>
          <tbody>
            {results.map((item, idx) => (
              <tr key={idx}>
                <Td>{item.name1}</Td>
                <Td>{item.name2}</Td>
                <Td>{item.result}</Td>
                <Td>{new Date(item.createdAt).toLocaleString()}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>
    </DashboardContainer>
  );
};

export default Dashboard;
