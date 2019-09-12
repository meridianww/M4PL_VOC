import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-rating-star',
  templateUrl: './rating-star.component.html',
  styleUrls: ['./rating-star.component.css']
})
export class RatingStarComponent {
  @Input() max: number;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onRating = new EventEmitter<Number>();

  public maxItem: any[];
  public ratedCount: number;

  constructor() {
    this.ratedCount = 0;
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnInit() {
    this.maxItem = [];
    for (let i = 0; i < this.max; i++) {
      this.maxItem.push(i + 1);
    }

    if (this.ratedCount === 0) {
      const rating = localStorage.getItem('rating');
      if (rating !== undefined && rating !== null) {
        // tslint:disable-next-line: radix
        this.ratedCount = parseInt(rating);
      }
    }
  }
  toggleRating(s: number) {
    this.ratedCount = s;
    this.onRating.emit(this.ratedCount);
  }
}
