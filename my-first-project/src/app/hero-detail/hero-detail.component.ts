import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // holds info about route given to this instance of herodetailcomponent, can use to find id
import { Location } from '@angular/common'; // service for interacting with browser, lets you use back/history

import { HeroService } from '../hero.service'; // our service that lets us get hero data from the remote server
import { Hero } from '../hero';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss']
})
export class HeroDetailComponent implements OnInit {

  @Input() hero?: Hero;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
    ) { }

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    // route.snapshot = static image of route info shortly after component created
    // paramMap = dictionary of route params, id returns id value of hero to fetch
    // params are always strings, so Number() converts id into a number
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getHero(id).subscribe(hero => this.hero = hero);
  }

  goBack(): void {
    this.location.back();
  }

}
