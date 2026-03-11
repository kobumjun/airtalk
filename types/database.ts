export type RequestRow = {
  id: string;
  address: string;
  phone: string;
  symptom: string;
  photo_url: string | null;
  created_at: string;
};

export type ReviewRow = {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
};

export type ContentBlock =
  | { type: 'text'; content: string }
  | { type: 'image'; imageUrl: string };

export type PostRow = {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  contact_phone: string | null;
  content_blocks: ContentBlock[] | null;
  created_at: string;
};
