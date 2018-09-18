import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class TelemetryService {
  private headers = new HttpHeaders({ 
    'Accept': 'application/vnd.api+json',
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJiNDExNmQzMC0zMDRiLTAxMzYtZTNkYi0wNDMzYzEwY2NlNzgiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTI1Mjc1MDQ0LCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6InB1YmctdHJhY2tlci02M2YxYmQxZS03YjM1LTRhMzctODhiNi0wYmI3ZGJjMjE1Y2MifQ.xpeJA2yP95zt1i8TblDqCeOf_QrmIoSvycHYvF3l-3s'
  });

  constructor( private http: HttpClient ) { }

  getMatchTelemetry(url: string): Observable<any> {
  	return this.http.get<Observable<any>>(url, { headers : this.headers })
      .pipe(
        tap(_ => console.log(`%c Fetched match telemetry`, 'color: green; background: #000;')),
        catchError(this.handleError('getTelemetry'))
      );
  }

  private handleError(operation: string) {
    return (error: any): Observable<any> => {

      console.error(error);
      console.log(`%c ${operation} failed: ${error.message}`, 'color: red; background: #000;');

      return of(error as any);
    };
  }

}
