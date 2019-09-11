import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { interval } from 'rxjs';
import { VOCModel } from '../models/vocModel';
import { VOCService } from './voc.service';

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
  public buttonName: string;
  public questionType: string;
  public rating = 0;
  public rangeValue: number;
  public vocList: VOCModel[] = [];
  public showTitle = '';

  constructor(private formBuilder: FormBuilder, private vocService: VOCService) {
  }

  ngOnInit() {
    this.count = 0;
    this.rangeValue = 0;
    this.start = true;
    this.buttonName = 'Next >>';
    this.voc = this.formBuilder.group({
      improvements: ['']

    });
    this.getVOCRecords(1410);
  }

  getVOCRecords(jobId: number) {
    // tslint:disable-next-line: one-variable-per-declaration
    const success = (res) => {
      this.vocList = res.Results[0].JobSurveyQuestions;
      this.showTitle = res.Results[0].SurveyTitle;
    }, fail = () => {
    };
    this.vocService.getVOCRecords(jobId, success, fail);
  }

  vocRecordsOperation(count: number) {
    this.start = false;
    this.first = false;
    this.second = false;
    this.third = false;
    this.fourth = false;

    if (this.vocList[count - 1].QuestionTypeIdName === 'Range') {
      // this.rating; have to save previous record for limit at client side
      this.first = true;
      this.rangeValue = (this.vocList[count - 1].EndRange - this.vocList[count - 1].StartRange);
    } else if (this.vocList[count - 1].QuestionTypeIdName === 'Key-In') {
      this.second = true;
    } else if (this.vocList[count - 1].QuestionTypeIdName === 'Yes/No') {
      this.third = true;
    }
  }
  onStart() {
    this.createUser();
    if (this.count === 0) {
      this.count++;
      this.start = false;
    }
    this.five = true;
    this.vocRecordsOperation(this.count);
  }
  onBack() {
    if (this.count > 1) {
      this.count--;
      this.vocRecordsOperation(this.count);
    }
  }
  onNext() {
    if (this.buttonName === 'Submit') {
      this.start = false;
      this.first = false;
      this.second = false;
      this.third = false;
      this.fourth = true;
      this.five = false;
      console.log('it is me');
    }
    if (this.vocList.length > this.count) {
      this.count++;
      this.vocRecordsOperation(this.count);
    }
    if (this.vocList.length === this.count) {
      this.buttonName = 'Submit';
    }
  }
  onRating(rating: number) {
    this.rating = rating;
  }

  createUser() {
    const postData = {
      'Id': 0,
      'Name': null,
      'Age': null,
      'GenderId': null,
      'EntityTypeId': 1410,
      'EntityType': 'Job',
      'UserId': null,
      'SurveyId': null,
      'Feedback': null
    }

    // tslint:disable-next-line: one-variable-per-declaration
    const success = (res) => {
      console.log(res);
    }, fail = (err) => {
      console.log(err);
    };

    this.vocService.createUser(postData, success, fail);
  }
}
