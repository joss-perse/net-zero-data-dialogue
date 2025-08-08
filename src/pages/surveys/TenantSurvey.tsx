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
  businessIndustry: z.string().min(1, "Please enter your industry or SIC code"),
  isSoleTrader: z.enum(["yes", "no"]),
  hasNetZeroStrategy: z.enum(["yes", "no"]),
  netZeroDetails: z.string().optional(),
  carbonReport: z.enum(["yes", "no"]),
  carbonReportTo: z.string().optional(),
  individualsInTenancy: z.string().min(1, "Required"),
  shareAnnualEstimate: z.enum(["yes", "no"]),
  whyNoAnnual: z.string().optional(),
  shareMonthlyReads: z.enum(["yes", "no"]),
  whyNoMonthly: z.string().optional(),
  shareHalfHourly: z.enum(["yes", "no"]),
  whyNoHalfHourly: z.string().optional(),
  allowAnalyticsCompany: z.enum(["yes", "no"]),
  whyNoAnalytics: z.string().optional(),
  electricityVsGas: z.string().optional(),
  waterDataView: z.string().optional(),
  sensitiveData: z.string().optional(),
  preferProvideData: z.enum(["yes", "no"]).optional(),
  otherComments: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const TenantSurvey = () => {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      businessIndustry: "",
      isSoleTrader: "no",
      hasNetZeroStrategy: "no",
      netZeroDetails: "",
      carbonReport: "no",
      carbonReportTo: "",
      individualsInTenancy: "",
      shareAnnualEstimate: "no",
      shareMonthlyReads: "no",
      shareHalfHourly: "no",
      allowAnalyticsCompany: "yes",
      electricityVsGas: "",
      waterDataView: "",
      sensitiveData: "",
      preferProvideData: "no",
      otherComments: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await submitToGoogleSheet(surveyConfig.tenant.endpoint, { form: "tenant", ...values });
      toast({ title: "Thank you!", description: "Your response has been submitted." });
      form.reset();
    } catch (e: any) {
      toast({ title: "Submission failed", description: e.message, variant: "destructive" as any });
    }
  };

  return (
    <SurveyLayout
      title="Tenant Survey"
      description="Help shape a practical, privacy-conscious framework for landlord access to energy data in pursuit of net zero."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <aside className="rounded-md border bg-card/50 p-4 text-sm text-muted-foreground">
            These surveys gather evidence about the risks and benefits of making meter-level energy consumption data available without occupant consent for carbon reporting (GDPR basis: legitimate interests).
          </aside>

          <section aria-labelledby="tenant-current" className="space-y-4">
            <h2 id="tenant-current" className="text-xl font-medium">Current status</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="businessIndustry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>1. Which industry or SIC code do you operate in?</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 47.11 Retail sale in non-specialised stores" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isSoleTrader"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>2. Are you a sole trader?</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="sole-yes" />
                          <Label htmlFor="sole-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="sole-no" />
                          <Label htmlFor="sole-no">No</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="hasNetZeroStrategy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>3. Do you have a net zero strategy?</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="nz-yes" />
                          <Label htmlFor="nz-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="nz-no" />
                          <Label htmlFor="nz-no">No</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="netZeroDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>4. If yes, what is your net zero strategy?</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief description or link" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="carbonReport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>5. Do you produce a carbon report?</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="cr-yes" />
                          <Label htmlFor="cr-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="cr-no" />
                          <Label htmlFor="cr-no">No</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="carbonReportTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>6. If yes, who do you report to?</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Gov, investors, customers" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="individualsInTenancy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>7. How many individuals are involved in the tenancy?</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <section aria-labelledby="tenant-benefits" className="space-y-4">
            <h2 id="tenant-benefits" className="text-xl font-medium">Benefits of meter level data</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="shareAnnualEstimate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>1. Would you share your annual estimated energy consumption?</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="ae-yes" />
                          <Label htmlFor="ae-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="ae-no" />
                          <Label htmlFor="ae-no">No</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shareMonthlyReads"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>2. Would you share monthly meter reads?</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="mmr-yes" />
                          <Label htmlFor="mmr-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="mmr-no" />
                          <Label htmlFor="mmr-no">No</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shareHalfHourly"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>3. Would you share half-hourly consumption data?</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="hh-yes" />
                          <Label htmlFor="hh-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="hh-no" />
                          <Label htmlFor="hh-no">No</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="allowAnalyticsCompany"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>4. Would you allow an expert analytics company to process monthly data to identify measures (only insights shared with the landlord)?</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="an-yes" />
                        <Label htmlFor="an-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="an-no" />
                        <Label htmlFor="an-no">No</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferProvideData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>5. Would you prefer to provide data to your landlord rather than access via industry providers?</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="ppd-yes" />
                        <Label htmlFor="ppd-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="ppd-no" />
                        <Label htmlFor="ppd-no">No</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          </section>

          <section aria-labelledby="tenant-risks" className="space-y-4">
            <h2 id="tenant-risks" className="text-xl font-medium">Risks with meter level data</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="whyNoAnnual"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>1. If you would not share annual estimates, why not?</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Reason" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whyNoMonthly"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>2. If you would not share monthly reads, why not?</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Reason" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whyNoHalfHourly"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>3. If you would not share half-hourly data, why not?</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Reason" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="electricityVsGas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>4. Does your view differ between electricity and gas data? Please explain.</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Details" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="waterDataView"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>5. What is your view on sharing water data?</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Details" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="sensitiveData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>6. Are there any utility data you consider sensitive (granularity, type) and why?</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Details" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whyNoAnalytics"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>7. If you would not allow analytics, why not?</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Reason" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </section>

          <section aria-labelledby="tenant-impacts" className="space-y-4">
            <h2 id="tenant-impacts" className="text-xl font-medium">Short to mid term impact of not having this data</h2>
            <FormField
              control={form.control}
              name="otherComments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>1. In the short to mid term, what environmental or financial impacts do you foresee if meter-level data is not available?</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Your comments" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </section>

          <div className="flex items-center justify-between gap-4 pt-2">
            <Button type="submit" variant="hero">Submit response</Button>
            {surveyConfig.tenant.sheetUrl ? (
              <a
                href={surveyConfig.tenant.sheetUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-primary underline-offset-4 hover:underline"
              >
                View live responses (Google Sheet)
              </a>
            ) : (
              <span className="text-sm text-muted-foreground">Live sheet link not configured</span>
            )}
          </div>
        </form>
      </Form>
    </SurveyLayout>
  );
};

export default TenantSurvey;
