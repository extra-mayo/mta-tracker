// @ts-nocheck

import React from 'react';
import { Table } from 'react-bootstrap';
import NSvg from '../static/train-symbols/N.svg';
import WSvg from '../static/train-symbols/W.svg';
import './table.css';

function TableComponent(props: any) {

    return (
        <Table bordered striped>
            <thead>
                <tr>
                    <th>
                        6 min walk
                    </th>
                    <th>{props.stationName} ({props.direction === "S" ? "Mannhattan" : "Astoria"})</th>
                    <th>
                        Your Arrival: {new Date(new Date().getTime() + 6 * 60000).toLocaleTimeString()}
                    </th>
                </tr>
            </thead>

            {props.upcomingTrips.map((trip, i) => {

                return <tbody key={i}>
                    <td><img class="train-symbol" src={trip.train === 'N' ? NSvg : WSvg} /></td>
                    <td>{trip.minAway}</td>
                    <td>{trip.arrival}</td>
                </tbody>;
            })}

        </Table>
    );
}

export default TableComponent;
