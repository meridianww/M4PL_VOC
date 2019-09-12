import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { interval } from 'rxjs';
import { VOCModel } from '../models/vocModel';
import { VOCService } from './voc.service';
import { SurveyUserModel } from '../models/surveyUserModel';

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
  public rating = 0;
  public rangeValue: number;
  public vocList: VOCModel[] = [];
  public showTitle = '';
  public rdrSelection: string;
  public userList: SurveyUserModel;
  public surveyId: number;
  // Constructor
  constructor(private formBuilder: FormBuilder, private vocService: VOCService) {
  }

  // Oninit events
  ngOnInit() {
    localStorage.removeItem('rating');
    // localStorage.removeItem('improvements');
    // localStorage.removeItem('radioSelection');
    this.count = 0;
    this.rangeValue = 0;
    this.start = true;
    this.buttonName = 'Next >>';
    // this.rdrSelection = '';
    this.voc = this.formBuilder.group({
      improvements: [''],
      // radioSelection: ['']
    });
    this.getVOCRecords(1410);
  }
  // Get VOC Records for survey
  getVOCRecords(jobId: number) {
    // tslint:disable-next-line: one-variable-per-declaration
    const success = (res) => {
      this.vocList = res.Results[0].JobSurveyQuestions;
      this.showTitle = res.Results[0].SurveyTitle;
      this.surveyId = res.Results[0].SurveyId;
    }, fail = () => {
    };
    this.vocService.getVOCRecords(jobId, success, fail);
  }
  // Getting records operation's
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
  // Start The Survey
  onStart() {
    this.createUser();
    if (this.count === 0) {
      this.count++;
      this.start = false;
    }
    this.five = true;
    this.vocRecordsOperation(this.count);
  }
  // Back button click event
  onBack() {
    if (this.count > 1) {
      this.count--;
      this.vocRecordsOperation(this.count);
    }
    this.progressbarValue = this.progressbarValue - 100 / (this.vocList.length);
    if (this.buttonName === 'Submit') {
      this.buttonName = 'Next >>';
    }
  }
  // Next button click event
  onNext() {
    if (this.vocList[this.count - 1].QuestionTypeIdName === 'Range') {
      this.vocList[this.count - 1].SelectedAnswer = this.rating.toString();
    } else if (this.vocList[this.count - 1].QuestionTypeIdName === 'Key-In') {
      this.vocList[this.count - 1].SelectedAnswer = this.voc.get('improvements').value;

    } else if (this.vocList[this.count - 1].QuestionTypeIdName === 'Yes/No') {
      this.vocList[this.count - 1].SelectedAnswer = this.rdrSelection;
    }
    this.progressbarValue = this.progressbarValue + 100 / (this.vocList.length);

    if (this.buttonName === 'Submit') {
      this.start = false;
      this.first = false;
      this.second = false;
      this.third = false;
      this.fourth = true;
      this.five = false;
      /// saving data into the database
      this.createJobSurvey();
    }
    if (this.vocList.length > this.count) {
      this.count++;
      this.vocRecordsOperation(this.count);
    }
    if (this.vocList.length === this.count) {
      this.buttonName = 'Submit';
    }
    // localStorage.setItem('radioSelection', this.voc.get('radioSelection').value);
    // localStorage.setItem('improvements', this.voc.get('improvements').value);
  }
  // Get Rating
  onRating(rating: number) {
    this.rating = rating;
    localStorage.setItem('rating', this.rating.toString());
  }

  // User Creation
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
      this.userList = res.Results[0];
    }, fail = (err) => {
      console.log(err);
    };

    this.vocService.createUser(postData, success, fail);
  }

  createJobSurvey() {
    const postData = {
      'JobId': 1,
      'SurveyId': this.surveyId,
      'SurveyTitle': this.showTitle,
      'SurveyUserId': this.userList.Id,
      'JobSurveyQuestions': this.vocList
    }

    // tslint:disable-next-line: one-variable-per-declaration
    const success = (res) => {
      localStorage.removeItem('rating');
      console.log(res);
    }, fail = (err) => {
      localStorage.removeItem('rating');
      console.log(err);
    };

    this.vocService.createJobSurvey(postData, success, fail);
  }
}
