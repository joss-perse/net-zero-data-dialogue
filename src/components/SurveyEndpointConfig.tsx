import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, ExternalLink, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { surveyConfig, SurveyKey } from '@/config/surveyConfig';
import { validateExternalUrl } from '@/lib/security';

interface EndpointConfig {
  endpoint: string;
  isConfigured: boolean;
  isValid: boolean;
}

type SurveyEndpoints = Record<SurveyKey, EndpointConfig>;

const SurveyEndpointConfig: React.FC = () => {
  const { toast } = useToast();
  const [endpoints, setEndpoints] = useState<SurveyEndpoints>({
    tenant: { endpoint: '', isConfigured: false, isValid: false },
    landlord: { endpoint: '', isConfigured: false, isValid: false },
    advisor: { endpoint: '', isConfigured: false, isValid: false },
    investor: { endpoint: '', isConfigured: false, isValid: false },
  });

  const [activeTab, setActiveTab] = useState<SurveyKey>('tenant');
  const [copiedEndpoint, setCopiedEndpoint] = useState<string>('');

  useEffect(() => {
    // Load existing endpoints from localStorage
    const savedEndpoints = localStorage.getItem('survey-endpoints');
    if (savedEndpoints) {
      try {
        const parsed = JSON.parse(savedEndpoints);
        setEndpoints(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(key => {
            const surveyKey = key as SurveyKey;
            if (parsed[surveyKey]) {
              updated[surveyKey] = {
                endpoint: parsed[surveyKey],
                isConfigured: !!parsed[surveyKey],
                isValid: validateExternalUrl(parsed[surveyKey])
              };
            }
          });
          return updated;
        });
      } catch (error) {
        console.warn('Failed to load saved endpoints:', error);
      }
    }
  }, []);

  const handleEndpointChange = (surveyType: SurveyKey, value: string) => {
    setEndpoints(prev => ({
      ...prev,
      [surveyType]: {
        endpoint: value,
        isConfigured: !!value,
        isValid: value ? validateExternalUrl(value) : false
      }
    }));
  };

  const handleSave = (surveyType: SurveyKey) => {
    const endpoint = endpoints[surveyType].endpoint;
    if (!endpoint) {
      toast({
        title: 'Error',
        description: 'Please enter an endpoint URL',
        variant: 'destructive'
      });
      return;
    }

    if (!validateExternalUrl(endpoint)) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid Google Apps Script URL (https://script.google.com/...)',
        variant: 'destructive'
      });
      return;
    }

    // Save to localStorage
    const savedEndpoints = localStorage.getItem('survey-endpoints');
    const currentEndpoints = savedEndpoints ? JSON.parse(savedEndpoints) : {};
    currentEndpoints[surveyType] = endpoint;
    localStorage.setItem('survey-endpoints', JSON.stringify(currentEndpoints));

    // Update runtime config
    (surveyConfig[surveyType] as any).endpoint = endpoint;

    toast({
      title: 'Saved',
      description: `${surveyType.charAt(0).toUpperCase() + surveyType.slice(1)} survey endpoint configured successfully`,
    });
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedEndpoint(text);
      setTimeout(() => setCopiedEndpoint(''), 2000);
      toast({
        title: 'Copied',
        description: 'URL copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy URL to clipboard',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (config: EndpointConfig) => {
    if (!config.isConfigured) {
      return <Badge variant="secondary">Not Configured</Badge>;
    }
    if (!config.isValid) {
      return <Badge variant="destructive">Invalid URL</Badge>;
    }
    return <Badge variant="default">Configured</Badge>;
  };

  const getStatusIcon = (config: EndpointConfig) => {
    if (!config.isConfigured) {
      return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
    if (!config.isValid) {
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    }
    return <CheckCircle className="h-4 w-4 text-green-600" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Survey Endpoint Configuration</h2>
        <p className="text-muted-foreground">
          Configure Google Apps Script endpoints for each survey type to enable form submissions.
        </p>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          To set up survey submissions, you need to create a Google Apps Script Web App for each survey type. 
          The script should accept POST requests and save data to your Google Sheets.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as SurveyKey)}>
        <TabsList className="grid w-full grid-cols-4">
          {Object.keys(endpoints).map((surveyType) => {
            const config = endpoints[surveyType as SurveyKey];
            return (
              <TabsTrigger key={surveyType} value={surveyType} className="flex items-center gap-2">
                {getStatusIcon(config)}
                {surveyType.charAt(0).toUpperCase() + surveyType.slice(1)}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.entries(endpoints).map(([surveyType, config]) => (
          <TabsContent key={surveyType} value={surveyType}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {surveyType.charAt(0).toUpperCase() + surveyType.slice(1)} Survey
                  {getStatusBadge(config)}
                </CardTitle>
                <CardDescription>
                  Configure the Google Apps Script endpoint for {surveyType} survey submissions.
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm">Response Sheet:</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => handleCopy(surveyConfig[surveyType as SurveyKey].sheetUrl)}
                    >
                      {copiedEndpoint === surveyConfig[surveyType as SurveyKey].sheetUrl ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <>
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Responses
                        </>
                      )}
                    </Button>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`${surveyType}-endpoint`}>Google Apps Script Web App URL</Label>
                  <Input
                    id={`${surveyType}-endpoint`}
                    placeholder="https://script.google.com/macros/s/your-script-id/exec"
                    value={config.endpoint}
                    onChange={(e) => handleEndpointChange(surveyType as SurveyKey, e.target.value)}
                  />
                  {config.endpoint && !config.isValid && (
                    <p className="text-sm text-destructive">
                      Invalid URL. Must be a Google Apps Script URL starting with https://script.google.com
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => handleSave(surveyType as SurveyKey)}>
                    Save Configuration
                  </Button>
                  {config.endpoint && (
                    <Button
                      variant="outline"
                      onClick={() => handleCopy(config.endpoint)}
                    >
                      {copiedEndpoint === config.endpoint ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>

                <div className="rounded-md bg-muted p-3 text-sm">
                  <p className="font-medium mb-2">Setup Instructions:</p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Create a Google Apps Script project</li>
                    <li>Set up a doPost() function to handle form submissions</li>
                    <li>Deploy as a Web App with "Anyone" access</li>
                    <li>Copy the Web App URL and paste it above</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SurveyEndpointConfig;