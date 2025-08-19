import { validateExternalUrl, sanitizeText, rateLimiter } from './security';

export async function submitToGoogleSheet(endpoint: string, payload: Record<string, any>) {
  // Check localStorage for saved endpoint if not provided in config
  if (!endpoint) {
    const savedEndpoints = localStorage.getItem('survey-endpoints');
    if (savedEndpoints) {
      try {
        const parsed = JSON.parse(savedEndpoints);
        const surveyType = payload.form;
        endpoint = parsed[surveyType];
      } catch (error) {
        console.warn('Failed to load saved endpoints:', error);
      }
    }
  }

  if (!endpoint) {
    throw new Error("Survey endpoint not configured. Please configure your Google Apps Script Web App URL in the admin panel or surveyConfig.ts");
  }

  // Validate endpoint URL for security
  if (!validateExternalUrl(endpoint)) {
    throw new Error("Invalid or unsafe submission endpoint");
  }

  // Rate limiting for submissions
  if (!rateLimiter.canMakeRequest(`submit-${endpoint}`)) {
    throw new Error("Too many submission attempts. Please wait before trying again.");
  }

  // Sanitize payload data
  const sanitizedPayload: Record<string, any> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (typeof value === 'string') {
      sanitizedPayload[sanitizeText(key)] = sanitizeText(value);
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      sanitizedPayload[sanitizeText(key)] = value;
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        ...sanitizedPayload,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Failed to submit: ${res.status} ${text}`);
    }

    return res.json().catch(() => ({}));
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Submission timed out. Please try again.');
    }
    throw error;
  }
}
