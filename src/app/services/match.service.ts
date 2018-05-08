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
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJiNDExNmQzMC0zMDRiLTAxMzYtZTNkYi0wNDMzYzEwY2NlNzgiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTI1Mjc1MDQ0LCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6InB1YmctdHJhY2tlci02M2YxYmQxZS03YjM1LTRhMzctODhiNi0wYmI3ZGJjMjE1Y2MiLCJzY29wZSI6ImNvbW11bml0eSIsImxpbWl0Ijo1MH0.Shmo2a12aGZAq6XzpsiEEczezZDmcR091yTPZrqmulM'
  });

  constructor( private http: HttpClient ) { }

  getMatch(id: string, region: string): Observable<any> {
  	const matchUrl = `${this.url}/${region}/matches/${id}`;
  	return this.http.get(matchUrl, { headers : this.headers })
  		.pipe( tap(_ => console.log(`Fetched match with id = ${id}`)),
      catchError(this.handleError('getMatch'))
    );
  }

  private handleError(operation: string) {
    return (error: any): Observable<any> => {

      console.error(error);
      console.log(`${operation} failed: ${error.message}`);

      return of(error as any);
    };
  }
}
