import Papa from "papaparse";
import * as z from "zod";
import { surveyConfig, SurveyKey } from "@/config/surveyConfig";

export type QuestionType = "text" | "textarea" | "radio" | "yesno" | "number";

export interface QuestionDef {
  order: number;
  section: string; // e.g., "About you"
  key: string; // machine field key
  label: string; // question label
  type: QuestionType; // input type
  options?: string[]; // for radio
  required?: boolean;
  placeholder?: string;
  help?: string;
}

/**
 * CSV expected headers (case-insensitive):
 * section, order, key, label, type, options, required, placeholder, help
 * - type: text | textarea | radio | yesno | number
 * - options: pipe-separated for radio (e.g., "Yes|No|Maybe")
 * - required: TRUE/FALSE or 1/0
 */
function parseQuestionsFromCsv(csv: string): QuestionDef[] {
  const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
  if (parsed.errors?.length) {
    console.warn("CSV parse warnings", parsed.errors);
  }

  const rows = (parsed.data as any[]).filter(Boolean);
  const questions: QuestionDef[] = rows.map((r, idx) => {
    const rawType = String(r.type ?? r.Type ?? "").toLowerCase().trim();
    const type: QuestionType = (rawType === "" ? "textarea" : (rawType as QuestionType));
    const optsRaw = String(r.options ?? r.Options ?? "");
    const options = optsRaw ? optsRaw.split("|").map((s) => s.trim()).filter(Boolean) : undefined;
    const reqRaw = String(r.required ?? r.Required ?? "").toLowerCase().trim();
    const required = ["true", "1", "yes", "y"].includes(reqRaw);
    const orderVal = Number(r.order ?? r.Order ?? idx + 1);
    const keyRaw = String(r.key ?? r.Key ?? "").trim();
    const label = String(r.label ?? r.Label ?? "").trim();
    const key = keyRaw || slugify(label);
    return {
      order: Number.isFinite(orderVal) ? orderVal : idx + 1,
      section: String(r.section ?? r.Section ?? "General").trim() || "General",
      key,
      label: label || `Question ${idx + 1}`,
      type: rawType === "yesno" ? "yesno" : type,
      options: rawType === "yesno" ? ["Yes", "No"] : options,
      required,
      placeholder: String(r.placeholder ?? r.Placeholder ?? "") || undefined,
      help: String(r.help ?? r.Help ?? "") || undefined,
    } satisfies QuestionDef;
  });

  const sorted = questions.sort((a, b) =>
    a.section.localeCompare(b.section) || a.order - b.order
  );

  return sorted;
}

export async function fetchSurveyQuestions(survey: SurveyKey): Promise<QuestionDef[] | null> {
  // 1) Local override via uploaded CSV (stored in localStorage)
  try {
    if (typeof window !== "undefined") {
      const override = localStorage.getItem(`survey:overrideCsv:${survey}`);
      if (override && override.trim()) {
        return parseQuestionsFromCsv(override);
      }
    }
  } catch (e) {
    console.warn("Local CSV override check failed", e);
  }

  // 2) Fallback to configured CSV URL
  const url = surveyConfig[survey]?.questionsCsvUrl;
  if (!url) return null;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const csv = await res.text();
    return parseQuestionsFromCsv(csv);
  } catch (e) {
    console.error("Failed to load survey questions", e);
    return null;
  }
}

export function buildZodSchema(questions: QuestionDef[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const q of questions) {
    if (q.type === "number") {
      shape[q.key] = (q.required ? z.string().min(1, "Required") : z.string().optional())
        .refine((v) => v === undefined || v === "" || !isNaN(Number(v)), { message: "Must be a number" });
    } else if (q.type === "radio" || q.type === "yesno") {
      const opts = (q.options && q.options.length ? q.options : ["Yes", "No"]).map((o) => normalizeValue(o));
      shape[q.key] = q.required
        ? z.string().min(1, "Required").refine((v) => opts.includes(normalizeValue(v)))
        : z.string().optional();
    } else {
      shape[q.key] = q.required ? z.string().min(1, "Required") : z.string().optional();
    }
  }
  return z.object(shape);
}

export function groupBySection(questions: QuestionDef[]) {
  const map = new Map<string, QuestionDef[]>();
  for (const q of questions) {
    const arr = map.get(q.section) ?? [];
    arr.push(q);
    map.set(q.section, arr);
  }
  // Ensure each section questions sorted by order
  for (const [k, arr] of map.entries()) {
    arr.sort((a, b) => a.order - b.order);
    map.set(k, arr);
  }
  return map;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

export function normalizeValue(v: string) {
  return String(v).trim().toLowerCase();
}
