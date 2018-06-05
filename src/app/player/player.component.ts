import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { PlayerService } from '../services/player.service';
import { MatchService } from '../services/match.service';

import { fadeAnimation, loaderFadeAnimation, snackBarAnimation } from "../animations/animations";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
  animations: [
    fadeAnimation,
    loaderFadeAnimation,
    snackBarAnimation
  ]
})
export class PlayerComponent implements OnInit {
  private modes = [{ value: 'FPP'}, { value: 'TPP'}];
  private gameModes = [
    { value: 'all'},
    { value: 'solo'}, 
    { value: 'solo-fpp'},
    { value: 'duo'},
    { value: 'duo-fpp'},
    { value: 'squad'},
    { value: 'squad-fpp'},
  ];
  private selectedMode: string = 'FPP';
  private selectedGameMode: string = 'all';
  private selectedSeason: string;
  private loading: boolean = false;
  private loadingMatch: boolean = false;
  private showSnackBar: boolean = false;
  private snackBarMessage: string;

  private params;
  private player: any;
  private match: any;
  private matches: any = [];
  private seasons: any = [];
  private gameModeStats: any;

  constructor(
  	private playerService: PlayerService, 
  	private matchService: MatchService,
  	private route: ActivatedRoute,
    private router: Router) { }
  
  ngOnInit() {
    this.params = null;
    this.loading = true;

    this.route
      .queryParams
      .subscribe(params => {
      	if (params.name) this.searchPlayerData(params.name, params.region);
        else {
          this.loading = false;
          this.openSnack('Search player by username and region');
        }
        this.params = params;
      });
  }

  ngOnDestroy() {
    // TODO: Cache service -> store player data
  }

  searchPlayerData(name: string, region: string) {
    this.loading = true;

    this.playerService.getSeasons(region)
      .subscribe(
        response => {
          if (response.status) {
            this.handleError(response);
          } else {
            this.seasons = response.data.reverse();
            this.selectedSeason = this.seasons[0].id;

            this.playerService.getPlayer(name, region)
              .subscribe(
                response => {
                  if (response.status) {
                    this.loading = false;
                    this.player = null;
                    this.gameModeStats = null;
                    this.handleError(response);
                  } else {
                    this.player = response.data[0];
                    this.playerService.getPlayerById(this.player.id, region, this.seasons[0].id)
                      .subscribe(
                        response => {
                          if (response.status) {
                            this.loading = false;
                            this.handleError(response);
                          } else {
                            this.player.seasons = [];
                            this.player.seasons.push(response);
                            this.gameModeStats = response.data.attributes.gameModeStats;
                            this.loading = false;
                            this.previewMatchDetails(this.player.relationships.matches.data[0].id);
                          }
                        }
                      );
                  }
                }
            );
          }
        }
      );
  }

  previewMatchDetails(id: string): void {
    this.loadingMatch = true;
    if (this.matchFetched(id)) this.loadingMatch = false;
    else this.matchService.getMatch(id, this.params.region)
      .subscribe(
        response => {
          this.match = {
            id: id,
            myRoster: this.getMyRoster(response.included, this.params.name),
            data: response.data,
            included: response.included
          }
          this.matches.push(this.match);
          this.loadingMatch = false;
        }
      );
  }

  getSeasonData(id: string): void {
    this.playerService.getPlayerById(this.player.id, this.params.region, id)
      .subscribe(
        response => {
          if (response.status) {
            this.handleError(response);
          } else {
            this.player.seasons.push(response);
            this.gameModeStats = response.data.attributes.gameModeStats;
          }
        }
      );
  }

  matchFetched(id: string): boolean {
    for (let match of this.matches) {
      if (match.id === id) {
        this.match = match;
        return true;
      }
    }
    return false;
  }

  getMyRoster(objects: any, name: string): any {
  	let roster = [];

  	for (let object of objects) {
	    if (object.type === 'participant' && object.attributes.stats.name === name) {
	    	let participantId = object.id;
	    	for (let object of objects) {
			    if (object.type === 'roster') {
			    	for (let participant of object.relationships.participants.data) {
			    		if (participant.id === participantId) {
			    			for (let part of object.relationships.participants.data) {
			    				roster.push(this.getParticipant(objects, part.id));
			    			}
			    		}
			    	}
			    } else continue;
				}
	    } else continue;
		}

		return roster;
  }

  getParticipant(participants: any, id: string) {
  	for (let participant of participants) {
	    if (participant.type === 'participant' && participant.id === id) {
	    	return participant;
	    } else continue;
		}
  }

  searchMatchDetails(id, region, name): void {
    this.router.navigate(['match-detail'], { queryParams: { id: id, region: region, name: name } });
  }

  searchPlayer(name: string, region: string): void {
    this.router.navigate(['player'], { queryParams: { name: name, region: region } });
  }
 
  handleError(error: any): void {
    switch(error.status) { 
      case 404: { 
        this.openSnack('Not found');
        break; 
      } 
      case 429: { 
        this.openSnack('Too many requests'); 
      break; 
      } 
      case 401: {
        this.openSnack('Invalid API key') 
        break;    
      }
      default: { 
        console.log(error); 
        break;              
      }
    }
  }

  openSnack(message: string): void {
    this.snackBarMessage = message;
    this.showSnackBar = true;

    setTimeout(() => {
           this.showSnackBar = false;
       }, 7000);
  }

}
