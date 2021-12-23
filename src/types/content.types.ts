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
  saleInfo: SaleInfo;
  accessInfo: AccessInfo;
  searchInfo: Nullable<SearchInfo>;
}
export interface VolumeInfo {
  title: string;
  authors: Nullable<string[]>;
  publisher: Nullable<string>;
  publishedDate: string;
  description: Nullable<string>;
  industryIdentifiers: Nullable<IndustryIdentifiersEntity[]>;
  readingModes: ReadingModes;
  pageCount: Nullable<number>;
  printType: string;
  categories: Nullable<string[]>;
  maturityRating: string;
  allowAnonLogging: boolean;
  contentVersion: string;
  panelizationSummary: PanelizationSummary;
  imageLinks: ImageLinks;
  language: string;
  previewLink: string;
  infoLink: string;
  canonicalVolumeLink: string;
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

export interface PanelizationSummary {
  containsEpubBubbles: boolean;
  containsImageBubbles: boolean;
}

export interface ImageLinks {
  smallThumbnail: string;
  thumbnail: string;
}

export interface SaleInfo {
  country: string;
  saleability: string;
  isEbook: boolean;
  buyLink: Nullable<string>;
}

export interface ListPriceOrRetailPrice {
  amount: number;
  currencyCode: string;
}

export interface AccessInfo {
  country: string;
  viewability: string;
  embeddable: boolean;
  publicDomain: boolean;
  textToSpeechPermission: string;
  epub: EpubOrPdf;
  pdf: EpubOrPdf;
  webReaderLink: string;
  accessViewStatus: string;
  quoteSharingAllowed: boolean;
}

export interface EpubOrPdf {
  isAvailable: boolean;
  acsTokenLink: Nullable<string>;
}

export interface SearchInfo {
  textSnippet: string;
}
