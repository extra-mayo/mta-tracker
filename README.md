# Configs
Create `.env` file wit the following input:
```
MTA_API_ENDPOINT = https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw
MTA_API_KEY = API-KEY-HERE
STATIONS = "R05S,R04S"
SERVER_PORT = 8080
```
# Install and Build  

Server side (root):

`npm install`  
`npm run build`

Client side:

`cd client`  
`npm install`  
`npm run build`

# Start

Server Side (8080): `npm run start`

Client Side (3000): `cd client && npm run start`


# Raspberry Pi Configs
Bring project over to `/var/www/mta-tracker` then install and build

## Client

Make Service to start client and server  
`sudo vim /etc/systemd/system/mta-tracker-client.service`


```
[Unit]
Description=MTA Tracker

[Service]
ExecStart=sh /var/www/mta-tracker/client/start_client.sh
Restart=always
User=nobody
Type=simple

Group=nogroup
Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=production
WorkingDirectory=/var/www/mta-tracker

[Install]
WantedBy=multi-user.target
```

## Server
`sudo vim /etc/systemd/system/mta-tracker-server.service`
```
[Unit]
Description=MTA Tracker

[Service]
ExecStart=sh /var/www/mta-tracker/start_server.sh
Restart=always
User=nobody
Type=simple

Group=nogroup
Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=production
WorkingDirectory=/var/www/mta-tracker

[Install]
WantedBy=multi-user.target```

```

Then enable it to run on boot
```
sudo systemctl enable mta-tracker-client
sudo systemctl enable mta-tracker-server
```
 
Then create chromium autostart  
`sudo vim ~/.config/autostart/autoChromium.desktop`
`
```
[Desktop Entry]
Type=Application
Exec=/usr/bin/chromium-browser --noerrdialogs --disable-session-crashed-bubble --disable-infobars --disable-component-update --kiosk http://localhost:3000
Hidden=false
X-GNOME-Autostart-enabled=true
Name[en_US]=AutoChromium
Name=AutoChromium
Comment=Start Chromium when GNOME starts
```


mod autostart to disable monitor dimming  
`sudo vim /etc/xdg/lxsession/LXDE-pi/autostart`

```
@xset s off
@xset -dpms
@xset s noblank
@unclutter -idle 0.1
```
unclutter is for the mouse via `sudo apt-get unclutter`