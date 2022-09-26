import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  // service in service scenario because this heroservice also gets injected into the hero component
  constructor(private messageService: MessageService) { }

  getHeroes(): Observable<Hero[]> {
    // returns a single value, the array of mock heroes
    // we are simulating retrieval of data using RxJS's of() like with HttpClient even though we are using mock data
    const heroes = of(HEROES);
    this.messageService.add('HeroService: fetched heroes');
    return heroes;
  }

  getHero(id: number): Observable<Hero> {
    // For now, assume that a hero with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.

    // this is async, as is getHeroes. uses of() to return mock hero as Observable
    // so you can rewrite this later as an http request without changing the stuff that calls this function
    const hero = HEROES.find(h => h.id === id)!;
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(hero);
  }


}
