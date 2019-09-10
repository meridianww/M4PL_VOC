import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { interval } from 'rxjs';

@Component({
  selector: 'app-voc',
  templateUrl: './voc.component.html',
  styleUrls: ['./voc.component.css']
})
export class VocComponent implements OnInit {
  public voc: FormGroup;
  public count: number;
  public start = false;
  public first = false;
  public second = false;
  public third = false;
  public fourth = false;
  public five = false;
  public progressbarValue = 0;
  public curSec = 0;
  public buttonName: string;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.count = 0;
    this.start = true;
    this.buttonName = 'Next >>';
    this.voc = this.formBuilder.group({
      improvements: ['']

    });
  }
  onStart() {
    if (this.count <= 1) {
      this.count = this.count + 1;
    }
    this.showTab();
    this.five = true;
  }
  onBack() {
    if (this.count > 1) {
      this.count = this.count - 1;
    }
    this.showTab();
  }
  onNext() {
    this.count = this.count + 1;
    this.showTab();
    if (this.buttonName === 'Submit') {
      console.log('it is me');
    }
  }
  showTab() {
    this.start = false;
    this.first = false;
    this.second = false;
    this.third = false;
    this.fourth = false;
    this.buttonName = 'Next >>';
    if (this.count === 0) {
      this.start = true;
    } else if (this.count === 1) {
      this.first = true;
      this.startTimer(100);
    } else if (this.count === 2) {
      this.second = true;
      this.startTimer(60);
    } else if (this.count === 3) {
      this.third = true;
      this.buttonName = 'Submit';
      this.startTimer(30);
    } else if (this.count === 4) {
      this.fourth = true;
      this.five = false;
    }
  }
  startTimer(seconds: number) {
    const time = seconds;
    const timer$ = interval(1000);

    const sub = timer$.subscribe((sec) => {
      this.progressbarValue = 100 - sec * 100 / seconds;
      this.curSec = sec;

      if (this.curSec === seconds) {
        sub.unsubscribe();
      }
    });
  }
}
