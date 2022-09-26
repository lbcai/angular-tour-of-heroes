import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  // URL to web api, defined as :base/:collectionName
  // base = resource to which requests are made
  // collection name = heroes data object in in-memory-data-service.ts
  private heroesUrl = 'api/heroes';

  // for saving to 'server'
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  // service in service scenario because this heroservice also gets injected into the hero component
  constructor(private http: HttpClient, private messageService: MessageService) { }


  /** Log a HeroService message with the MessageService */
  // don't have to keep injecting messageservice all over the app if you just make a log method
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  getHeroes(): Observable<Hero[]> {
    // returns a single value, the array of mock heroes
    // we are simulating retrieval of data using RxJS's of() like with HttpClient even though we are using mock data
    //const heroes = of(HEROES);
    //this.messageService.add('HeroService: fetched heroes');
    //return heroes;

    // converted to use HttpClient as if really getting info from a remote server
    // still returns an Observable<Hero[]>
    // each request returns 1 response (1 array of heroes
    // HttpClient.get() returns the body of the response as an untyped JSON object by default. Applying the optional type specifier, <Hero[]> ,
    // adds TypeScript capabilities, which reduce errors during compile time.)
    // APIs can return data in whatever form. sometimes the thing you want is buried inside another object. use RxJS's map() on your observable to handle this
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap(_ => this.log('fetched heroes')), // tap into the observable and send a message, return void
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

// see above: catchError is given a function that handles errors (below)
// we wrote a general function for handling multiple errors from different places, we pass it the name of the failed function and what we want to return in event of error

/**
 * Handle Http operation that failed.
 * Let the app continue.
 *
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
 private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    this.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}

  getHero(id: number): Observable<Hero> {
    // For now, assume that a hero with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.

    // this is async, as is getHeroes. uses of() to return mock hero as Observable
    // so you can rewrite this later as an http request without changing the stuff that calls this function
    //const hero = HEROES.find(h => h.id === id)!;
    //this.messageService.add(`HeroService: fetched hero id=${id}`);
    //return of(hero);

    /** GET hero by id. Will 404 if id not found */
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`)) // to catch errors, pipe the observable result into a catchError
    );

  }

  /** PUT: update the hero on the server */
  // put requires url (unchanged), data to update (hero), options (heroes web api expects a special header in http save requests, we will put it here)
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /** POST: add a new hero to the server */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
  );
}

/** DELETE: delete the hero from the server */
deleteHero(id: number): Observable<Hero> {
  const url = `${this.heroesUrl}/${id}`;

  return this.http.delete<Hero>(url, this.httpOptions).pipe(
    tap(_ => this.log(`deleted hero id=${id}`)),
    catchError(this.handleError<Hero>('deleteHero'))
  );
}

/* GET heroes whose name contains search term */
searchHeroes(term: string): Observable<Hero[]> {
  if (!term.trim()) {
    // if not search term, return empty hero array.
    return of([]);
  }
  return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
    tap(x => x.length ?
       this.log(`found heroes matching "${term}"`) :
       this.log(`no heroes matching "${term}"`)),
    catchError(this.handleError<Hero[]>('searchHeroes', []))
  );
}

}
