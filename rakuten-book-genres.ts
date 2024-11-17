import { genres } from "./rakuten-book-all-genres";

// ジャンルの型定義
export interface Genre {
  id: string;
  name: string;
  level: number;
}


/**
 * 指定された条件でジャンルをフィルタリングする
 * @param options フィルタリングオプション
 * @returns フィルタリングされたジャンルの配列
 */
export function filterGenres(options: {
  level?: number;
  parentId?: string;
  keyword?: string;
}): Genre[] {
  return genres.filter(genre => {
    // レベルでフィルタリング
    if (options.level !== undefined && genre.level !== options.level) {
      return false;
    }

    // 親IDでフィルタリング
    if (options.parentId !== undefined) {
      const parentLength = options.parentId.length;
      if (!genre.id.startsWith(options.parentId) || genre.id.length !== parentLength + 3) {
        return false;
      }
    }

    // キーワードでフィルタリング
    if (options.keyword && !genre.name.includes(options.keyword)) {
      return false;
    }

    return true;
  });
}

/**
 * 指定されたIDのジャンルを取得する
 * @param id ジャンルID
 * @returns ジャンルオブジェクト、存在しない場合はundefined
 */
export function getGenreById(id: string): Genre | undefined {
  return genres.find(genre => genre.id === id);
}

/**
 * 指定されたジャンルの親ジャンルを取得する
 * @param genre ジャンルオブジェクト
 * @returns 親ジャンルオブジェクト、存在しない場合はundefined
 */
export function getParentGenre(genre: Genre): Genre | undefined {
  if (genre.level === 0) return undefined;
  const parentId = genre.id.slice(0, -3);
  return getGenreById(parentId);
}

/**
 * 指定されたジャンルの子ジャンルを取得する
 * @param genre ジャンルオブジェクト
 * @returns 子ジャンルの配列
 */
export function getChildGenres(genre: Genre): Genre[] {
  return filterGenres({ parentId: genre.id });
} 

// 使用例
// // レベル1のジャンルを全て取得
// const level1Genres = filterGenres({ level: 1 });

// // 「本」カテゴリ（ID: 001）の子ジャンルを取得
// const bookGenres = filterGenres({ parentId: '001' });

// // 「RPG」を含むジャンルを検索
// const rpgGenres = filterGenres({ keyword: 'RPG' });

// // 特定のジャンルの親ジャンルを取得
// const genre = getGenreById('001001'); // 漫画（コミック）
// const parentGenre = getParentGenre(genre!); // 本