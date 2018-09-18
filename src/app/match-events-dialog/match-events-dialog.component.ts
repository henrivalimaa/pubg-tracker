import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material';

import * as L from 'leaflet';
import { Map } from 'leaflet';
import * as data from './data.json';

@Component({
  selector: 'app-match-events-dialog',
  templateUrl: './match-events-dialog.component.html',
  styleUrls: ['./match-events-dialog.component.css']
})
export class MatchEventsDialogComponent implements OnInit {
  private playerTelemetry: any;
  
  private map: any;
  private markerGroup: any = [];

  constructor(
    public dialogRef: MatDialogRef<MatchEventsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.processTelemetryEvents(this.data.participant, this.data.telemetry, this.data.match);
  }

  ngAfterViewInit() {}

  processTelemetryEvents(participant: any, telemetry: any, match: any): void {
    this.playerTelemetry = { events: [], counts: { vehicles: 0, kills: 0, itemPickups: 0, armorsDestroyed: 0 } };

    let safetyZones = [];

    for(let object of telemetry) {
      if (object._T == "LogPlayerKill" && object.killer.name == participant.attributes.stats.name) {
        this.playerTelemetry.events.push(object);
        this.playerTelemetry.counts.kills++;
        
        let victimIcon = L.icon({
          iconUrl: 'https://cdn.iconscout.com/public/images/icon/premium/png-512/olympics-game-shooting-aim-bullseye-airshooting-rifle-34c2fd62684866e0-512x512.png',
          iconSize:     [40, 40],
          shadowSize:   [50, 64],
          iconAnchor:   [20, 40],
          shadowAnchor: [4, 62],
          popupAnchor:  [-3, -40]
        });

        let latLng = L.latLng([ (816000 - object.victim.location.y), (object.victim.location.x) ]);
        let victimMarker = L.marker(latLng, {icon: victimIcon}).bindPopup(object.killer.name + " killed " + object.victim.name + " with " + this.getNameFromDictionary(object.damageCauserName));
        this.markerGroup.push(victimMarker);
      }

      if (object._T === 'LogCarePackageLand') {
        let carePackageIcon = L.icon({
          iconUrl: '/assets/images/markers/care_package.png',
          iconSize:     [40, 40],
          shadowSize:   [50, 64],
          iconAnchor:   [20, 40],
          shadowAnchor: [4, 62],
          popupAnchor:  [-3, -40]
        });

        let loot: string;

        for (let item of object.itemPackage.items) {
          if (item.category === 'Weapon') loot = this.getNameFromDictionary(item.itemId);
        }

        let latLng = L.latLng([ (816000 - object.itemPackage.location.y), (object.itemPackage.location.x) ]);
        let carePackageMarker = L.marker(latLng, {icon: carePackageIcon}).bindPopup('Item: ' + loot);
        this.markerGroup.push(carePackageMarker);
      }

      if (object._T == "LogPlayerKill" && object.victim.name == participant.attributes.stats.name) {
        this.playerTelemetry.events.push(object);

        let killedIcon = L.icon({
          iconUrl: 'https://cdn4.iconfinder.com/data/icons/security-overcolor/512/skull-512.png',
          iconSize:     [40, 40],
          shadowSize:   [50, 64],
          iconAnchor:   [20, 40],
          shadowAnchor: [4, 62],
          popupAnchor:  [0, -40]
        });

        let latLng = L.latLng([ (816000 - object.victim.location.y), (object.victim.location.x) ]);
        let killedMarker = L.marker(latLng, {icon: killedIcon}).bindPopup(object.killer.name + " killed " + object.victim.name + " with " + this.getNameFromDictionary(object.damageCauserName));
        this.markerGroup.push(killedMarker);
      }

      if (object._T === 'LogGameStatePeriodic' && object.gameState.redZoneRadius == 0) {
        safetyZones.push(object);
      }

      if (object._T === 'LogVehicleRide' && object.character.name === participant.attributes.stats.name) {
        this.playerTelemetry.events.push(object);
        this.playerTelemetry.counts.vehicles++;

        let vehicleIcon = L.icon({
          iconUrl: 'https://cdn0.iconfinder.com/data/icons/travel-and-transportation-flat-colorful-svg-icons/136/Travel_Transportation_holiday_vacation_fun-14-512.png',
          iconSize:     [40, 40],
          shadowSize:   [50, 64],
          iconAnchor:   [20, 40],
          shadowAnchor: [4, 62],
          popupAnchor:  [0, -40]
        });

        let latLng = L.latLng([ (816000 - object.character.location.y), (object.character.location.x) ]);
        let vehicleMarker = L.marker(latLng, {icon: vehicleIcon}).bindPopup(object.character.name + " transfered with " + this.getNameFromDictionary(object.vehicle.vehicleId));
        this.markerGroup.push(vehicleMarker);
      }

      if (object._T === 'LogItemPickup' && object.character.name === participant.attributes.stats.name) {
        if (object.item.category == 'Weapon') this.playerTelemetry.events.push(object);
        this.playerTelemetry.counts.itemPickups++;
      }
    }
    
    safetyZones = safetyZones.filter((item, index, self) =>
      index === self.findIndex((zone) => (
        zone.gameState.safetyZoneRadius === item.gameState.safetyZoneRadius
      ))
    );

    for (let zone of safetyZones) {
      if ((zone.common.isGame % 1) === 0) {
        let zoneMarker = L.circle(
          [816000 - zone.gameState.safetyZonePosition.y, zone.gameState.safetyZonePosition.x],
          {Opacity:0.1, color:'#335c9a', radius: zone.gameState.safetyZoneRadius})
        .bindPopup('Safety Zone');
        this.markerGroup.push(zoneMarker);
      }
    }
  }

  validateTabChange(event: MatTabChangeEvent): void {
    if (event.tab.textLabel == 'Map') {
      this.map =  L.map('map', {
        crs: L.CRS.Simple,
        minZoom: -10
      });

      let img: string;
      if (this.data.match.data.attributes.mapName === 'Desert_Main') img = 'assets/images/maps/Miramar.jpg'
      else img = 'assets/images/maps/Erangel.jpg';
      
      this.map.fitBounds([[0, 0], [816000,816000]]); // Map size = 8km x 8km
      L.imageOverlay(img, [[0, 0], [816000,816000]]).addTo(this.map);
      L.layerGroup(this.markerGroup).addTo(this.map);
    }
  }

  getNameFromDictionary(name: string): string {
    let result: string;
    Object.entries(data).forEach(
      ([key, value]) => { if (key == name) result = value; }
    );

    if (result === 'Player') return 'Bleed out damage';
    return result;
  }

  close(): void {
    this.dialogRef.close();
  }

}
