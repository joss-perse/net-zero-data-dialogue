import { PropsWithChildren } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, Link } from "react-router-dom";

interface SurveyLayoutProps {
  title: string;
  description?: string;
}

const SurveyLayout = ({ title, description, children }: PropsWithChildren<SurveyLayoutProps>) => {
  const { pathname } = useLocation();
  const canonical = typeof window !== "undefined" ? `${window.location.origin}${pathname}` : undefined;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`${title} | Net Zero Energy Data Access Report`}</title>
        {description ? (
          <meta name="description" content={description} />
        ) : null}
        {canonical ? <link rel="canonical" href={canonical} /> : null}
        <meta property="og:title" content={title} />
        {description ? (
          <meta property="og:description" content={description} />
        ) : null}
        <meta property="og:type" content="website" />
      </Helmet>
      <header className="border-b">
        <nav className="container flex items-center justify-between py-4">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to report
          </Link>
          <span className="text-sm text-muted-foreground">Legal framework for landlord access to energy data</span>
        </nav>
      </header>
      <main className="container py-8">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">{title}</h1>
        {description ? (
          <p className="text-muted-foreground mb-8 max-w-3xl">{description}</p>
        ) : null}
        <section className="bg-hero-gradient rounded-lg p-6 md:p-8 shadow-elegant">
          {children}
        </section>
      </main>
    </div>
  );
};

export default SurveyLayout;
