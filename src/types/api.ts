export interface ApiResponse {
  response: string;
  documents: Document[];
  videos: Video[];
}

export interface Document {
  id: string;
  title: string;
  description: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
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
