import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { PlayerService } from '../services/player.service';
import { MatchService } from '../services/match.service';

import { fadeInOutAnimation, snackBarAnimation } from "../animations/animations";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
  animations: [
    fadeInOutAnimation,
    snackBarAnimation
  ]
})
export class PlayerComponent implements OnInit {
  private modes = [{ value: 'FPP'}, { value: 'TPP'}];
  private selectedMode: string = 'FPP';
  private loading: Boolean = false;
  private showSnackBar: Boolean = false;
  private snackBarMessage: string;

  private player;
  public playerData: Observable<any>;
  public match: any;
  public matches = [];

  constructor(
  	private playerService: PlayerService, 
  	private matchService: MatchService,
  	private route: ActivatedRoute,
    private router: Router) { }
  
  ngOnInit() {
    this.playerData = null;
    this.loading = true;

    this.route
      .queryParams
      .subscribe(params => {
      	if (params.name) this.searchPlayer(params.name, params.region);
        else {
          this.loading = false;
          this.openSnack('Search player by username and region');
        }
        this.player = params;
      });
  }

  ngOnDestroy() {
    // this.sub.unsubscribe();
  }

  searchPlayer(name: string, region: string) {
  	this.playerService.getPlayer(name, region)
  		.subscribe(
      	response => {
          if (response.status) {
            this.loading = false;
            this.playerData = null;
            this.handleError(response);
          } else {
        		this.playerData = response.data[0];
        		console.log(this.playerData);
            let matchId = response.data[0].relationships.matches.data[0].id;
            if (this.matchFetched(matchId)) return;
          	else this.matchService.getMatch(response.data[0].relationships.matches.data[0].id, region)
          		.subscribe(
          			response => {
                  this.match = {
                    id: matchId,
                    myRoster: this.getMyRoster(response.included, name),
                    data: response.data,
                    included: response.included
                  }

                  this.loading = false;
                  this.matches.push(this.match);
          			}
          		);
          }
      	}
    );
  }

  previewMatchDetails(id: string) {
    this.loading = true;
    if (this.matchFetched(id)) this.loading = false;
    else this.matchService.getMatch(id, this.player.region)
      .subscribe(
        response => {
          this.match = {
            id: id,
            myRoster: this.getMyRoster(response.included, this.player.name),
            data: response.data,
            included: response.included
          }
          this.matches.push(this.match);
          this.loading = false;
        }
      );
  }

  matchFetched(id: string) {
    for (let match of this.matches) {
      if (match.id === id) {
        this.match = match;
        return true;
      }
    }
    return false;
  }

  getMyRoster(objects: any, name: string) {
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

  handleError(error: any) {
    switch(error.status) { 
     case 404: { 
        this.openSnack('Player not found');
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

  openSnack(message: string) {
    this.snackBarMessage = message;
    this.showSnackBar = true;

    setTimeout(() => {
           this.showSnackBar = false;
       }, 7000);
  }

}
