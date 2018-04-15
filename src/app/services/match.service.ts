import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class MatchService {
	private url = 'https://api.playbattlegrounds.com/shards';
  private headers = new HttpHeaders({ 
    'Accept': 'application/vnd.api+json',
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJjNTgyOGM5MC0xZDQ1LTAxMzYtNmIyZi0wYTkwYmQ4MzZiODkiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTIzMTgzNDI0LCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6InB1YmctdHJhY2tlci02M2YxYmQxZS03YjM1LTRhMzctODhiNi0wYmI3ZGJjMjE1Y2MiLCJzY29wZSI6ImNvbW11bml0eSIsImxpbWl0IjoxMH0.4XST9Fge9SxSRlwLPVl5AU3lKEUlhnE0NGJ45-MLUM8'
  });

  constructor( private http: HttpClient ) { }

  getMatch(id: string, region: string): Observable<any> {
  	const matchUrl = `${this.url}/${region}/matches/${id}`;
  	return this.http.get(matchUrl, { headers : this.headers })
  		.pipe( tap(_ => console.log(`Fetched match with id = ${id}`)),
      catchError(console.log(`Fetching match with id = ${id} has failed`))
    );
  }
}
