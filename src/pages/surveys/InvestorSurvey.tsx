import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SurveyLayout from "@/components/SurveyLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { submitToGoogleSheet } from "@/lib/submitToGoogle";
import { surveyConfig } from "@/config/surveyConfig";

const schema = z.object({
  // Current status
  netZeroStrategy: z.string().optional(),
  carbonReportTo: z.string().optional(),
  currentDataUsed: z.string().optional(),
  pctGreenLoansToday: z.string().optional(),
  pctGreenLoans5Years: z.string().optional(),
  pctGreenLoans10Years: z.string().optional(),
  greenLendingBudgetUK: z.string().optional(),
  hasSoleTraderCustomers: z.string().optional(),
  identifySoleTraders: z.string().optional(),

  // Benefits
  meterDataImprovement: z.string().optional(),
  meterDataCriticalAssurance: z.string().optional(),
  impactOnCustomers: z.string().optional(),

  // Risks
  barriersImpactNetZeroRisk: z.string().optional(),
  barriersImpactPenaltyRisk: z.string().optional(),
  evidenceTenantRefusal: z.string().optional(),
  tenantExpectation: z.string().optional(),
  addressConcerns: z.string().optional(),
  unintendedConsequences: z.string().optional(),
  safeguards: z.string().optional(),

  // Impacts
  measures5YearsRelation: z.string().optional(),
  measures10YearsRelation: z.string().optional(),
  barriersGreenLoans: z.string().optional(),
  otherComments: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const InvestorSurvey = () => {
  const { toast } = useToast();
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: {} });

  const onSubmit = async (values: FormValues) => {
    try {
      await submitToGoogleSheet(surveyConfig.investor?.endpoint || "", { form: "investor", ...values });
      toast({ title: "Thanks!", description: "Your response has been submitted." });
      form.reset();
    } catch (e: any) {
      toast({ title: "Submission failed", description: e.message, variant: "destructive" as any });
    }
  };

  return (
    <SurveyLayout
      title="Financial Institutions / Investors Survey"
      description="Help us understand investor needs and impacts to shape a practical framework for landlord access to energy data."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <aside className="rounded-md border bg-card/50 p-4 text-sm text-muted-foreground">
            These surveys gather evidence about the risks and benefits of making meter-level energy consumption data available without occupant consent for carbon reporting (GDPR basis: legitimate interests).
          </aside>

          <section aria-labelledby="investor-current" className="space-y-4">
            <h2 id="investor-current" className="text-xl font-medium">Current status</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField name="netZeroStrategy" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>1. Do you have a net zero strategy? If yes, please summarise.</FormLabel>
                  <FormControl><Textarea {...field} placeholder="Summary" /></FormControl>
                </FormItem>
              )} />
              <FormField name="carbonReportTo" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>2. Who do you carbon report to?</FormLabel>
                  <FormControl><Input {...field} placeholder="Government, GRESB, PCAF, FCA, investors, customers" /></FormControl>
                </FormItem>
              )} />
            </div>

            <FormField name="currentDataUsed" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>3. What data do you currently use for carbon reporting and to inform your net zero strategy?</FormLabel>
                <FormControl><Textarea {...field} placeholder="Data sources and granularity" /></FormControl>
              </FormItem>
            )} />

            <div className="grid md:grid-cols-3 gap-6">
              <FormField name="pctGreenLoansToday" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>4. What percentage of your loans today are green loans?</FormLabel>
                  <FormControl><Input type="number" min={0} max={100} {...field} placeholder="e.g., 15" /></FormControl>
                </FormItem>
              )} />
              <FormField name="pctGreenLoans5Years" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>5. How do you envisage that percentage changing in the next 5 years?</FormLabel>
                  <FormControl><Input type="number" min={0} max={100} {...field} placeholder="e.g., 30" /></FormControl>
                </FormItem>
              )} />
              <FormField name="pctGreenLoans10Years" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>6. How do you envisage that percentage changing in the next 10 years?</FormLabel>
                  <FormControl><Input type="number" min={0} max={100} {...field} placeholder="e.g., 50" /></FormControl>
                </FormItem>
              )} />
            </div>

            <FormField name="greenLendingBudgetUK" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>7. What is your forecast budget for UK green lending related to real estate?</FormLabel>
                <FormControl><Input {...field} placeholder="Amount and timeframe (any loan types incl. secured lending, mortgages, etc)" /></FormControl>
              </FormItem>
            )} />

            <div className="grid md:grid-cols-2 gap-6">
              <FormField name="hasSoleTraderCustomers" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>8. Do you have any sole trader customers or tenants?</FormLabel>
                  <FormControl><Textarea {...field} placeholder="Yes/No and any relevant details" /></FormControl>
                </FormItem>
              )} />
              <FormField name="identifySoleTraders" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>9. Do you have a reliable way to identify sole trader customers or tenants?</FormLabel>
                  <FormControl><Textarea {...field} placeholder="Processes or data used" /></FormControl>
                </FormItem>
              )} />
            </div>
          </section>

          <section aria-labelledby="investor-benefits" className="space-y-4">
            <h2 id="investor-benefits" className="text-xl font-medium">Benefits of meter level data</h2>
            <FormField name="meterDataImprovement" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>1. Do you believe meter-level data would be an improvement? If yes, why?</FormLabel>
                <FormControl><Textarea {...field} /></FormControl>
              </FormItem>
            )} />
            <FormField name="meterDataCriticalAssurance" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>2. To what extent do you see meter data as critical for assurance programmes?</FormLabel>
                <FormControl><Textarea {...field} /></FormControl>
              </FormItem>
            )} />
            <FormField name="impactOnCustomers" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>3. If you got meter-level data, what would be the expected impact on your customers or tenants?</FormLabel>
                <FormControl><Textarea {...field} /></FormControl>
              </FormItem>
            )} />
          </section>

          <section aria-labelledby="investor-risks" className="space-y-4">
            <h2 id="investor-risks" className="text-xl font-medium">Risks with meter level data</h2>
            <FormField name="barriersImpactNetZeroRisk" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>1. Do barriers to accessing meter-level data affect your risk assessment of hitting net zero targets?</FormLabel>
                <FormControl><Textarea {...field} /></FormControl>
              </FormItem>
            )} />
            <FormField name="barriersImpactPenaltyRisk" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>2. Do barriers to accessing meter-level data affect your risk assessment of being financially penalised for reporting inaccuracies?</FormLabel>
                <FormControl><Textarea {...field} /></FormControl>
              </FormItem>
            )} />
            <div className="grid md:grid-cols-2 gap-6">
              <FormField name="evidenceTenantRefusal" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>3. What evidence do you have that customers or tenants do not wish to share energy data with you?</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField name="tenantExpectation" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>4. Do you think customers or tenants would not expect you to use this data for this purpose?</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                </FormItem>
              )} />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <FormField name="addressConcerns" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>5. Could any customer or tenant concerns be addressed, and how?</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField name="unintendedConsequences" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>6. What unintended consequences can you foresee?</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                </FormItem>
              )} />
            </div>
            <FormField name="safeguards" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>7. What safeguards might be suitable to protect tenants, and how would they protect tenants?</FormLabel>
                <FormControl><Textarea {...field} /></FormControl>
              </FormItem>
            )} />
          </section>

          <section aria-labelledby="investor-impacts" className="space-y-4">
            <h2 id="investor-impacts" className="text-xl font-medium">Short to mid term impact of not having this data</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <FormField name="measures5YearsRelation" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>1. To what extent do your net zero strategy measures planned for the next 5 years relate to carbon reduction in buildings?</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField name="measures10YearsRelation" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>2. To what extent do your net zero strategy measures planned for the next 10 years relate to carbon reduction in buildings?</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                </FormItem>
              )} />
            </div>
            <FormField name="barriersGreenLoans" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>3. What are the barriers to bringing green loans to market?</FormLabel>
                <FormControl><Textarea {...field} /></FormControl>
              </FormItem>
            )} />
            <FormField name="otherComments" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>4. Are there any other comments you would like to make?</FormLabel>
                <FormControl><Textarea {...field} /></FormControl>
              </FormItem>
            )} />
          </section>

          <div className="flex items-center justify-between gap-4 pt-2">
            <Button type="submit" variant="hero">Submit response</Button>
            {surveyConfig.investor?.sheetUrl ? (
              <a href={surveyConfig.investor.sheetUrl} target="_blank" rel="noreferrer" className="text-sm text-primary underline-offset-4 hover:underline">View live responses (Google Sheet)</a>
            ) : (
              <span className="text-sm text-muted-foreground">Live sheet link not configured</span>
            )}
          </div>
        </form>
      </Form>
    </SurveyLayout>
  );
};

export default InvestorSurvey;
