import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { MatPaginator, MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatchService } from '../services/match.service'
import { TelemetryService } from '../services/telemetry.service';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ComparisonDialogComponent } from '../comparison-dialog/comparison-dialog.component';
import { MatchEventsDialogComponent } from '../match-events-dialog/match-events-dialog.component';

import { fadeAnimation, loaderFadeAnimation } from "../animations/animations";

@Component({
  selector: 'app-match-detail',
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.css'],
  animations: [
    fadeAnimation,
    loaderFadeAnimation
  ]
})
export class MatchDetailComponent implements OnInit {
  private loading: boolean = false;
  private loadingTelemetry: boolean = false;
  private loaderMessage: string;
  private layerGroup: any;
  private params: any;
	private match: any;
  private myRoster: any;
  private selectedFilter: any;
  private selectedRoster: string;
  private selectedParticipant: string;
  private telemetry: any;
  private compareList: any = [];
	private filters: any = [
    {name: 'Placement', value: 'winPlace'}, 
    {name: 'Kills', value:'kills'}, 
    {name: 'Assists', value:'assists'},
    {name: 'Headshots', value:'headshotKills'}, 
    {name: 'Damage', value: 'damageDealt'}, 
    {name: 'DBNOs', value: 'DBNOs'}
  ];

  constructor(
  	private route: ActivatedRoute,
  	private matchService: MatchService,
    private telemetryService: TelemetryService,
  	private location: Location,
    public dialog: MatDialog
	) { }

  ngOnInit() {
    this.loading = true;
    this.loaderMessage = 'Fetching match data...';
    this.selectedFilter = this.filters[0].value;
  	this.getMatch();
  }

  ngAfterViewInit() {
    window.scrollTo(0, window.innerHeight + 200000); // TODO: This needs to fixed in router module
  }

  getMatch(): void {
  	this.route
      .queryParams
      .subscribe(params => {
        this.params = params;
      	this.matchService.getMatch(params.id, 'pc-eu')
    			.subscribe(response => {
    				this.match = this.processResponse(params, response);
            this.getMatchTelemetry(this.match.telemetry.url);
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
      telemetry: { url : this.getMatchTelemetryUrl(response.included), data: {} },
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

  getMatchTelemetryUrl(objects: any): string {
    for (let object of objects) {
      if (object.type == 'asset' && object.attributes.name == 'telemetry') {
        return object.attributes.URL;
      }
    }
  }

  getMatchTelemetry(url: string): void {
    this.loaderMessage = 'Fetching match telemetry...';
    this.telemetryService.getMatchTelemetry(url)
      .subscribe(response => {
        this.telemetry = response;
        this.loading = false;
      });
  }

  displayEvents(participant: any): void {
    let dialogRef = this.dialog.open(MatchEventsDialogComponent, {
      width: '60em',
      data: { participant: participant, telemetry: this.telemetry, match: this.match }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The match events dialog was closed');
    });
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

  compareTeam(participants:any, event: Event): void {
    event.stopPropagation();
    this.compareList = participants;
  }

  addToCompareList(participant: any, event: Event): void {
    event.stopPropagation();
    console.log(participant);
    if (this.compareList.length < 4) {
      this.compareList.push(participant);
      this.compareList = this.compareList.filter((obj, index, self) =>
        index === self.findIndex((p) => (
          p.id === obj.id
        ))
      );
    }
  }

  removeFromComparision(participant: any): void {
    for (let i = 0; i < this.compareList.length; i++) {
      if (this.compareList[i].id === participant.id) {
        this.compareList.splice(i, 1);
      }
    }
  }

  closeComparision(): void {
    this.compareList = [];
  }

  openComparisonDialog(component: any): void {
    let dialogRef = this.dialog.open(ComparisonDialogComponent, {
      width: '60em',
      data: this.compareList
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The component dialog was closed');
    });
  }

}









