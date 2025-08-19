import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileText, Settings, Users } from 'lucide-react';
import SurveyEndpointConfig from '@/components/SurveyEndpointConfig';
import { surveyConfig } from '@/config/surveyConfig';

const SurveyAdmin: React.FC = () => {
  const surveyStats = Object.entries(surveyConfig).map(([key, config]) => {
    const hasEndpoint = !!config.endpoint;
    const hasQuestions = !!config.questionsCsvUrl;
    const hasResponses = !!config.sheetUrl;
    
    return {
      key,
      name: key.charAt(0).toUpperCase() + key.slice(1),
      config,
      status: {
        configured: hasEndpoint && hasQuestions,
        endpoint: hasEndpoint,
        questions: hasQuestions,
        responses: hasResponses
      }
    };
  });

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Survey Administration</h1>
        <p className="text-muted-foreground">
          Manage survey configurations, endpoints, and monitor responses.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {surveyStats.map((survey) => (
          <Card key={survey.key}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                {survey.name} Survey
                <Badge variant={survey.status.configured ? "default" : "secondary"}>
                  {survey.status.configured ? "Active" : "Setup Needed"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Endpoint</span>
                  <Badge variant={survey.status.endpoint ? "default" : "destructive"} className="text-xs">
                    {survey.status.endpoint ? "Set" : "Missing"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Questions</span>
                  <Badge variant={survey.status.questions ? "default" : "destructive"} className="text-xs">
                    {survey.status.questions ? "Linked" : "Missing"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Responses</span>
                  <Badge variant={survey.status.responses ? "default" : "secondary"} className="text-xs">
                    {survey.status.responses ? "Linked" : "No Sheet"}
                  </Badge>
                </div>
              </div>
              
              <div className="flex gap-1">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <a href={`/surveys/${survey.key}`} className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    View
                  </a>
                </Button>
                {survey.config.sheetUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a 
                      href={survey.config.sheetUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Configuration Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Endpoint Configuration
          </CardTitle>
          <CardDescription>
            Configure Google Apps Script endpoints to enable survey form submissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SurveyEndpointConfig />
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common administrative tasks and helpful resources.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <Button variant="outline" className="justify-start" asChild>
              <a href="/templates/survey-questions-template.csv" download>
                <FileText className="h-4 w-4 mr-2" />
                Download Question Template
              </a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="https://script.google.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Google Apps Script
              </a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="https://docs.google.com/spreadsheets" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Google Sheets
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurveyAdmin;