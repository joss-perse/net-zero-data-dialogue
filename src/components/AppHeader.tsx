import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { surveyConfig } from "@/config/surveyConfig";
import { useToast } from "@/hooks/use-toast";
import { Menu, HelpCircle } from "lucide-react";

const AppHeader = () => {
  const responses = [
    { label: "Tenant responses", url: surveyConfig.tenant.sheetUrl },
    { label: "Landlord responses", url: surveyConfig.landlord.sheetUrl },
    { label: "Advisor responses", url: surveyConfig.advisor.sheetUrl },
    { label: "Investor responses", url: surveyConfig.investor.sheetUrl },
  ];

  const surveys = [
    { key: "tenant", label: "Tenant" },
    { key: "landlord", label: "Landlord" },
    { key: "advisor", label: "Advisor" },
    { key: "investor", label: "Investor" },
  ] as const;

  const { toast } = useToast();

  const handleUploadClick = (key: string) => {
    console.log('handleUploadClick called with key:', key);
    const input = document.getElementById(`upload-${key}-csv`) as HTMLInputElement | null;
    console.log('Found input element:', input);
    input?.click();
  };

  const onFileChange = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('onFileChange called with key:', key);
    const file = e.target.files?.[0];
    console.log('Selected file:', file);
    if (!file) {
      console.log('No file selected');
      return;
    }
    try {
      const text = await file.text();
      console.log('File text length:', text.length);
      localStorage.setItem(`survey:overrideCsv:${key}`, text);
      console.log('Saved to localStorage with key:', `survey:overrideCsv:${key}`);
      toast({ title: "CSV uploaded", description: `${file.name} applied for ${key} survey.` });
    } catch (err) {
      console.error('Error reading file:', err);
      toast({ title: "Upload failed", description: "Could not read CSV file.", variant: "destructive" as any });
    } finally {
      e.currentTarget.value = "";
    }
  };

  return (
    <header className="h-12 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container h-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="px-2">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-64">
              <DropdownMenuLabel>Tools</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <a href="/templates/survey-questions-template.csv" download className="flex items-center justify-between">
                  Download CSV template
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3 w-3 ml-2 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <div className="text-xs space-y-1">
                          <p><strong>How to add questions to CSV:</strong></p>
                          <p><strong>1. section:</strong> Group name (e.g., "About you")</p>
                          <p><strong>2. order:</strong> Number within section (1, 2, 3...)</p>
                          <p><strong>3. key:</strong> Unique ID (snake_case, e.g., "business_size")</p>
                          <p><strong>4. label:</strong> Question text shown to user</p>
                          <p><strong>5. type:</strong> text | textarea | radio | yesno | number</p>
                          <p><strong>6. options:</strong> For radio: option1|option2|option3</p>
                          <p><strong>7. required:</strong> TRUE or FALSE</p>
                          <p><strong>8. placeholder:</strong> Helper text (optional)</p>
                          <p><strong>9. help:</strong> Additional guidance (optional)</p>
                          <p className="mt-2 text-xs text-muted-foreground">
                            <strong>Example row:</strong><br/>
                            Business info,1,company_size,How many employees?,radio,1-10|11-50|51+,TRUE,,
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/add-question-guide">
                  Add new question guide
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin">
                  Survey Admin Panel
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Survey questions</DropdownMenuLabel>
              {surveys.map((s) => (
                <DropdownMenuSub key={s.key}>
                  <DropdownMenuSubTrigger>{s.label}</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem asChild>
                      <a
                        href="/templates/survey-questions-template.csv"
                        download={`${s.key}-questions-template.csv`}
                      >
                        Download {s.label} template
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        handleUploadClick(s.key);
                      }}
                    >
                      Upload CSV to override…
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Survey responses</DropdownMenuLabel>
              {responses.map((r) => (
                r.url ? (
                  <DropdownMenuItem key={r.label} asChild>
                    <a href={r.url} target="_blank" rel="noreferrer">{r.label}</a>
                  </DropdownMenuItem>
                ) : null
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                Admin-only items require @perse.energy sign-in
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Net Zero Energy Data Access
          </Link>
          {surveys.map((s) => (
            <input
              key={s.key}
              id={`upload-${s.key}-csv`}
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              onChange={(e) => onFileChange(s.key, e)}
            />
          ))}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
