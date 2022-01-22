export interface ManifestIcon {
  src: string;
  sizes: string;
  type: string;
}

export interface ManifestJson {
  name: string;
  short_name: string;
  icons: ManifestIcon[];
  theme_color: string;
  background_color: string;
  start_url: string;
  display: string;
  orientation: string;
}
