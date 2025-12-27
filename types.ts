
export interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  imageUrl: string;
}

export interface WebsiteData {
  title: string;
  businessName: string;
  logoUrl: string;
  heroImage: string;
  aboutHeadline: string;
  aboutText: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  products: Product[];
  templateId: TemplateId;
  primaryColor: string;
  accentColor: string;
  baseFontSize: number;
  showProducts: boolean;
}

export type TemplateId = 'modern' | 'elegant' | 'startup' | 'coach' | 'creative' | 'restaurant' | 'fitness' | 'minimalist';

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  description: string;
  previewUrl: string;
}
