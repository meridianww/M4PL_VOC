import { Injectable } from '@angular/core';
import { HttpWrapper } from 'src/app/utility/httpWrapper';
import { Subscription } from 'rxjs';
@Injectable()
export class VOCService {
    constructor(private httpWrapper: HttpWrapper) { }

    getVOCRecords(jobId: number, success: (resp) => void, fail: (err) => void): Subscription {
        return this.httpWrapper.genericHttpGet('Survey/' + jobId + '/job', success, fail);
    }

    createUser(postData: any, success: (resp) => void, fail: (err) => void): Subscription {
        return this.httpWrapper.genericHttpPost(postData, 'SurveyUser', success, fail);
    }

    createJobSurvey(postData: any, success: (resp) => void, fail: (err) => void): Subscription {
        return this.httpWrapper.genericHttpPost(postData, 'Survey/job', success, fail);
    }
    updateFeedback(postData: any, success: (resp) => void, fail: (err) => void): Subscription {
        return this.httpWrapper.genericHttpPut(postData, 'SurveyUser', success, fail);
    }
}
