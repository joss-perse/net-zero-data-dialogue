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
import DynamicSurveyForm from "@/components/DynamicSurveyForm";
import { Download } from "lucide-react";

const schema = z.object({
  businessSummary: z.string().optional(),
  needMeterLevelData: z.string().optional(),
  buildings5PlusMeters: z.string().optional(),
  buildings4PlusMeters: z.string().optional(),
  buildings3PlusMeters: z.string().optional(),
  dataProtectionCompliance: z.string().optional(),
  confidentialityCompliance: z.string().optional(),
  unintendedConsequences: z.string().optional(),
  financialImpactToCustomers: z.string().optional(),
  financialImpactToYou: z.string().optional(),
  environmentalImpactToCustomers: z.string().optional(),
  otherComments: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const AdvisorSurvey = () => {
  if (surveyConfig.advisor.questionsCsvUrl) {
    return (
      <SurveyLayout
        title="Advisor / Intermediary Survey"
        description="Provide insight on services, data needs and impacts to inform sensible safeguards."
      >
        <DynamicSurveyForm survey="advisor" endpoint={surveyConfig.advisor.endpoint} />
      </SurveyLayout>
    );
  }

  const { toast } = useToast();
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: {} });

  const onSubmit = async (values: FormValues) => {
    try {
      await submitToGoogleSheet(surveyConfig.advisor.endpoint, { form: "advisor", ...values });
      toast({ title: "Thanks!", description: "Your response has been submitted." });
      form.reset();
    } catch (e: any) {
      toast({ title: "Submission failed", description: e.message, variant: "destructive" as any });
    }
  };

  return (
    <SurveyLayout
      title="Advisor / Intermediary Survey"
      description="Provide insight on services, data needs and impacts to inform sensible safeguards."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <aside className="rounded-md border bg-card/50 p-4 text-sm text-muted-foreground">
            These surveys gather evidence about the risks and benefits of making meter-level energy consumption data available without occupant consent for carbon reporting (GDPR basis: legitimate interests).
          </aside>

          <section aria-labelledby="advisor-current" className="space-y-4">
            <h2 id="advisor-current" className="text-xl font-medium">Current status</h2>
            <FormField name="businessSummary" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>1. What is the summary of your business (services and customer types)?</FormLabel>
                <FormControl><Textarea {...field} placeholder="Brief overview" /></FormControl>
              </FormItem>
            )} />

            <div className="grid md:grid-cols-3 gap-6">
              <FormField name="buildings5PlusMeters" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>2. How many customer buildings have 5+ electricity meters?</FormLabel>
                  <FormControl><Input type="number" min={0} {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField name="buildings4PlusMeters" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>3. How many have 4+ meters?</FormLabel>
                  <FormControl><Input type="number" min={0} {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField name="buildings3PlusMeters" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>4. How many have 3+ meters?</FormLabel>
                  <FormControl><Input type="number" min={0} {...field} /></FormControl>
                </FormItem>
              )} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField name="dataProtectionCompliance" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>5. How do you comply with data protection regulation?</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField name="confidentialityCompliance" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>6. How do you comply with the law of confidentiality?</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                </FormItem>
              )} />
            </div>
          </section>

          <section aria-labelledby="advisor-benefits" className="space-y-4">
            <h2 id="advisor-benefits" className="text-xl font-medium">Benefits of meter level data</h2>
            <FormField name="needMeterLevelData" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>1. Do you need meter-level data? If so, why?</FormLabel>
                <FormControl><Textarea {...field} placeholder="Use cases" /></FormControl>
              </FormItem>
            )} />
          </section>

          <section aria-labelledby="advisor-risks" className="space-y-4">
            <h2 id="advisor-risks" className="text-xl font-medium">Risks with meter level data</h2>
            <FormField name="unintendedConsequences" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>1. What unintended consequences might arise and how could they be addressed?</FormLabel>
                <FormControl><Textarea {...field} /></FormControl>
              </FormItem>
            )} />
          </section>

          <section aria-labelledby="advisor-impacts" className="space-y-4">
            <h2 id="advisor-impacts" className="text-xl font-medium">Short to mid term impact of not having this data</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <FormField name="financialImpactToCustomers" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>1. What is the financial impact to your customers (since Apr 2025 and next 12 months) of not having meter-level data?</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                </FormItem>
              )} />
              <FormField name="financialImpactToYou" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>2. What is the financial impact to you (since Apr 2025 and next 12 months) of not having meter-level data?</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                </FormItem>
              )} />
            </div>

            <FormField name="environmentalImpactToCustomers" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>3. What is the environmental impact to your customers (since Apr 2025 and next 12 months) of not having meter-level data?</FormLabel>
                <FormControl><Textarea {...field} /></FormControl>
              </FormItem>
            )} />

            <FormField name="otherComments" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>4. Any other comments on the impacts of not having meter-level data?</FormLabel>
                <FormControl><Textarea {...field} /></FormControl>
              </FormItem>
            )} />
          </section>

          <div className="flex items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-4">
              <Button type="submit" variant="hero">Submit response</Button>
              <a href="/templates/advisor-survey-template.csv" download className="flex items-center gap-2 text-sm text-primary underline-offset-4 hover:underline">
                <Download size={16} />
                Download CSV Template
              </a>
            </div>
            {surveyConfig.advisor.sheetUrl ? (
              <a href={surveyConfig.advisor.sheetUrl} target="_blank" rel="noreferrer" className="text-sm text-primary underline-offset-4 hover:underline">View live responses (Google Sheet)</a>
            ) : (
              <span className="text-sm text-muted-foreground">Live sheet link not configured</span>
            )}
          </div>
        </form>
      </Form>
    </SurveyLayout>
  );
};

export default AdvisorSurvey;
