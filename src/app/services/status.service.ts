import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class StatusService {
	private url = 'https://api.playbattlegrounds.com/status';
  private headers = new HttpHeaders({ 
    'Accept': 'application/vnd.api+json',
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJiNDExNmQzMC0zMDRiLTAxMzYtZTNkYi0wNDMzYzEwY2NlNzgiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTI1Mjc1MDQ0LCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6InB1YmctdHJhY2tlci02M2YxYmQxZS03YjM1LTRhMzctODhiNi0wYmI3ZGJjMjE1Y2MiLCJzY29wZSI6ImNvbW11bml0eSIsImxpbWl0Ijo1MH0.Shmo2a12aGZAq6XzpsiEEczezZDmcR091yTPZrqmulM'
  });

  constructor( private http: HttpClient ) { }

  getApiStatus(): Observable<any> {
  	return this.http.get<Observable<any>>(this.url, { headers : this.headers })
      .pipe(
        tap(_ => console.log(`%c Fetched api status`, 'color: green; background: #000;')),
        catchError(this.handleError('getApiStatus'))
      );
  }

  private handleError(operation: string) {
    return (error: any): Observable<any> => {
      console.log(`%c ${operation} failed: ${error.message}`, 'color: red; background: #000;');

      return of(error as any);
    };
  }
}
