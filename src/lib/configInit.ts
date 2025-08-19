import { surveyConfig, SurveyKey } from '@/config/surveyConfig';

/**
 * Initialize survey configuration by loading saved endpoints from localStorage
 * This function should be called once when the app starts
 */
export function initializeSurveyConfig(): void {
  try {
    const savedEndpoints = localStorage.getItem('survey-endpoints');
    if (savedEndpoints) {
      const parsed = JSON.parse(savedEndpoints);
      
      // Update runtime configuration with saved endpoints
      Object.keys(surveyConfig).forEach(key => {
        const surveyKey = key as SurveyKey;
        if (parsed[surveyKey]) {
          (surveyConfig[surveyKey] as any).endpoint = parsed[surveyKey];
        }
      });
      
      console.log('Survey endpoints loaded from storage');
    }
  } catch (error) {
    console.warn('Failed to load survey endpoints from storage:', error);
  }
}

/**
 * Get the current endpoint for a survey type, checking localStorage first
 */
export function getSurveyEndpoint(surveyType: SurveyKey): string {
  try {
    const savedEndpoints = localStorage.getItem('survey-endpoints');
    if (savedEndpoints) {
      const parsed = JSON.parse(savedEndpoints);
      if (parsed[surveyType]) {
        return parsed[surveyType];
      }
    }
  } catch (error) {
    console.warn('Failed to get saved endpoint:', error);
  }
  
  return surveyConfig[surveyType].endpoint;
}