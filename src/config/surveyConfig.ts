export const surveyConfig = {
  tenant: {
    endpoint: "", // Paste your Google Apps Script Web App URL for Tenant survey
    sheetUrl: "", // Public Google Sheet URL to view live responses
  },
  landlord: {
    endpoint: "",
    sheetUrl: "",
  },
  advisor: {
    endpoint: "",
    sheetUrl: "",
  },
} as const;

export type SurveyKey = keyof typeof surveyConfig;
