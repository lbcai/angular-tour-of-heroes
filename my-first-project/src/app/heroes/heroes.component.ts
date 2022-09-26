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

  selectedHero?: Hero;

  heroes: Hero[] = [];

  getHeroes(): void {
    // used to assign a Hero[] directly to heroes (above), but now we return an observable from the RxJS of() - this was synchronous
    // this means the page will be unresponsive while we wait for the data
    // so we need to do Observable.subscribe() - this is asynchronous which means we can do whatever while we wait for the full Hero[] to be emitted into an observable
    // think of this like promises in js
    this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes);
  }

  onSelect(hero: Hero): void {
    this.selectedHero = hero;
    this.messageService.add(`HeroesComponent: Selected hero id=${hero.id} name=${hero.name}`);
  };

  // injection site for the service for fetching data
  // constructor should not DO anything, instead put those things into ngOnInit
  // constructor should just hook up things
  constructor(private heroService: HeroService, private messageService: MessageService) { }

  // lifecycle hook, good place to put initialization logic
  // okay to put HTTP requests to a remote server here
  ngOnInit(): void {
    this.getHeroes();
  }

}
