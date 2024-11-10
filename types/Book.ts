export type Book = {
  id: string;
  cover: {
    url: string;
    height: number;
    width: number;
  }[];
  content: string;
  link: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  updatedAt: string;
  createdAt: string;
}