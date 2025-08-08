export const surveyConfig = {
  tenant: {
    endpoint: "", // Paste your Google Apps Script Web App URL for Tenant survey
    sheetUrl: "https://docs.google.com/spreadsheets/d/1AsbjgjnCA1Nmn6J50VK-JdAu0cEZOzm7vSZtIaiGues/edit?usp=sharing", // Public Google Sheet URL to view live responses
  },
  landlord: {
    endpoint: "",
    sheetUrl: "https://docs.google.com/spreadsheets/d/1uCCDuri2SyybYVKX6M_kHvX0vvNjNVTGdPNp1cF5JLg/edit?usp=sharing",
  },
  advisor: {
    endpoint: "",
    sheetUrl: "https://docs.google.com/spreadsheets/d/1a2xWXBmOGMgpsdCJHYfbj4EPMjWWmZPa1oOvZsHYNGw/edit?usp=sharing",
  },
  investor: {
    endpoint: "",
    sheetUrl: "", // Add your Google Sheet URL for Investor survey responses
  },
} as const;

export type SurveyKey = keyof typeof surveyConfig;
