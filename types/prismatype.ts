import { books, book_genres, genres } from '@prisma/client';

export type BookWithGenres = books & {
  book_genres: (book_genres & {
    genres: genres;
  })[];
};

export type BookWithGenre = books & {
  book_genres: book_genres[];
};
