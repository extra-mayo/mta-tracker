// @ts-nocheck
import dotenv from 'dotenv';
import cors from 'cors';
import { MTAController } from './controllers/mta.controller';

const express = require('express');

dotenv.config();
const app = express();
const port = process.env.SERVER_PORT;
app.use(cors()); // <-- this motherfucker right here wasted 2 days of my time


// start the Express server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

// define a route handler for the default home page
app.get('/api', async (req: any, res: any) => {  
  const mtaReq = await MTAController.createMTARequest(

    process.env['MTA_API_ENDPOINT'],
    process.env['MTA_API_KEY'],
  );
  const mtaResp = MTAController.deserializeMTAResponse(mtaReq);
  const schedule = MTAController.extractAllTripUpdates(mtaResp.entity, process.env['STATIONS']);
  console.log(schedule);
  res.send(schedule);
});
