// @ts-nocheck
import axios from 'axios';
import { time } from 'console';
import gtfsRB from 'gtfs-rb';
const { FeedMessage } = gtfsRB.transit_realtime;
import * as stationData from './../data/station-data.json';


export class MTAController {
  static async createMTARequest(url: string, apiKey: string) {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        headers: {
          'x-api-key': apiKey,
        },
      });
      return response;
    } catch (err) {
      return err;
    }
  }

  static deserializeMTAResponse(response: any) {
    if (response.status === 200) {
      const feed = FeedMessage.decode(Buffer.from(response.data, 'binary'));
      return feed;
    } else {
      return response.response;
    }
  }

  static extractAllTripUpdates(feedEntities: any, userStations: any) {
    const stations = {};
    userStations.split(',').forEach(station => {
      stations[station] = {
        stationName: stationData[station].stop_name,
        upcomingTrips: []
      };
    })
    
    const currentTimeInSeconds = Math.round(Date.now()/1000);

    feedEntities.forEach(feedEntity => {
      if (feedEntity.tripUpdate) { // is tripUpdate obj
        const tripUpdate = feedEntity.tripUpdate;
        const stopTimeUpdates = tripUpdate.stopTimeUpdate;
        stopTimeUpdates.forEach(stopTimeUpdate => {
          if( stopTimeUpdate.stopId in stations) {
            const secDiff = stopTimeUpdate.departure.time.low - currentTimeInSeconds;
            if (secDiff >= 0) {
              stations[stopTimeUpdate.stopId].upcomingTrips.push({
                train: tripUpdate.trip.routeId,
                arrival: this.convertEpoch(stopTimeUpdate.arrival.time.low),
                departure: this.convertEpoch(stopTimeUpdate.departure.time.low),
                minAway: this.secsToMins(secDiff)
              });
            }
          }
        });
      }
    });

    return stations;
  }

  static secsToMins(time: number): string {
    const minutes: number = Math.floor(time / 60);
    const seconds: number = time - minutes * 60;
    return `${minutes}m, ${seconds}s`;
  }

  static convertEpoch(time: number): string {
    const date: Date = new Date(time * 1000);
    return date
      .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      .toLowerCase();
  }
}
