
import { TemplateConfig, WebsiteData } from './types';

export const TEMPLATES: TemplateConfig[] = [
  {
    id: 'modern',
    name: 'Modern Dark',
    description: 'Sleek, high-contrast layout for tech and digital products.',
    previewUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    id: 'elegant',
    name: 'Elegant Minimal',
    description: 'Clean typography and soft colors for personal brands and boutiques.',
    previewUrl: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    id: 'startup',
    name: 'Startup Vibrant',
    description: 'Dynamic sections and bold colors to capture user attention.',
    previewUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    id: 'coach',
    name: 'Coach Portfolio',
    description: 'Soft, professional, and personal. Perfect for mentors and coaches.',
    previewUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    id: 'creative',
    name: 'Creative Studio',
    description: 'Bold, artistic design with large typography and vibrant accents.',
    previewUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    id: 'restaurant',
    name: 'Culinary Delight',
    description: 'Warm, appetizing layout focused on imagery and comfort.',
    previewUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    id: 'fitness',
    name: 'Power & Grit',
    description: 'High-energy, intense design for gyms and fitness trainers.',
    previewUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    id: 'minimalist',
    name: 'Pure Essential',
    description: 'Ultra-clean, focusing purely on content and white space.',
    previewUrl: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&q=80&w=400&h=300'
  }
];

export const INITIAL_DATA: WebsiteData = {
  title: 'My Awesome Page',
  businessName: 'Business Name',
  logoUrl: 'https://picsum.photos/200/200',
  heroImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200&h=800',
  aboutHeadline: 'Empowering You to Reach Your Full Potential',
  aboutText: 'I help professionals and dreamers navigate their journey toward success. With over 10 years of coaching experience, my mission is to provide you with the tools and mindset needed to transform your life.',
  email: 'hello@example.com',
  phone: '+1 (555) 000-0000',
  whatsapp: '15550000000',
  address: '123 Coach Lane, Wellness District',
  products: [
    {
      id: '1',
      name: '1-on-1 Strategy Session',
      price: '$150',
      description: 'A deep dive into your goals with a personalized roadmap.',
      imageUrl: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=400&h=400'
    },
    {
      id: '2',
      name: 'Mastermind Group',
      price: '$499',
      description: 'Join a community of like-minded high-achievers.',
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=400&h=400'
    }
  ],
  templateId: 'coach',
  primaryColor: '#8b5e3c',
  accentColor: '#fdf8f4',
  baseFontSize: 16,
  showProducts: true
};
