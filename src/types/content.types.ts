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
  searchInfo?: SearchInfo | null;
}
export interface VolumeInfo {
  title: string;
  authors?: string[] | null;
  publisher?: string | null;
  publishedDate: string;
  description?: string | null;
  industryIdentifiers?: IndustryIdentifiersEntity[] | null;
  readingModes: ReadingModes;
  pageCount?: number | null;
  printType: string;
  categories?: string[] | null;
  maturityRating: string;
  allowAnonLogging: boolean;
  contentVersion: string;
  panelizationSummary: PanelizationSummary;
  imageLinks: ImageLinks;
  language: string;
  previewLink: string;
  infoLink: string;
  canonicalVolumeLink: string;
  averageRating?: number | null;
  ratingsCount?: number | null;
  subtitle?: string | null;
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
  buyLink?: string | null;
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
  acsTokenLink?: string | null;
}

export interface SearchInfo {
  textSnippet: string;
}
