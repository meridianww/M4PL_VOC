export class VOCModel {
    public SurveyId: number;
    public QuestionNumber: number;
    public Title: string;
    public QuestionTypeId: number;
    public QuestionTypeIdName: string;
    public StartRange: number;
    public EndRange: number;
    public AgreeText: string;
    public AgreeTextId: number;
    public DisAgreeText: string;
    public DisAgreeTextId: string;
    public SelectedAnswer: string;
}

export class JobSurvey {
    public JobId: number;
    public SurveyId?: number;
    public SurveyTitle: string;
    public SurveyUserId?: number;
    public VocAllStar: boolean;
    public JobSurveyQuestions: Array<JobSurveyQuestions>;
}
export class JobSurveyQuestions {
    public QuestionId: number;
    public QuestionNumber: number;
    public Title: string;
    public QuestionTypeId: number;
    public QuestionTypeIdName: string;
    public StartRange: number;
    public EndRange: number;
    public AgreeText: string;
    public AgreeTextId: number;
    public DisAgreeText: string;
    public DisAgreeTextId: string;
    public SelectedAnswer: string;
}