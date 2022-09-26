import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: [ './hero-search.component.scss' ]
})
export class HeroSearchComponent implements OnInit {
  heroes$!: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) {}

  // Push a search term into the observable stream.
  // RxJS Subject = a source of observables and an observable itself, can be subscribed to, can push more observable values into it with .next(value)
  search(term: string): void {
    this.searchTerms.next(term);
  }

  // prevent spam and waste of data plan with constant searching when not needed using delays and not updating search term unless needed
  // remember this component class doesn't subscribe to heroes$ observable, instead that happens in the html for this component with the AsyncPipe
  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      // cancels and discards previous observables/requests and only uses the latest search term
      // only returns the result from latest search term. it's possible to have multiple search results incoming and out of order, discards those
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
  }

}
