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

}
