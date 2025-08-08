import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { surveyConfig } from "@/config/surveyConfig";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import heroImage from "@/assets/perse-hero.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Net Zero Energy Data Access Report</title>
        <meta name="description" content="Surveys for tenants, landlords, advisors and investors to shape a legal framework for landlord access to energy data for net zero." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.origin : ''} />
      </Helmet>
      <header className="bg-hero-gradient border-b">
        <div className="container py-12 md:py-16 grid gap-8 md:grid-cols-2 items-center">
          <div>
            <div className="inline-flex items-center rounded-full bg-accent/40 text-accent-foreground px-3 py-1 text-xs font-medium ring-1 ring-border mb-3">
              Evidence-based net zero surveys
            </div>
            <p className="text-2xl md:text-3xl font-bold text-foreground max-w-3xl mb-3">
              Contribute to evidence-based recommendations. Choose your survey below.
            </p>
            <h1 className="text-2xl md:text-3xl font-normal tracking-tight">Legal Framework for Landlord Access to Energy Data — Let’s Hear Your Perspective</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-3">
              Ensuring net-zero success depends on high-quality data—but property owners often lack legal clarity to access tenants’ energy data.
            </p>
            <p className="mt-4 text-sm font-medium">Why it matters:</p>
            <ul className="mt-1 list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>
                A recent British Property Federation study highlights that landlords frequently cannot access occupier energy data, making it hard to establish emissions baselines, prioritise retrofits, or track carbon reduction progress.
              </li>
              <li>
                While green leases and voluntary data-sharing tools help in commercial settings, no legal requirement currently mandates this data exchange between landlords and tenants.
              </li>
            </ul>
          </div>
          <div className="relative">
            <img
              src={heroImage}
              alt="Perse-inspired hero illustration showing energy and finance analytics cards"
              className="w-full h-auto rounded-lg shadow-elegant"
              loading="lazy"
            />
          </div>
        </div>
      </header>

      <main id="surveys" className="container py-10 md:py-14">
        <section className="mb-8">
          <p className="text-sm text-muted-foreground max-w-3xl">
            These surveys gather evidence about the risks and benefits of making meter-level energy consumption data available without occupant consent for carbon reporting (GDPR basis: legitimate interests).
          </p>
        </section>
        <section className="grid gap-6 md:grid-cols-3">
          <article className="rounded-lg border p-6 bg-card/50 transition-transform hover:-translate-y-0.5 hover:shadow-elegant">
            <h2 className="text-xl font-medium mb-2">Tenant survey</h2>
            <p className="text-sm text-muted-foreground mb-4">Views on data sharing, sensitivity and practical safeguards.</p>
            <div className="flex items-center gap-3">
              <Link to="/surveys/tenant"><Button>Complete survey</Button></Link>
            </div>
          </article>

          <article className="rounded-lg border p-6 bg-card/50 transition-transform hover:-translate-y-0.5 hover:shadow-elegant">
            <h2 className="text-xl font-medium mb-2">Landlord survey</h2>
            <p className="text-sm text-muted-foreground mb-4">Data needs, barriers, impacts and safeguard ideas.</p>
            <div className="flex items-center gap-3">
              <Link to="/surveys/landlord"><Button>Complete survey</Button></Link>
            </div>
          </article>

          <article className="rounded-lg border p-6 bg-card/50 transition-transform hover:-translate-y-0.5 hover:shadow-elegant">
            <h2 className="text-xl font-medium mb-2">Advisor / intermediaries survey</h2>
            <p className="text-sm text-muted-foreground mb-4">Service context, meter-level needs and compliance.</p>
            <div className="flex items-center gap-3">
              <Link to="/surveys/advisor"><Button>Complete survey</Button></Link>
            </div>
          </article>

          <article className="rounded-lg border p-6 bg-card/50 transition-transform hover:-translate-y-0.5 hover:shadow-elegant">
            <h2 className="text-xl font-medium mb-2">Financial institutions / investors survey</h2>
            <p className="text-sm text-muted-foreground mb-4">Investor strategy, reporting, green lending and data needs.</p>
            <div className="flex items-center gap-3">
              <Link to="/surveys/investors"><Button>Complete survey</Button></Link>
            </div>
          </article>
        </section>

        <section aria-labelledby="responses-heading" className="mt-12">
          <h2 id="responses-heading" className="text-2xl font-semibold tracking-tight mb-4">Perse Admin Only</h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="responses">
              <AccordionTrigger className="text-sm">Show response links</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>
                    <a href={surveyConfig.tenant.sheetUrl} target="_blank" rel="noreferrer" className="text-primary underline-offset-4 hover:underline">Tenant responses sheet</a>
                  </li>
                  <li>
                    <a href={surveyConfig.landlord.sheetUrl} target="_blank" rel="noreferrer" className="text-primary underline-offset-4 hover:underline">Landlord responses sheet</a>
                  </li>
                  <li>
                    <a href={surveyConfig.advisor.sheetUrl} target="_blank" rel="noreferrer" className="text-primary underline-offset-4 hover:underline">Advisor responses sheet</a>
                  </li>
                  <li>
                    <a href={surveyConfig.investor.sheetUrl} target="_blank" rel="noreferrer" className="text-primary underline-offset-4 hover:underline">Investor responses sheet</a>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>


      </main>
    </div>
  );
};

export default Index;
