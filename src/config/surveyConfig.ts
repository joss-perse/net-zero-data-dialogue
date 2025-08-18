export const surveyConfig = {
  tenant: {
    endpoint: "", // Paste your Google Apps Script Web App URL for Tenant survey
    sheetUrl: "https://docs.google.com/spreadsheets/d/1AsbjgjnCA1Nmn6J50VK-JdAu0cEZOzm7vSZtIaiGues/edit?usp=sharing", // Public Google Sheet URL to view live responses
    questionsCsvUrl: "/templates/tenant-survey-template.csv", // Local CSV template with updated questions
  },
  landlord: {
    endpoint: "",
    sheetUrl: "https://docs.google.com/spreadsheets/d/1uCCDuri2SyybYVKX6M_kHvX0vvNjNVTGdPNp1cF5JLg/edit?usp=sharing",
    questionsCsvUrl: "/templates/landlord-survey-template.csv",
  },
  advisor: {
    endpoint: "",
    sheetUrl: "https://docs.google.com/spreadsheets/d/1a2xWXBmOGMgpsdCJHYfbj4EPMjWWmZPa1oOvZsHYNGw/edit?usp=sharing",
    questionsCsvUrl: "/templates/advisor-survey-template.csv",
  },
  investor: {
    endpoint: "",
    sheetUrl: "", // Add your Google Sheet URL for Investor survey responses
    questionsCsvUrl: "/templates/investor-survey-template.csv",
  },
} as const;

export type SurveyKey = keyof typeof surveyConfig;
