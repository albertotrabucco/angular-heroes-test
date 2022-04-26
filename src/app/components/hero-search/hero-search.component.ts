import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Hero } from 'src/app/interfaces/hero';
import { HeroService } from 'src/app/services/hero.service';


@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.scss']
})
export class HeroSearchComponent implements OnInit {

  heroes$!: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) { }
  
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      debounceTime(300),  //wait 300ms after each keystroke before considering term
      distinctUntilChanged(), //ignore new term if same as previus term
      switchMap((term:string) => this.heroService.searchHero(term)), 
      //switch to new search observable each time the term changes
    );

  }
}
