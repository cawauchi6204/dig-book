-- CreateTable
CREATE TABLE "book_genres" (
    "book_isbn" VARCHAR(13) NOT NULL,
    "genre_id" VARCHAR(50) NOT NULL,

    CONSTRAINT "book_genres_pkey" PRIMARY KEY ("book_isbn","genre_id")
);

-- CreateTable
CREATE TABLE "books" (
    "isbn" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "cover" TEXT,
    "content" TEXT,
    "link" TEXT,
    "rakuten_link" TEXT,
    "author" VARCHAR(255),
    "price" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "published_at" DATE,
    "is_visible" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "books_pkey" PRIMARY KEY ("isbn")
);

-- CreateTable
CREATE TABLE "genres" (
    "id" VARCHAR(50) NOT NULL,
    "name_en" VARCHAR(100) NOT NULL,
    "name_ja" VARCHAR(100) NOT NULL,

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "book_genres" ADD CONSTRAINT "book_genres_book_isbn_fkey" FOREIGN KEY ("book_isbn") REFERENCES "books"("isbn") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "book_genres" ADD CONSTRAINT "book_genres_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
