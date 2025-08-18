export const surveyConfig = {
  tenant: {
    endpoint: "", // Paste your Google Apps Script Web App URL for Tenant survey
    sheetUrl: "https://docs.google.com/spreadsheets/d/1AsbjgjnCA1Nmn6J50VK-JdAu0cEZOzm7vSZtIaiGues/edit?usp=sharing", // Public Google Sheet URL to view live responses
    questionsCsvUrl: "https://docs.google.com/spreadsheets/d/1Bzbi2fuVxLjGPtGl3HPG3O_5f13PK5A6Pc9-z1jsTNs/export?format=csv", // Live questions from Google Sheets
  },
  landlord: {
    endpoint: "",
    sheetUrl: "https://docs.google.com/spreadsheets/d/1uCCDuri2SyybYVKX6M_kHvX0vvNjNVTGdPNp1cF5JLg/edit?usp=sharing",
    questionsCsvUrl: "https://docs.google.com/spreadsheets/d/1NDwTk0nUqUK60Ybswzl3HQClsoRFGPGrH2qPLWem4IQ/export?format=csv", // Live questions from Google Sheets
  },
  advisor: {
    endpoint: "",
    sheetUrl: "https://docs.google.com/spreadsheets/d/1a2xWXBmOGMgpsdCJHYfbj4EPMjWWmZPa1oOvZsHYNGw/edit?usp=sharing",
    questionsCsvUrl: "https://docs.google.com/spreadsheets/d/1nJl0WDbxlEdqTFJwnZBCykZrTGBPmqr52aAQsy9JCIY/export?format=csv", // Live questions from Google Sheets
  },
  investor: {
    endpoint: "",
    sheetUrl: "", // Add your Google Sheet URL for Investor survey responses
    questionsCsvUrl: "https://docs.google.com/spreadsheets/d/1od2Z5dwn5V4VGX2Lj9S-P_CfdA-kE2H6yJpLosjN4_k/export?format=csv", // Live questions from Google Sheets
  },
} as const;

export type SurveyKey = keyof typeof surveyConfig;
