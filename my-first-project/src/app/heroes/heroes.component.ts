import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit {

  heroes: Hero[] = [];

  getHeroes(): void {
    // used to assign a Hero[] directly to heroes (above), but now we return an observable from the RxJS of() - this was synchronous
    // this means the page will be unresponsive while we wait for the data
    // so we need to do Observable.subscribe() - this is asynchronous which means we can do whatever while we wait for the full Hero[] to be emitted into an observable
    // think of this like promises in js
    this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes);
  }

  // injection site for the service for fetching data
  // constructor should not DO anything, instead put those things into ngOnInit
  // constructor should just hook up things
  constructor(private heroService: HeroService, private messageService: MessageService) { }

  // lifecycle hook, good place to put initialization logic
  // okay to put HTTP requests to a remote server here
  ngOnInit(): void {
    this.getHeroes();
  }

  // when name not blank, create hero object with name given, then pass to heroservice's addHero()
  // when addHero() creates new hero, subscribe receives the new hero and pushes to list of heroes for display
  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero.id).subscribe(); // deletion is delegated to service, but subscribe means we
    // still update the heroes displayed here within the component in the previous line (with filter).
    // we still subscribe even though there's nothing we do with the observable that is returned from deleteHero (async life...)
    // observables do nothing until something subscribes
  }

}
