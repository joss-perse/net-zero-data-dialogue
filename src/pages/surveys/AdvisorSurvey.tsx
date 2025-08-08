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
  const { toast } = useToast();
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: {} });

  const onSubmit = async (values: FormValues) => {
    try {
      await submitToGoogleSheet(surveyConfig.advisor.endpoint, {
        form: "advisor",
        ...values,
      });
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField name="businessSummary" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Summary of your business (services and customer types)</FormLabel>
              <FormControl><Textarea {...field} placeholder="Brief overview" /></FormControl>
            </FormItem>
          )} />

          <FormField name="needMeterLevelData" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Do you need meter-level data? If so, why</FormLabel>
              <FormControl><Textarea {...field} placeholder="Use cases" /></FormControl>
            </FormItem>
          )} />

          <div className="grid md:grid-cols-3 gap-6">
            <FormField name="buildings5PlusMeters" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>How many customer buildings have 5+ electricity meters?</FormLabel>
                <FormControl><Input type="number" min={0} {...field} /></FormControl>
              </FormItem>
            )} />
            <FormField name="buildings4PlusMeters" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>4+ meters?</FormLabel>
                <FormControl><Input type="number" min={0} {...field} /></FormControl>
              </FormItem>
            )} />
            <FormField name="buildings3PlusMeters" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>3+ meters?</FormLabel>
                <FormControl><Input type="number" min={0} {...field} /></FormControl>
              </FormItem>
            )} />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <FormField name="dataProtectionCompliance" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>How do you comply with data protection regulation?</FormLabel>
                <FormControl><Textarea {...field} /></FormControl>
              </FormItem>
            )} />
            <FormField name="confidentialityCompliance" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>How do you comply with the law of confidentiality?</FormLabel>
                <FormControl><Textarea {...field} /></FormControl>
              </FormItem>
            )} />
          </div>

          <FormField name="unintendedConsequences" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Unintended consequences and how to address them</FormLabel>
              <FormControl><Textarea {...field} /></FormControl>
            </FormItem>
          )} />

          <div className="grid md:grid-cols-2 gap-6">
            <FormField name="financialImpactToCustomers" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Financial impact to your customers (since Apr 2025 and next 12 months)</FormLabel>
                <FormControl><Textarea {...field} /></FormControl>
              </FormItem>
            )} />
            <FormField name="financialImpactToYou" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Financial impact to you (since Apr 2025 and next 12 months)</FormLabel>
                <FormControl><Textarea {...field} /></FormControl>
              </FormItem>
            )} />
          </div>

          <FormField name="environmentalImpactToCustomers" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Environmental impact to your customers (since Apr 2025 and next 12 months)</FormLabel>
              <FormControl><Textarea {...field} /></FormControl>
            </FormItem>
          )} />

          <FormField name="otherComments" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Any other comments</FormLabel>
              <FormControl><Textarea {...field} /></FormControl>
            </FormItem>
          )} />

          <div className="flex items-center justify-between gap-4 pt-2">
            <Button type="submit" variant="hero">Submit response</Button>
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
