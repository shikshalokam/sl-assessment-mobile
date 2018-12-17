export const AppConfigs = {
    //Dev Urls

    appVersion: "APP_VERSION",
    app_url: "APP_BASE_URL",
    api_base_url: "API_BASE_URL",
    api_key: 'KEYCLOAK_KEY',
    clientId: "KEYCLOAK_CLIENT_ID", 

    keyCloak: {
        getAccessToken: "ACCESS_TOKEN_URL",
        redirection_url: "REDIRECT_URL",
        logout_redirect_url: "LOGOUT_URL"
    },
    survey: {
        submission: "/submissions/make/",
        getImageUploadUr: "/files/getImageUploadUrl",
        feedback: "/feedback/insert",
        getSubmissionStatus: "/submissions/status/",
        submitGeneralQuestions: "/submissions/generalQuestions/"
    },
    rating: {
        fetchRatingQuestions: '/submissions/fetchRatingQuestions/',
        submitRatings: '/submissions/submitRatingQuestions/'
    },
    flagging: {
        fetchRatedQuestions: '/submissions/fetchCriteriaRatings/',
        submitFlag: '/submissions/flagCriteriaRatings/'
    },
    parentInfo: {
        getParentRegisterForm: "/parentRegistry/form",
        addParentsInfo: "/parentRegistry/add",
        getParentList: "/parentRegistry/list/"
    },
    feedback: {
        getFeedbackForm: '/feedback/form',
        submitFeedback: '/submissions/feedback/'
    },
    slack: {
        exceptionUrl: "SLACK_HOOK_URL",
    }


}

export interface imageLocalListName {
    schoolId: string,
    evidenceId: string
}