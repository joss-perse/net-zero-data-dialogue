import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { surveyConfig } from "@/config/surveyConfig";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Net Zero Energy Data Access Report</title>
        <meta name="description" content="Surveys for tenants, landlords and advisors to shape a legal framework for landlord access to energy data for net zero." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.origin : ''} />
      </Helmet>
      <header className="bg-hero-gradient border-b">
        <div className="container py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">Report: Legal framework for landlord access to energy data for net zero</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Contribute to evidence-based recommendations. Choose your survey below.
          </p>
        </div>
      </header>

      <main id="surveys" className="container py-10 md:py-14">
        <section className="grid gap-6 md:grid-cols-3">
          <article className="rounded-lg border p-6 bg-card/50 transition-transform hover:-translate-y-0.5 hover:shadow-elegant">
            <h2 className="text-xl font-medium mb-2">Tenant survey</h2>
            <p className="text-sm text-muted-foreground mb-4">Views on data sharing, sensitivity and practical safeguards.</p>
            <div className="flex items-center gap-3">
              <Link to="/surveys/tenant"><Button>Complete survey</Button></Link>
              {surveyConfig.tenant.sheetUrl ? (
                <a href={surveyConfig.tenant.sheetUrl} target="_blank" rel="noreferrer" className="text-sm text-primary underline-offset-4 hover:underline">Live responses</a>
              ) : (
                <span className="text-sm text-muted-foreground">Live sheet not set</span>
              )}
            </div>
          </article>

          <article className="rounded-lg border p-6 bg-card/50 transition-transform hover:-translate-y-0.5 hover:shadow-elegant">
            <h2 className="text-xl font-medium mb-2">Landlord survey</h2>
            <p className="text-sm text-muted-foreground mb-4">Data needs, barriers, impacts and safeguard ideas.</p>
            <div className="flex items-center gap-3">
              <Link to="/surveys/landlord"><Button>Complete survey</Button></Link>
              {surveyConfig.landlord.sheetUrl ? (
                <a href={surveyConfig.landlord.sheetUrl} target="_blank" rel="noreferrer" className="text-sm text-primary underline-offset-4 hover:underline">Live responses</a>
              ) : (
                <span className="text-sm text-muted-foreground">Live sheet not set</span>
              )}
            </div>
          </article>

          <article className="rounded-lg border p-6 bg-card/50 transition-transform hover:-translate-y-0.5 hover:shadow-elegant">
            <h2 className="text-xl font-medium mb-2">Advisor / intermediaries survey</h2>
            <p className="text-sm text-muted-foreground mb-4">Service context, meter-level needs and compliance.</p>
            <div className="flex items-center gap-3">
              <Link to="/surveys/advisor"><Button>Complete survey</Button></Link>
              {surveyConfig.advisor.sheetUrl ? (
                <a href={surveyConfig.advisor.sheetUrl} target="_blank" rel="noreferrer" className="text-sm text-primary underline-offset-4 hover:underline">Live responses</a>
              ) : (
                <span className="text-sm text-muted-foreground">Live sheet not set</span>
              )}
            </div>
          </article>
        </section>

      </main>
    </div>
  );
};

export default Index;
