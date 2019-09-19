import { Component, OnInit, HostListener } from '@angular/core';
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
  public isSubmitted = false;
  public jobId: string;
  public vocAllStar: false;
  public noInformation = false;
  public enableSpinner = false;
  public feedback = '';
  public arr = [];
  public i = 0;
  public EntityTypeId: number;

  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    console.log(event);
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    if (this.isSubmitted) {
      this.updateFeedback();
    }
  }
  // Constructor
  constructor(private vocService: VOCService, private route: ActivatedRoute) {
  }

  // Oninit events
  ngOnInit() {
    this.jobId = this.route.snapshot.queryParams.jobid;
    localStorage.clear();
    this.start = true;
    this.buttonName = 'Next';
  }

  arrRect(count: number) {
    for (this.i = 0; this.i < count; this.i++) {
      this.arr[this.i] = this.i;
    }
    return this.arr;
  }

  ratingBynumber(event, j, index) {
    this.tempVoiceList[index].SelectedAnswer = j + 1;
  }
  // Get VOC Records for survey
  getVOCRecords(jobId: string) {
    this.enableSpinner = true;
    // tslint:disable-next-line: one-variable-per-declaration
    const success = (res) => {
      this.enableSpinner = false;
      this.butonGroup = true;
      this.dynamicOperation = true;
      if (res.Results[0] === null) {
        this.noInformationCondition();
      } else {
        this.tempVoiceList = res.Results[0].JobSurveyQuestions;
        this.showTitle = res.Results[0].SurveyTitle;
        this.surveyId = res.Results[0].SurveyId;
        this.vocAllStar = res.Results[0].VocAllStar;
        this.EntityTypeId = res.Results[0].jobId;
      }

    }, fail = (err) => {
      this.enableSpinner = false;
      this.noInformationCondition();
    };
    this.vocService.getVOCRecords(jobId, success, fail);
  }
  onDynamicRadioChange(index, event) {
    this.tempVoiceList[index].SelectedAnswer = this.tempVoiceList[index].SelectedAnswer;
  }
  // Start The Survey
  onStart() {
    this.createUser();
    if (this.currentSelectedQuestion === 0) {
      this.start = false;
    }
    this.thankYouPage = false;
    this.getVOCRecords(this.jobId);
  }
  noInformationCondition() {
    this.noInformation = true;
    this.start = false;
    this.thankYouPage = false;
    this.butonGroup = false;
    this.feddbackForm = false;
    this.dynamicOperation = false;
  }
  // Back button click event
  onBack() {
    if (this.currentSelectedQuestion > 0) {
      this.progressbarValue = this.progressbarValue - 100 / (this.tempVoiceList.length);
      if (this.buttonName === 'Submit') {
        this.buttonName = 'Next';
      }
      this.currentSelectedQuestion = this.currentSelectedQuestion - 1;
      this.feddbackForm = false;
    }
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
        case 'Key-In':
          this.tempVoiceList[this.currentSelectedQuestion].SelectedAnswer
            = this.tempVoiceList[this.currentSelectedQuestion].SelectedAnswer;
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
  onRating(rating: number, quetionId: number) {
    this.rating = rating;
    localStorage.setItem('star_' + quetionId, this.rating.toString());
    this.tempVoiceList[this.currentSelectedQuestion].SelectedAnswer = this.rating.toString();
  }

  // User Creation
  createUser() {
    this.enableSpinner = true;
    const postData = {
      Id: 0,
      Name: null,
      Age: null,
      GenderId: null,
      // tslint:disable-next-line: radix
      EntityTypeId: parseInt(this.jobId),
      EntityType: 'Job',
      UserId: null,
      SurveyId: null,
      Feedback: null
    };

    // tslint:disable-next-line: one-variable-per-declaration
    const success = (res) => {
      this.userList = res.Results[0];
      this.enableSpinner = false;
    }, fail = (err) => {
      this.enableSpinner = false;
    };

    this.vocService.createUser(postData, success, fail);
  }

  createJobSurvey() {
    this.enableSpinner = true;
    const postData = {
      JobId: 1,
      SurveyId: this.surveyId,
      SurveyTitle: this.showTitle,
      SurveyUserId: this.userList.Id,
      JobSurveyQuestions: this.tempVoiceList
    };

    // tslint:disable-next-line: one-variable-per-declaration
    const success = (res) => {
      this.enableSpinner = false;
    }, fail = (err) => {
      this.enableSpinner = false;
    };

    this.vocService.createJobSurvey(postData, success, fail);
  }
  updateFeedback() {
    this.enableSpinner = true;
    const postData = {
      Id: this.userList.Id,
      Feedback: this.feedback
    };

    // tslint:disable-next-line: one-variable-per-declaration
    const success = (res) => {
      this.enableSpinner = false;
    }, fail = (err) => {
      this.enableSpinner = false;
    };
    this.vocService.updateFeedback(postData, success, fail);
  }
}
