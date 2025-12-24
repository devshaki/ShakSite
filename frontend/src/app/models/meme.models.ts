export interface Meme {
  id: string;
  filename: string;
  originalName: string;
  uploadedBy?: string;
  uploadedAt: string;
  caption?: string;
  favorited?: boolean;
}
