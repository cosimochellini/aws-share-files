import { Nullable } from "./generic";

export interface ContentResponse {
  kind: string;
  totalItems: number;
  items?: ContentEntity[];
}

export interface ContentEntity {
  kind: string;
  id: string;
  etag: string;
  selfLink: string;
  volumeInfo: VolumeInfo;
  accessInfo: AccessInfo;
  searchInfo: Nullable<SearchInfo>;
}

export interface VolumeInfo {
  title: string;
  authors: Nullable<string[]>;
  publishedDate: string;
  description: Nullable<string>;
  industryIdentifiers: Nullable<IndustryIdentifiersEntity[]>;
  readingModes: ReadingModes;
  pageCount: Nullable<number>;
  printType: string;
  categories: Nullable<string[]>;
  imageLinks: ImageLinks;
  language: string;
  averageRating: Nullable<number>;
  ratingsCount: Nullable<number>;
  subtitle: Nullable<string>;
}

export interface IndustryIdentifiersEntity {
  type: string;
  identifier: string;
}

export interface ReadingModes {
  text: boolean;
  image: boolean;
}

export interface ImageLinks {
  smallThumbnail: string;
  thumbnail: string;
}

export interface AccessInfo {
  country: string;
  accessViewStatus: string;
  quoteSharingAllowed: boolean;
}

export interface SearchInfo {
  textSnippet: string;
}
