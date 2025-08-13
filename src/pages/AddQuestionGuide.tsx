import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";

const AddQuestionGuide = () => {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add New Questions Guide</h1>
        <p className="text-muted-foreground mt-2">
          Step-by-step instructions for adding custom questions to survey templates
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Step 1: Download Template
            </CardTitle>
            <CardDescription>
              Get the current CSV template to modify
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Use the menu (top-left) → "Download CSV template" to get the base template file.
            </p>
            <Button asChild variant="outline">
              <a href="/templates/survey-questions-template.csv" download>
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 2: Open in Excel/Sheets</CardTitle>
            <CardDescription>
              Edit the CSV file in your preferred spreadsheet application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Open the downloaded CSV file in Excel, Google Sheets, Numbers, or any spreadsheet program.
              You'll see 9 columns that define each question.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 3: Add New Row</CardTitle>
            <CardDescription>
              Insert a new row anywhere in the spreadsheet for your question
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Fill in all 9 columns for your new question:</p>
              
              <div className="grid gap-3 text-sm">
                <div className="flex gap-3">
                  <span className="font-mono bg-muted px-2 py-1 rounded min-w-[100px]">Column A</span>
                  <span className="font-semibold">section:</span>
                  <span>Group name (e.g., "About you", "Business info")</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-mono bg-muted px-2 py-1 rounded min-w-[100px]">Column B</span>
                  <span className="font-semibold">order:</span>
                  <span>Number within section (1, 2, 3...)</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-mono bg-muted px-2 py-1 rounded min-w-[100px]">Column C</span>
                  <span className="font-semibold">key:</span>
                  <span>Unique ID in snake_case (e.g., "company_size", "industry_type")</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-mono bg-muted px-2 py-1 rounded min-w-[100px]">Column D</span>
                  <span className="font-semibold">label:</span>
                  <span>The actual question text shown to users</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-mono bg-muted px-2 py-1 rounded min-w-[100px]">Column E</span>
                  <span className="font-semibold">type:</span>
                  <span>text | textarea | radio | yesno | number</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-mono bg-muted px-2 py-1 rounded min-w-[100px]">Column F</span>
                  <span className="font-semibold">options:</span>
                  <span>For radio type: "option1|option2|option3" (pipe-separated)</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-mono bg-muted px-2 py-1 rounded min-w-[100px]">Column G</span>
                  <span className="font-semibold">required:</span>
                  <span>TRUE or FALSE</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-mono bg-muted px-2 py-1 rounded min-w-[100px]">Column H</span>
                  <span className="font-semibold">placeholder:</span>
                  <span>Optional helper text shown in input field</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-mono bg-muted px-2 py-1 rounded min-w-[100px]">Column I</span>
                  <span className="font-semibold">help:</span>
                  <span>Optional additional guidance text</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 4: Example Row</CardTitle>
            <CardDescription>
              Here's a complete example of adding a company size question
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
              Business info,1,company_size,How many employees does your company have?,radio,1-10|11-50|51-200|200+,TRUE,Select range,This helps us understand your business scale
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              This creates a required radio button question in the "Business info" section with 4 size options.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Step 5: Upload Modified CSV
            </CardTitle>
            <CardDescription>
              Save as CSV and upload to override survey questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ol className="list-decimal list-inside space-y-2">
                <li>Save your modified file as CSV format</li>
                <li>Use the menu (top-left) → Survey questions → [Survey Type]</li>
                <li>Click "Upload CSV to override..." for the survey you want to modify</li>
                <li>Select your modified CSV file</li>
                <li>The changes will take effect immediately</li>
              </ol>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> The system automatically sorts questions by section and order, 
                  so you don't need to worry about the exact placement of your new row.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Question Types Reference</CardTitle>
            <CardDescription>
              Understanding the different input types available
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 text-sm">
              <div className="flex gap-3">
                <span className="font-mono bg-muted px-2 py-1 rounded min-w-[80px]">text</span>
                <span>Single-line text input (good for names, short answers)</span>
              </div>
              <div className="flex gap-3">
                <span className="font-mono bg-muted px-2 py-1 rounded min-w-[80px]">textarea</span>
                <span>Multi-line text input (good for explanations, comments)</span>
              </div>
              <div className="flex gap-3">
                <span className="font-mono bg-muted px-2 py-1 rounded min-w-[80px]">radio</span>
                <span>Single choice from multiple options (requires options column)</span>
              </div>
              <div className="flex gap-3">
                <span className="font-mono bg-muted px-2 py-1 rounded min-w-[80px]">yesno</span>
                <span>Simple Yes/No choice (automatically creates Yes|No options)</span>
              </div>
              <div className="flex gap-3">
                <span className="font-mono bg-muted px-2 py-1 rounded min-w-[80px]">number</span>
                <span>Numeric input with validation</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddQuestionGuide;