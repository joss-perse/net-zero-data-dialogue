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
    const input = document.getElementById(`upload-${key}-csv`) as HTMLInputElement | null;
    input?.click();
  };

  const onFileChange = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      localStorage.setItem(`survey:overrideCsv:${key}`, text);
      toast({ title: "CSV uploaded", description: `${file.name} applied for ${key} survey.` });
    } catch (err) {
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
                          <p><strong>CSV columns:</strong></p>
                          <p><strong>section:</strong> Groups questions (e.g., "About you")</p>
                          <p><strong>order:</strong> Question order within section</p>
                          <p><strong>key:</strong> Unique field identifier</p>
                          <p><strong>label:</strong> Question text shown to user</p>
                          <p><strong>type:</strong> Input type (text, yesno, radio, textarea)</p>
                          <p><strong>options:</strong> For radio/select (pipe-separated)</p>
                          <p><strong>required:</strong> TRUE/FALSE for validation</p>
                          <p><strong>placeholder:</strong> Helper text in input</p>
                          <p><strong>help:</strong> Additional guidance text</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </a>
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
