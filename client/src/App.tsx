// @ts-nocheck

import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import './App.css';
import TableComponent from './components/table';

function App() {
  const [data, setData] = React.useState({});
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {

    const fetchInterval = setInterval(() =>
      fetch("/api")
        .then((res) => res.json())
        .then((data) => {
          setData(data);
          console.log(data);
        }), 500);
    //destroy interval on unmount
    return () => clearInterval(fetchInterval)
  }, []);

  React.useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 500);
    return () => clearInterval(timeInterval);
  });


  return (
    <Card className="text-center">
      <Card.Header>Dollar Store MTA Tracker</Card.Header>
      <Card.Body>
        <Card.Title>{currentTime.toLocaleString()}</Card.Title>
        <Card.Text>
          <Row>
            {Object.keys(data).map(station => {
              return <Col key={station}>
                <TableComponent
                  currentTime={currentTime}
                  upcomingTrips={data[station].upcomingTrips}
                  stationName={data[station].stationName}
                  direction={station.slice(-1)} />
              </Col>;
            })}
          </Row>

        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default App;
