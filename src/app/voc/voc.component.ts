import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VOCModel } from '../models/vocModel';
import { VOCService } from './voc.service';
import { SurveyUserModel } from '../models/surveyUserModel';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-voc',
  templateUrl: './voc.component.html',
  styleUrls: ['./voc.component.css']
})
export class VocComponent implements OnInit {
  public voc: FormGroup;
  public start = false;
  public thankYouPage = false;
  public butonGroup = false;
  public progressbarValue = 0;
  public buttonName: string;
  public rating = 0;
  public tempVoiceList: VOCModel[] = [];
  public showTitle = '';
  public userList: SurveyUserModel;
  public surveyId: number;
  public currentSelectedQuestion = 0;
  public dynamicOperation = false;
  public feddbackForm = false;
  public rdrSelection: string;
  public result: string;
  public isSubmitted = false;
  public jobId: string;
  public vocAllStar: false;
  public noInformation = false;


  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    console.log(event);
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    if (this.isSubmitted) {
      this.createUser();
      this.updateFeedback();
    }
  }
  // Constructor
  constructor(private formBuilder: FormBuilder, private vocService: VOCService, private route: ActivatedRoute) {
  }

  // Oninit events
  ngOnInit() {
    this.jobId = this.route.snapshot.queryParams['jobid'];
    localStorage.removeItem('rating');
    this.start = true;
    this.buttonName = 'Next >>';
    this.voc = this.formBuilder.group({
      userFeedback: [''],
      improvements: [''],
      rdrSelection: ['']
    });
  }
  // Get VOC Records for survey
  getVOCRecords(jobId: number) {
    // tslint:disable-next-line: one-variable-per-declaration
    const success = (res) => {
      if (res.Results[0] === null) {
        this.noInformation = true;
        this.start = false;
        this.thankYouPage = false;
        this.butonGroup = false;
        this.feddbackForm = false;
        this.dynamicOperation = false;
      } else {
        this.tempVoiceList = res.Results[0].JobSurveyQuestions;
        this.showTitle = res.Results[0].SurveyTitle;
        this.surveyId = res.Results[0].SurveyId;
        this.vocAllStar = res.Results[0].VocAllStar;
      }

    }, fail = (err) => {
      console.log(err);
    };
    this.vocService.getVOCRecords(jobId, success, fail);
  }

  // Start The Survey
  onStart() {
    this.createUser();
    if (this.currentSelectedQuestion === 0) {
      this.start = false;
    }
    this.butonGroup = true;
    this.thankYouPage = false;
    this.dynamicOperation = true;
    if (this.jobId !== null) {
      // tslint:disable-next-line: radix   
      this.getVOCRecords(parseInt(this.jobId));
    }
    // this.getVOCRecords(1410);
  }
  // Back button click event
  onBack() {
    this.progressbarValue = this.progressbarValue - 100 / (this.tempVoiceList.length);
    if (this.buttonName === 'Submit') {
      this.buttonName = 'Next >>';
    }
    this.currentSelectedQuestion = this.currentSelectedQuestion - 1;
    this.feddbackForm = false;
  }
  // Next button click event
  onNext() {
    if (this.currentSelectedQuestion === this.tempVoiceList.length && this.buttonName === 'Submit') {
      this.start = false;
      this.thankYouPage = true;
      this.butonGroup = false;
      this.feddbackForm = false;
      /// saving data into the database
      this.createJobSurvey();
      this.updateFeedback();
      this.isSubmitted = true;
    } else {
      switch (this.tempVoiceList[this.currentSelectedQuestion].QuestionTypeIdName) {
        case 'Range':
          this.tempVoiceList[this.currentSelectedQuestion].SelectedAnswer = this.rating.toString();
          break;
        case 'Key-In':
          this.tempVoiceList[this.currentSelectedQuestion].SelectedAnswer = this.voc.get('improvements').value;
          break;
        case 'Yes/No':
          this.tempVoiceList[this.currentSelectedQuestion].SelectedAnswer = this.voc.get('rdrSelection').value;
          break;
      }
      this.progressbarValue = this.progressbarValue + 100 / (this.tempVoiceList.length);

      if (this.tempVoiceList.length > this.currentSelectedQuestion) {
        this.start = false;
        this.thankYouPage = false;
      }
      if (this.tempVoiceList.length === this.currentSelectedQuestion + 1) {
        this.buttonName = 'Submit';
        this.feddbackForm = true;
      }
      this.currentSelectedQuestion = this.currentSelectedQuestion + 1;
    }
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
      // tslint:disable-next-line: radix
      'EntityTypeId': parseInt(this.jobId),
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
      'JobSurveyQuestions': this.tempVoiceList
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
  updateFeedback() {
    this.result = this.voc.get('userFeedback').value;
    if (this.result === '') {
      this.result = null;
    }
    const postData = {
      'Id': this.userList.Id,
      'Feedback': this.result
    }

    // tslint:disable-next-line: one-variable-per-declaration
    const success = (res) => {
      console.log(res);
    }, fail = (err) => {
      console.log(err);
    };
    this.vocService.updateFeedback(postData, success, fail);
  }

  // windowClose() {
  //   window.open('', '_parent', '');
  //   window.close();
  // }
}
