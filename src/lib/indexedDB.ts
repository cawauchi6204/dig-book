// IndexedDBを操作するためのユーティリティ関数

const DB_NAME = 'digBookDB';
const DB_VERSION = 1;
const BOOK_STORE = 'books';

// DBの初期化
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('IndexedDB error:', event);
      reject('IndexedDBの初期化に失敗しました');
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // 本のストアを作成
      if (!db.objectStoreNames.contains(BOOK_STORE)) {
        const store = db.createObjectStore(BOOK_STORE, { keyPath: 'isbn' });
        // インデックスの作成
        store.createIndex('type', 'type', { unique: false });
      }
    };
  });
};

// 本を保存する
export const saveBook = async (book: any, type: 'liked' | 'nope'): Promise<void> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([BOOK_STORE], 'readwrite');
      const store = transaction.objectStore(BOOK_STORE);

      // typeプロパティを追加して保存
      const bookWithType = { ...book, type };
      
      const request = store.put(bookWithType);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        console.error('Error saving book:', event);
        reject('本の保存に失敗しました');
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('saveBook error:', error);
    throw error;
  }
};

// 特定タイプの本を取得する
export const getBooksByType = async (type: 'liked' | 'nope'): Promise<any[]> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([BOOK_STORE], 'readonly');
      const store = transaction.objectStore(BOOK_STORE);
      const index = store.index('type');
      const request = index.getAll(type);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (event) => {
        console.error('Error getting books:', event);
        reject('本の取得に失敗しました');
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('getBooksByType error:', error);
    return [];
  }
};

// 本を削除する
export const removeBook = async (isbn: string): Promise<void> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([BOOK_STORE], 'readwrite');
      const store = transaction.objectStore(BOOK_STORE);
      const request = store.delete(isbn);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        console.error('Error removing book:', event);
        reject('本の削除に失敗しました');
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('removeBook error:', error);
    throw error;
  }
};

// LocalStorageからIndexedDBへの移行関数
export const migrateFromLocalStorage = async (): Promise<void> => {
  try {
    // likedBooksの移行
    const likedBooks = localStorage.getItem('likedBooks');
    if (likedBooks) {
      const books = JSON.parse(likedBooks);
      for (const book of books) {
        await saveBook(book, 'liked');
      }
      console.log('お気に入りの本の移行が完了しました');
    }

    // nopeBooksの移行
    const nopeBooks = localStorage.getItem('nopeBooks');
    if (nopeBooks) {
      const books = JSON.parse(nopeBooks);
      for (const book of books) {
        await saveBook(book, 'nope');
      }
      console.log('興味なしの本の移行が完了しました');
    }

    // 移行完了後、LocalStorageのデータは残しておく（安全のため）
    // localStorage.removeItem('likedBooks');
    // localStorage.removeItem('nopeBooks');
  } catch (error) {
    console.error('Migration error:', error);
    throw new Error('LocalStorageからの移行に失敗しました');
  }
};
