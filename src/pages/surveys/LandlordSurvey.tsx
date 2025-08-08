import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SurveyLayout from "@/components/SurveyLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { submitToGoogleSheet } from "@/lib/submitToGoogle";
import { surveyConfig } from "@/config/surveyConfig";

const schema = z.object({
  netZeroStrategy: z.string().optional(),
  carbonReportTo: z.string().optional(),
  pctUK: z.string().optional(),
  assetMix: z.string().optional(),
  pctWithMultipleMeters: z.string().optional(),
  pctWith5PlusMeters: z.string().optional(),
  pctWith4PlusMeters: z.string().optional(),
  pctWith3PlusMeters: z.string().optional(),
  pctSingleIndividualTenant: z.string().optional(),
  obtainTenantData: z.string().optional(),
  issuesWithRoutes: z.string().optional(),
  otherBarriers: z.string().optional(),
  financialImpact: z.string().optional(),
  environmentalImpact: z.string().optional(),
  tenantIndustryTypes: z.string().optional(),
  gdprGround: z.string().optional(),
  vulnerableTenants: z.string().optional(),
  individualsPerMeter: z.string().optional(),
  evidenceTenantRefusal: z.string().optional(),
  addressConcerns: z.string().optional(),
  dataNeededByPurpose: z.string().optional(),
  dataSharing: z.string().optional(),
  soleTraderTenants: z.string().optional(),
  identifySoleTraders: z.string().optional(),
  tenantExpectation: z.string().optional(),
  impactOnTenants: z.string().optional(),
  unintendedConsequences: z.string().optional(),
  safeguards: z.string().optional(),
  otherComments: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const LandlordSurvey = () => {
  const { toast } = useToast();
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: {} });

  const onSubmit = async (values: FormValues) => {
    try {
      await submitToGoogleSheet(surveyConfig.landlord.endpoint, { form: "landlord", ...values });
      toast({ title: "Thanks!", description: "Your response has been submitted." });
      form.reset();
    } catch (e: any) {
      toast({ title: "Submission failed", description: e.message, variant: "destructive" as any });
    }
  };

  return (
    <SurveyLayout
      title="Landlord Survey"
      description="Tell us about your data needs, constraints and impacts to help shape a workable framework."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <aside className="rounded-md border bg-card/50 p-4 text-sm text-muted-foreground">
            These surveys gather evidence about the risks and benefits of making meter-level energy consumption data available without occupant consent for carbon reporting (GDPR basis: legitimate interests).
          </aside>

          <section aria-labelledby="landlord-current" className="space-y-4">
            <h2 id="landlord-current" className="text-xl font-medium">Current status</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <FormField name="netZeroStrategy" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>1. Do you have a net zero strategy? If yes, please summarise.</FormLabel>
                  <FormControl><Textarea placeholder="Summary" {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField name="carbonReportTo" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>2. Who do you carbon report to?</FormLabel>
                  <FormControl><Input placeholder="Government, GRESB, PCAF, FCA, investors, customers" {...field} /></FormControl>
                </FormItem>
              )} />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <FormField name="pctUK" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>3. What percentage of your assets are in the UK?</FormLabel>
                  <FormControl><Input type="number" min={0} max={100} placeholder="e.g., 80" {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField name="assetMix" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>4. What is your asset mix (residential/commercial/mixed)?</FormLabel>
                  <FormControl><Input placeholder="e.g., 60% commercial, 40% resi" {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField name="pctWithMultipleMeters" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>5. What percentage of assets have more than one electricity meter?</FormLabel>
                  <FormControl><Input type="number" min={0} max={100} placeholder="e.g., 70" {...field} /></FormControl>
                </FormItem>
              )} />
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <FormField name="pctWith5PlusMeters" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>6. What percentage have 5+ meters?</FormLabel>
                  <FormControl><Input type="number" min={0} max={100} {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField name="pctWith4PlusMeters" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>7. What percentage have 4+ meters?</FormLabel>
                  <FormControl><Input type="number" min={0} max={100} {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField name="pctWith3PlusMeters" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>8. What percentage have 3+ meters?</FormLabel>
                  <FormControl><Input type="number" min={0} max={100} {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField name="pctSingleIndividualTenant" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>9. What percentage have a single individual (not corporate) tenant?</FormLabel>
                  <FormControl><Input type="number" min={0} max={100} {...field} /></FormControl>
                </FormItem>
              )} />
            </div>

            <FormField name="obtainTenantData" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>10. How can you currently obtain tenant data?</FormLabel>
                <FormControl><Textarea placeholder="Routes" {...field} /></FormControl>
              </FormItem>
            )} />

            <div className="grid md:grid-cols-2 gap-6">
              <FormField name="issuesWithRoutes" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>11. What issues do you have with these routes?</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField name="otherBarriers" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>12. What other barriers have you experienced?</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                </FormItem>
              )} />
            </div>

            <FormField name="tenantIndustryTypes" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>13. What tenant industry types are in scope (SIC codes and subclasses)?</FormLabel>
                <FormControl><Textarea {...field} /></FormControl>
              </FormItem>
            )} />
          </section>

          <section aria-labelledby="landlord-benefits" className="space-y-4">
            <h2 id="landlord-benefits" className="text-xl font-medium">Benefits of meter level data</h2>
            <FormField name="dataNeededByPurpose" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>1. What data do you need for different purposes (GRESB, SECR, investments, outcomes)?</FormLabel>
                <FormControl><Textarea {...field} /></FormControl>
              </FormItem>
            )} />

            <div className="grid md:grid-cols-2 gap-6">
              <FormField name="dataSharing" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>2. Do you need to share data? With whom and at what granularity?</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField name="impactOnTenants" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>3. If you got meter-level data, what would be the expected impact on tenants?</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                </FormItem>
              )} />
            </div>
          </section>

          <section aria-labelledby="landlord-risks" className="space-y-4">
            <h2 id="landlord-risks" className="text-xl font-medium">Risks with meter level data</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <FormField name="gdprGround" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>1. Which GDPR ground do you think applies?</FormLabel>
                  <FormControl><Input placeholder="e.g., legitimate interests" {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField name="vulnerableTenants" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>2. Do you have any vulnerable tenants? Please provide any metering details.</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                </FormItem>
              )} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField name="individualsPerMeter" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>3. Generally, how many individuals are covered by a single meter?</FormLabel>
                  <FormControl><Input placeholder="e.g., typically 3-5" {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField name="evidenceTenantRefusal" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>4. What evidence do you have that tenants do not wish to share energy data?</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                </FormItem>
              )} />
            </div>

            <FormField name="addressConcerns" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>5. Could tenant concerns be addressed? How?</FormLabel>
                <FormControl><Textarea {...field} /></FormControl>
              </FormItem>
            )} />

            <div className="grid md:grid-cols-2 gap-6">
              <FormField name="identifySoleTraders" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>6. Do you have a reliable way to identify sole traders?</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField name="tenantExpectation" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>7. Do tenants expect you to use this data for this purpose?</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                </FormItem>
              )} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField name="unintendedConsequences" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>8. What unintended consequences might arise?</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField name="safeguards" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>9. What safeguards would best protect tenants, and how?</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                </FormItem>
              )} />
            </div>
          </section>

          <section aria-labelledby="landlord-impacts" className="space-y-4">
            <h2 id="landlord-impacts" className="text-xl font-medium">Short to mid term impact of not having this data</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <FormField name="financialImpact" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>1. What is the financial impact (to date/next 12 months) of not having meter-level data?</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField name="environmentalImpact" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>2. What is the environmental impact (to date/next 12 months) of not having meter-level data?</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                </FormItem>
              )} />
            </div>

            <FormField name="otherComments" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>3. Any other comments on impacts of not having meter-level data?</FormLabel>
                <FormControl><Textarea {...field} /></FormControl>
              </FormItem>
            )} />
          </section>

          <div className="flex items-center justify-between gap-4 pt-2">
            <Button type="submit" variant="hero">Submit response</Button>
            {surveyConfig.landlord.sheetUrl ? (
              <a href={surveyConfig.landlord.sheetUrl} target="_blank" rel="noreferrer" className="text-sm text-primary underline-offset-4 hover:underline">View live responses (Google Sheet)</a>
            ) : (
              <span className="text-sm text-muted-foreground">Live sheet link not configured</span>
            )}
          </div>
        </form>
      </Form>
    </SurveyLayout>
  );
};

export default LandlordSurvey;
