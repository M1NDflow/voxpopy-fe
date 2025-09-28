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

