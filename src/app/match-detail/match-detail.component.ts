import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatPaginator, MatTableDataSource } from '@angular/material';

import { MatchService } from '../services/match.service'
import { TelemetryService } from '../services/telemetry.service';

@Component({
  selector: 'app-match-detail',
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.css']
})
export class MatchDetailComponent implements OnInit {
	private match: any;
  private myRoster: any;
  private selectedFilter: any;
  private selectedRoster: string;
  private telemetry: any;
  private playerTelemetry: any;
	private filters: any = [{value: 'rank'}, {value:'kills'}, {value: 'damage'}, {value: 'DBNOs'}];

  constructor(
  	private route: ActivatedRoute,
  	private matchService: MatchService,
    private telemetryService: TelemetryService,
  	private location: Location
	) { }

  ngOnInit() {
    this.selectedFilter = this.filters[0].value;
  	this.getMatch();
  }

  getMatch(): void {
  	this.route
      .queryParams
      .subscribe(params => {
      	this.matchService.getMatch(params.id, 'pc-eu')
    			.subscribe(response => {
    				console.log(response)
    				this.match = this.processResponse(params, response);
            this.getTelemetry(this.match.telemetry.url);
            this.selectedRoster = this.match.rosters[0].id;
            this.myRoster = this.getMyRoster(this.match.rosters);
    			});
      });
  }

  processResponse(params: any, response: any): any {
  	let participants = this.getMatchParticipants(response.included);
    
    let match = {
  	 	data: response.data,
  		requester: { playerName: params.name, region: params.region },
  		rosters: this.sortRostersByRank(this.getRosters(response.included)),
      telemetry: { url : this.getTelemetryUrl(response.included), data: {} },
  		participants: this.sortParticipantsByProperty('kills', Object.assign([], participants)),
  		topPerformers: {
  			kills: this.getTopPerfomers('kills', Object.assign([], participants)),
  			damage: this.getTopPerfomers('damageDealt', Object.assign([], participants)),
  			dbnos: this.getTopPerfomers('DBNOs', Object.assign([], participants))
  		},
  		reponse: response
  	};
  	return match;
  }

  getTelemetryUrl(objects: any): string {
    for (let object of objects) {
      if (object.type == 'asset' && object.attributes.name == 'telemetry') {
        return object.attributes.URL;
      }
    }
  }

  getTelemetry(url: string): void {
    this.telemetryService.getTelemetry(url)
      .subscribe(response => {
        this.telemetry = response;
      });
  }

  getParticipantTelemetry(name: string): any {
    this.playerTelemetry = [];

    for(let object of this.telemetry) {
      if (object._T == "LogPlayerKill" && object.killer.name == name) {
        this.playerTelemetry.push(object);
        console.log(object);
      }
      
      if (object._T == 'LogPlayerTakeDamage' && 
        object.attacker.name == name && 
        (object.victim.health - object.damage) == 0) // console.log(object);
    }
  }

  getMyRoster(rosters: any): any {
    for (let roster of rosters) {
      for (let participant of roster.participants) {
        if (participant.attributes.stats.name === this.match.requester.playerName) {
          return roster;
        }
      }
    }
  }

  getRosters(objects: any): Array<any> {
  	let rosters = [];
    let participants = [];

  	for (let object of objects) {
			if (object.type === 'roster') {
				rosters.push(object);
			} else participants.push(object);
		}

		return this.processRosters(rosters, participants);
  }

  processRosters(rosters: any, participants: any): Array<any> {
    let processedRosters = [];

    for (let roster of rosters) {
      let processedRoster = { 
        id: roster.id,
        rank: roster.attributes.stats.rank, 
        stats: { kills: 0, damage: 0, dbnos: 0 }, 
        participants: []
      };

      for (let participant of roster.relationships.participants.data) {
        processedRoster.participants.push(this.getRosterParticipant(participant.id, participants));
      }

      for (let participant of processedRoster.participants) {
        processedRoster.stats.kills += participant.attributes.stats.kills;
        processedRoster.stats.damage += participant.attributes.stats.damageDealt;
        processedRoster.stats.dbnos += participant.attributes.stats.DBNOs;
      }

      processedRosters.push(processedRoster);
    }

    return processedRosters;
  }

  getMatchParticipants(objects: any): any {
  	let participants = [];

  	for (let object of objects) {
			if (object.type === 'participant') {
				participants.push(object);
			}
		}

		return participants;
  }

  getRosterParticipant(id: string, participants: any): any {
    for (let participant of participants) {
      if (participant.id === id) return participant;
    }
  }

  getHighlight(id: string): string {
    for (let participant of this.myRoster.participants) {
      if (participant.id == id) return 'highlight';
    }
  }

  getTopPerfomers(propertName: string, participants: Array<any>): Array<any> {
  	return this.sortParticipantsByProperty(propertName, participants).slice(0, 5);
  }

  sortRostersByRank(rosters: any): Array<any> {
    rosters.sort((a, b): number => {
      if (a['rank'] < b['rank']) return -1;
      if (a['rank'] > b['rank']) return 1;
      return 0;
    });

    return rosters;
  }

  sortParticipantsByProperty(propertName: string, players: any): Array<any> {
  	players.sort((a, b): number => {
			if (a.attributes.stats[propertName] < b.attributes.stats[propertName]) return 1;
			if (a.attributes.stats[propertName] > b.attributes.stats[propertName]) return -1;
			return 0;
		});

		return players;
  }

  goBack(): void {
  	this.location.back();
  }

}
