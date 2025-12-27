
import { WebsiteData } from '../types';
import JSZip from 'jszip';

export function generateHTML(data: WebsiteData): string {
  const productsHtml = data.products.map(p => {
    let cardStyle = "bg-white rounded-3xl shadow-sm hover:shadow-xl overflow-hidden border border-stone-100 transition-all duration-300 transform hover:-translate-y-2";
    if (data.templateId === 'modern') cardStyle = "bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-all duration-300";
    if (data.templateId === 'minimalist') cardStyle = "bg-white border-b border-black rounded-none hover:bg-slate-50 transition-all";
    if (data.templateId === 'fitness') cardStyle = "bg-black text-white rounded-none border-l-4 border-red-600 p-1";
    if (data.templateId === 'creative') cardStyle = "bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all";

    return `
    <div class="product-card group ${cardStyle} overflow-hidden">
      <div class="overflow-hidden aspect-square ${data.templateId === 'minimalist' ? 'grayscale hover:grayscale-0 transition-all duration-500' : ''}">
        <img src="${p.imageUrl}" alt="${p.name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
      </div>
      <div class="p-8">
        <h3 class="text-2xl font-bold mb-3 ${data.templateId === 'modern' ? 'text-white' : 'text-stone-900'}">${p.name}</h3>
        <p class="${data.templateId === 'modern' ? 'text-slate-400' : 'text-stone-600'} mb-6 text-sm leading-relaxed">${p.description}</p>
        <div class="flex items-center justify-between pt-4 border-t ${data.templateId === 'modern' ? 'border-slate-700' : 'border-stone-50'}">
          <span class="text-xl font-bold" style="color: ${data.primaryColor}">${p.price}</span>
          <a href="https://wa.me/${data.whatsapp}?text=Hi, I'm interested in ${p.name}" target="_blank" rel="noopener noreferrer" class="px-6 py-2.5 rounded-full text-sm font-bold transition-all" style="background-color: ${data.primaryColor}; color: white; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">Book Now</a>
        </div>
      </div>
    </div>
  `}).join('');

  const showProducts = data.showProducts && data.products.length > 0;
  
  // Specific template configurations
  const config = {
    modern: {
      bodyClass: "bg-slate-950 text-slate-100",
      heroClass: "bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-white",
      navClass: "bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 text-white",
      headingFont: "'Plus Jakarta Sans', sans-serif",
      headingWeight: "font-extrabold tracking-tighter"
    },
    elegant: {
      bodyClass: "bg-stone-50 text-stone-900",
      heroClass: "bg-white text-stone-900",
      navClass: "bg-white/90 backdrop-blur-md border-b border-stone-100 text-stone-900",
      headingFont: "'Playfair Display', serif",
      headingWeight: "font-normal italic"
    },
    startup: {
      bodyClass: "bg-indigo-50/30 text-slate-900",
      heroClass: "bg-indigo-600 text-white",
      navClass: "bg-white/95 border-b border-indigo-100 text-slate-900",
      headingFont: "'Plus Jakarta Sans', sans-serif",
      headingWeight: "font-bold"
    },
    coach: {
      bodyClass: "bg-[#faf9f6] text-stone-900",
      heroClass: "bg-white border-b border-stone-100",
      navClass: "bg-white/95 backdrop-blur-sm border-b border-stone-100 text-stone-900",
      headingFont: "'Playfair Display', serif",
      headingWeight: "font-bold"
    },
    creative: {
      bodyClass: "bg-yellow-50 text-black",
      heroClass: "bg-white border-b-8 border-black text-black",
      navClass: "bg-white border-b-4 border-black text-black",
      headingFont: "'Plus Jakarta Sans', sans-serif",
      headingWeight: "font-black uppercase italic"
    },
    restaurant: {
      bodyClass: "bg-[#fffbf0] text-stone-900",
      heroClass: "bg-[#1a1a1a] text-[#fffbf0]",
      navClass: "bg-[#1a1a1a]/95 text-[#fffbf0]",
      headingFont: "'Playfair Display', serif",
      headingWeight: "font-bold"
    },
    fitness: {
      bodyClass: "bg-zinc-950 text-white",
      heroClass: "bg-zinc-900 relative overflow-hidden",
      navClass: "bg-black/95 border-b-2 border-red-600",
      headingFont: "'Plus Jakarta Sans', sans-serif",
      headingWeight: "font-black italic uppercase"
    },
    minimalist: {
      bodyClass: "bg-white text-black",
      heroClass: "bg-white",
      navClass: "bg-white/80 backdrop-blur-sm border-b border-black/10",
      headingFont: "'Inter', sans-serif",
      headingWeight: "font-light tracking-widest uppercase"
    }
  }[data.templateId] || {
    bodyClass: "bg-white text-black",
    heroClass: "bg-white",
    navClass: "bg-white",
    headingFont: "'Inter', sans-serif",
    headingWeight: "font-bold"
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        :root {
          --base-font-size: ${data.baseFontSize}px;
          --primary: ${data.primaryColor};
          --accent: ${data.accentColor};
        }
        html { font-size: var(--base-font-size); scroll-behavior: smooth; }
        body { font-family: 'Inter', sans-serif; overflow-x: hidden; padding-top: 40px; }
        h1, h2, h3, h4 { font-family: ${config.headingFont}; }
        .primary-text { color: var(--primary); }
        .primary-bg { background-color: var(--primary); }
        
        #go-top {
          opacity: 0;
          visibility: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateY(20px);
        }
        #go-top.show {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        @keyframes blink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        .animate-blink {
          animation: blink 1.5s infinite ease-in-out;
        }

        #top-ticker {
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0f172a;
          color: white;
          font-size: 13px;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          white-space: nowrap;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        ${data.templateId === 'creative' ? `
          .btn-creative {
            box-shadow: 4px 4px 0px 0px #000;
            transition: all 0.1s;
          }
          .btn-creative:active {
            box-shadow: 0px 0px 0px 0px #000;
            transform: translate(4px, 4px);
          }
        ` : ''}

        ${data.templateId === 'fitness' ? `
          .fitness-accent {
            text-shadow: 2px 2px 0px #ef4444;
          }
        ` : ''}

        ${data.templateId === 'minimalist' ? `
          .min-border {
            border: 1px solid rgba(0,0,0,0.1);
          }
        ` : ''}
    </style>
</head>
<body class="${config.bodyClass} relative">
    <!-- Top Ticker Bar -->
    <div id="top-ticker">
      <div class="px-4 flex items-center gap-4">
        <span>Contact us for free publishing support, domain & hosting purchase, or advanced website development. <b>📞 +92 321 2696712 | Zubair Younus</b></span>
        <a href="https://wa.me/923212696712" target="_blank" class="animate-blink bg-blue-600 px-3 py-1 rounded-full text-xs font-bold text-white hover:bg-blue-500 transition-colors">Contact Now</a>
      </div>
    </div>

    <div id="home" class="absolute top-0 left-0 w-px h-px pointer-events-none"></div>

    <!-- Header -->
    <header id="top-nav" class="fixed top-[40px] w-full z-40 transition-all duration-300 ${config.navClass}">
        <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div class="flex items-center gap-4">
                <img src="${data.logoUrl}" alt="Logo" class="w-10 h-10 rounded-full object-cover ${data.templateId === 'minimalist' ? 'grayscale' : ''}">
                <span class="text-xl font-bold tracking-tight">${data.businessName}</span>
            </div>
            <nav class="hidden md:flex gap-8 text-sm font-semibold uppercase tracking-widest opacity-70">
                <a href="#about" class="hover:opacity-100 transition-opacity">About</a>
                ${showProducts ? `<a href="#products" class="hover:opacity-100 transition-opacity">Offerings</a>` : ''}
                <a href="#contact" class="hover:opacity-100 transition-opacity">Contact</a>
            </nav>
            <a href="https://wa.me/${data.whatsapp}" target="_blank" rel="noopener noreferrer" 
               class="px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${data.templateId === 'creative' ? 'btn-creative border-2 border-black bg-white text-black' : 'shadow-lg hover:scale-105 active:scale-95'}" 
               style="${data.templateId !== 'creative' ? `background-color: var(--primary); color: white;` : ''}">
               Connect
            </a>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="min-h-screen pt-40 pb-20 px-6 flex items-center ${config.heroClass}">
        <div class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div class="${data.templateId === 'elegant' || data.templateId === 'minimalist' ? 'text-center lg:text-left mx-auto lg:mx-0' : ''}">
                <span class="inline-block mb-6 text-sm font-bold uppercase tracking-[0.4em] opacity-60" style="color: var(--primary)">Established 2024</span>
                <h1 class="text-5xl md:text-7xl lg:text-8xl mb-8 leading-[0.95] ${config.headingWeight} ${data.templateId === 'fitness' ? 'fitness-accent' : ''}">
                  ${data.aboutHeadline}
                </h1>
                <p class="text-lg md:text-xl mb-12 opacity-80 leading-relaxed max-w-xl ${data.templateId === 'minimalist' ? 'font-light' : ''}">
                  ${data.aboutText.substring(0, 160)}...
                </p>
                <div class="flex flex-wrap gap-6 ${data.templateId === 'minimalist' || data.templateId === 'elegant' ? 'justify-center lg:justify-start' : ''}">
                    <a href="#products" class="px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest transition-all ${data.templateId === 'creative' ? 'btn-creative border-4 border-black bg-white text-black' : 'shadow-2xl hover:-translate-y-1'}" style="${data.templateId !== 'creative' ? `background-color: var(--primary); color: white;` : ''}">Explore</a>
                    <a href="#about" class="px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest border-2 transition-all ${data.templateId === 'creative' ? 'border-black' : ''}" style="${data.templateId !== 'creative' ? `border-color: var(--primary); color: var(--primary);` : ''}">Our Story</a>
                </div>
            </div>
            <div class="relative group">
                <div class="absolute inset-0 bg-gradient-to-tr from-primary to-accent opacity-20 blur-3xl group-hover:opacity-40 transition-opacity"></div>
                <div class="relative rounded-[3rem] overflow-hidden shadow-2xl aspect-[4/5] transform group-hover:rotate-1 transition-transform duration-700 ${data.templateId === 'minimalist' ? 'rounded-none border border-black p-4 bg-white' : ''}">
                  <img src="${data.heroImage}" alt="Hero" class="w-full h-full object-cover ${data.templateId === 'minimalist' ? 'grayscale' : ''}">
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-32 px-6">
        <div class="max-w-4xl mx-auto text-center">
            <h2 class="text-4xl md:text-5xl mb-12 ${config.headingWeight}">${data.templateId === 'restaurant' ? 'Our Secret Ingredient' : 'Who We Are'}</h2>
            <div class="w-20 h-1 mx-auto mb-12 rounded-full" style="background-color: var(--primary)"></div>
            <p class="text-xl md:text-2xl leading-loose opacity-80">
                ${data.aboutText}
            </p>
        </div>
    </section>

    <!-- Products Section -->
    ${showProducts ? `
    <section id="products" class="py-32 px-6 ${data.templateId === 'modern' ? 'bg-slate-900' : 'bg-white/50'}">
        <div class="max-w-7xl mx-auto">
            <div class="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                <div>
                  <h2 class="text-4xl md:text-6xl ${config.headingWeight}">${data.templateId === 'restaurant' ? 'The Menu' : 'Featured Services'}</h2>
                  <p class="mt-4 opacity-60 max-w-md">Crafted with precision and care to meet your highest expectations.</p>
                </div>
                <div class="h-px flex-1 bg-current opacity-10 hidden md:block mx-10"></div>
            </div>
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                ${productsHtml}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Contact Section -->
    <section id="contact" class="py-32 px-6 bg-stone-900 text-white overflow-hidden relative">
        <div class="max-w-7xl mx-auto relative z-10">
            <div class="max-w-4xl mx-auto text-center">
                <h2 class="text-4xl md:text-6xl mb-16 ${config.headingWeight}">Let's Work Together</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div class="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <p class="text-xs font-bold uppercase tracking-widest text-primary mb-4" style="color: var(--primary)">Email</p>
                        <a href="mailto:${data.email}" class="text-xl font-medium break-all underline decoration-primary decoration-2 underline-offset-4">${data.email}</a>
                    </div>
                    <div class="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <p class="text-xs font-bold uppercase tracking-widest text-primary mb-4" style="color: var(--primary)">Phone</p>
                        <a href="tel:${data.phone}" class="text-xl font-medium">${data.phone}</a>
                    </div>
                    <div class="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <p class="text-xs font-bold uppercase tracking-widest text-primary mb-4" style="color: var(--primary)">Address</p>
                        <span class="text-xl font-medium">${data.address}</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <footer class="py-20 px-6 text-center opacity-40 border-t border-current/10">
        <div class="max-w-7xl mx-auto">
          <p class="text-sm font-bold uppercase tracking-[0.3em] mb-4">${data.businessName}</p>
          <p class="text-xs">&copy; 2024. All rights reserved. Created with InstaPage AI.</p>
        </div>
    </footer>

    <!-- Bottom Actions -->
    <div class="fixed bottom-8 right-8 flex flex-col gap-4 z-[100]">
      <a href="#home" id="go-top" title="Go to Top" class="w-14 h-14 bg-white shadow-2xl rounded-full flex items-center justify-center text-stone-900 border border-stone-100 hover:scale-110 active:scale-95 transition-all">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
      </a>

      <a href="https://wa.me/${data.whatsapp}" target="_blank" rel="noopener noreferrer" title="WhatsApp" class="w-14 h-14 bg-[#25D366] text-white shadow-2xl rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.674 1.436 5.662 1.436h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
    </div>

    <script>
      document.addEventListener('DOMContentLoaded', () => {
        const goTopBtn = document.getElementById('go-top');
        
        window.addEventListener('scroll', () => {
          if (window.pageYOffset > 400) {
            goTopBtn?.classList.add('show');
          } else {
            goTopBtn?.classList.remove('show');
          }
        });

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth' });
            }
          });
        });
      });
    </script>
</body>
</html>
  `;
}

export async function downloadWebsiteZip(data: WebsiteData) {
  const zip = new JSZip();
  const html = generateHTML(data);
  zip.file("index.html", html);
  zip.file("README.txt", "InstaPage AI: Fast & Professional.\n\nInstructions:\n1. Open CPanel File Manager.\n2. Go to public_html.\n3. Upload 'index.html'.\n4. Your site is live!");

  const content = await zip.generateAsync({ type: "blob" });
  const url = window.URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${data.businessName.toLowerCase().replace(/\s+/g, '-')}-site.zip`;
  link.click();
}
