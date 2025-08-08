export async function submitToGoogleSheet(endpoint: string, payload: Record<string, any>) {
  if (!endpoint) {
    throw new Error("Survey endpoint not configured. Please add your Google Apps Script Web App URL to surveyConfig.ts");
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      ...payload,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to submit: ${res.status} ${text}`);
  }

  return res.json().catch(() => ({}));
}
