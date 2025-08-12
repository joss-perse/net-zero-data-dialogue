import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { surveyConfig } from "@/config/surveyConfig";
import { Menu } from "lucide-react";

const AppHeader = () => {
  const responses = [
    { label: "Tenant responses", url: surveyConfig.tenant.sheetUrl },
    { label: "Landlord responses", url: surveyConfig.landlord.sheetUrl },
    { label: "Advisor responses", url: surveyConfig.advisor.sheetUrl },
    { label: "Investor responses", url: surveyConfig.investor.sheetUrl },
  ];

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
                <a href="/templates/survey-questions-template.csv" download>
                  Download CSV template
                </a>
              </DropdownMenuItem>
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
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
