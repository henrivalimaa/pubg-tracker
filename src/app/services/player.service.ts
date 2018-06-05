import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class PlayerService {
	private url = 'https://api.playbattlegrounds.com/shards';
  private headers = new HttpHeaders({ 
    'Accept': 'application/vnd.api+json',
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJiNDExNmQzMC0zMDRiLTAxMzYtZTNkYi0wNDMzYzEwY2NlNzgiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTI1Mjc1MDQ0LCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6InB1YmctdHJhY2tlci02M2YxYmQxZS03YjM1LTRhMzctODhiNi0wYmI3ZGJjMjE1Y2MiLCJzY29wZSI6ImNvbW11bml0eSIsImxpbWl0Ijo1MH0.Shmo2a12aGZAq6XzpsiEEczezZDmcR091yTPZrqmulM'
  });

  constructor( private http: HttpClient ) { }

  getPlayer(name: string, region: string): Observable<any> {
  	const playerUrl = `${this.url}/${region}/players?filter[playerNames]=${name}`;

  	return this.http.get<Observable<any>>(playerUrl, { headers : this.headers })
      .pipe(
        tap(_ => console.log(`%c Fetched player: ${name}`, 'color: green; background: #000;')),
        catchError(this.handleError('getPlayer'))
      );
  }

  getPlayerById(id: string, region: string, season: string): Observable<any> {
    const playerUrl = `${this.url}/${region}/players/${id}/seasons/${season}`;

    return this.http.get<Observable<any>>(playerUrl, { headers : this.headers })
      .pipe(
        tap(_ => console.log(`%c Fetched player season: ${season}`, 'color: green; background: #000;')),
        catchError(this.handleError('getPlayerById'))
      );
  }

  getSeasons(region: string): Observable<any> {
    const url = `${this.url}/${region}/seasons`;

    return this.http.get<Observable<any>>(url, { headers : this.headers })
      .pipe(
        tap(_ => console.log(`%c Fetched seasons`, 'color: green; background: #000;')),
        catchError(this.handleError('getSeasons'))
      );
  }

  private handleError(operation: string) {
    return (error: any): Observable<any> => {
      console.log(`%c ${operation} failed: ${error.message}`, 'color: red; background: #000;');

      return of(error as any);
    };
  }
}
