import React, { useCallback } from 'react';
import { validateCsvFile, secureLocalStorage, MAX_CSV_SIZE } from '@/lib/security';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SurveyKey } from '@/config/surveyConfig';

interface CsvUploadSecurityProps {
  survey: SurveyKey;
  onUploadSuccess?: () => void;
}

export const CsvUploadSecurity: React.FC<CsvUploadSecurityProps> = ({ 
  survey, 
  onUploadSuccess 
}) => {
  const { toast } = useToast();

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size
    if (file.size > MAX_CSV_SIZE) {
      toast({
        title: "File too large",
        description: `File size must be less than ${Math.round(MAX_CSV_SIZE / 1024 / 1024)}MB`,
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvContent = e.target?.result as string;
        
        // Validate CSV content
        const validation = validateCsvFile(csvContent);
        if (!validation.isValid) {
          toast({
            title: "Invalid CSV content",
            description: validation.error,
            variant: "destructive"
          });
          return;
        }

        // Store securely in localStorage
        secureLocalStorage(`survey:overrideCsv:${survey}`, csvContent);
        
        toast({
          title: "CSV uploaded successfully",
          description: "Your survey questions have been updated"
        });
        
        onUploadSuccess?.();
      } catch (error) {
        console.error('CSV upload error:', error);
        toast({
          title: "Upload failed",
          description: "Failed to process the CSV file",
          variant: "destructive"
        });
      }
    };

    reader.onerror = () => {
      toast({
        title: "File read error",
        description: "Failed to read the uploaded file",
        variant: "destructive"
      });
    };

    reader.readAsText(file);
    
    // Clear the input for security
    event.target.value = '';
  }, [survey, toast, onUploadSuccess]);

  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          Upload a CSV file to override the default survey questions. 
          File must be less than 1MB and contain properly formatted survey data.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-2">
        <Label htmlFor={`csv-upload-${survey}`}>
          Upload Custom Survey Questions (CSV)
        </Label>
        <Input
          id={`csv-upload-${survey}`}
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileUpload}
          className="cursor-pointer"
        />
      </div>
      
      <div className="text-sm text-muted-foreground">
        <p>Security measures in place:</p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>File size limited to 1MB</li>
          <li>Content validation and sanitization</li>
          <li>Secure local storage with obfuscation</li>
          <li>Input filtering for malicious content</li>
        </ul>
      </div>
    </div>
  );
};