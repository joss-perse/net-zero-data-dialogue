import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Settings, ExternalLink } from 'lucide-react';
import { SurveyKey, surveyConfig } from '@/config/surveyConfig';

interface SurveyConfigurationAlertProps {
  surveyType: SurveyKey;
  onConfigureClick: () => void;
}

const SurveyConfigurationAlert: React.FC<SurveyConfigurationAlertProps> = ({ 
  surveyType, 
  onConfigureClick 
}) => {
  const config = surveyConfig[surveyType];
  const hasEndpoint = !!config.endpoint;

  if (hasEndpoint) {
    return null;
  }

  return (
    <Alert className="border-amber-200 bg-amber-50 text-amber-800">
      <Settings className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <p className="font-medium mb-1">Survey submission not configured</p>
          <p className="text-sm">
            To enable form submissions, configure a Google Apps Script endpoint for this survey.
          </p>
        </div>
        <div className="flex gap-2 ml-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onConfigureClick}
            className="border-amber-300 text-amber-700 hover:bg-amber-100"
          >
            <Settings className="h-3 w-3 mr-1" />
            Configure
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            className="border-amber-300 text-amber-700 hover:bg-amber-100"
          >
            <a 
              href={config.sheetUrl} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View Responses
            </a>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default SurveyConfigurationAlert;