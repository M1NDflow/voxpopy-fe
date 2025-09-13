export interface ApiResponse {
  response: string;
  documents: Document[];
  segments: Segment[];
}

export interface Document {
  id: string;
  title: string | null;
  summary: string | null;
  document_url: string | null;

}

export interface Segment {
  id: string;
  title: string | null;
  description: string | null;
}

// Example usage in a function:
// async function fetchBotResponse(input: string): Promise<ApiResponse> {
//   const response = await fetch('https://automations.m1ndflow.com/webhook/via-democratia', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ input })
//   });
//   return response.json();
// }
