import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildZodSchema, fetchSurveyQuestions, groupBySection, normalizeValue, QuestionDef } from "@/lib/surveyQuestions";
import { SurveyKey } from "@/config/surveyConfig";
import { submitToGoogleSheet } from "@/lib/submitToGoogle";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface DynamicSurveyFormProps {
  survey: SurveyKey;
  endpoint: string;
}

const DynamicSurveyForm: React.FC<DynamicSurveyFormProps> = ({ survey, endpoint }) => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<QuestionDef[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const qs = await fetchSurveyQuestions(survey);
      if (mounted) {
        setQuestions(qs);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [survey]);

  // If not configured, let caller render fallback static form
  if (!loading && !questions) return null;

  // Simple loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-4 w-48 bg-muted animate-pulse rounded" />
        <div className="h-24 w-full bg-muted animate-pulse rounded" />
        <div className="h-10 w-40 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  const schema = useMemo(() => buildZodSchema(questions || []), [questions]);
  const defaultValues = useMemo(() => {
    const v: Record<string, any> = {};
    (questions || []).forEach((q) => (v[q.key] = ""));
    return v;
  }, [questions]);

  const form = useForm<Record<string, string>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onSubmit",
  });

  const sections = useMemo(() => groupBySection(questions || []), [questions]);

  const onSubmit = async (values: Record<string, string>) => {
    try {
      await submitToGoogleSheet(endpoint, { form: survey, ...values });
      toast({ title: "Thank you!", description: "Your response has been submitted." });
      form.reset(defaultValues);
    } catch (e: any) {
      toast({ title: "Submission failed", description: e.message, variant: "destructive" as any });
    }
  };

  let sectionIndex = 0;

  return (
    <div className="space-y-8">
      <aside className="rounded-md border bg-card/50 p-4 text-sm text-muted-foreground">
        Questions are loaded from your Google Sheet (CSV). Reorder or edit there to update instantly. Need a template? <a className="underline" href="/templates/survey-questions-template.csv" target="_blank" rel="noreferrer">Download CSV template</a>.
      </aside>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          {Array.from(sections.entries()).map(([section, qs]) => {
            sectionIndex += 1;
            return (
              <section key={section} aria-labelledby={`sec-${sectionIndex}`} className="space-y-4">
                <h2 id={`sec-${sectionIndex}`} className="text-xl font-medium">{section}</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {qs.map((q, idx) => (
                    <FormField
                      key={q.key}
                      control={form.control}
                      name={q.key as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{`${idx + 1}. ${q.label}`}{q.required ? " *" : ""}</FormLabel>
                          <FormControl>
                            {renderControl(q, field.value, field.onChange)}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </section>
            );
          })}

          <div className="pt-2">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DynamicSurveyForm;

function renderControl(q: QuestionDef, value: any, onChange: (v: any) => void) {
  const commonProps = {
    placeholder: q.placeholder,
  } as any;

  switch (q.type) {
    case "text":
      return <Input {...commonProps} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
    case "number":
      return <Input type="number" inputMode="numeric" {...commonProps} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
    case "radio":
    case "yesno": {
      const options = (q.type === "yesno" ? ["Yes", "No"] : (q.options || [])).map((o) => String(o));
      return (
        <RadioGroup value={value ?? ""} onValueChange={onChange} className="flex flex-wrap gap-4">
          {options.map((opt) => {
            const id = `${q.key}-${normalizeValue(opt)}`;
            return (
              <div className="flex items-center space-x-2" key={id}>
                <RadioGroupItem value={normalizeValue(opt)} id={id} />
                <Label htmlFor={id}>{opt}</Label>
              </div>
            );
          })}
        </RadioGroup>
      );
    }
    case "textarea":
    default:
      return <Textarea rows={4} {...commonProps} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
  }
}
