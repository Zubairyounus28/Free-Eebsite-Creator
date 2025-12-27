
import { WebsiteData } from '../types';
import JSZip from 'jszip';

export function generateHTML(data: WebsiteData): string {
  const productsHtml = data.products.map(p => `
    <div class="product-card group bg-white rounded-3xl shadow-sm hover:shadow-xl overflow-hidden border border-stone-100 transition-all duration-300 transform hover:-translate-y-2">
      <div class="overflow-hidden aspect-square">
        <img src="${p.imageUrl}" alt="${p.name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
      </div>
      <div class="p-8">
        <h3 class="text-2xl font-bold mb-3 text-stone-900">${p.name}</h3>
        <p class="text-stone-600 mb-6 text-sm leading-relaxed">${p.description}</p>
        <div class="flex items-center justify-between pt-4 border-t border-stone-50">
          <span class="text-xl font-bold" style="color: ${data.primaryColor}">${p.price}</span>
          <a href="https://wa.me/${data.whatsapp}?text=Hi, I'm interested in ${p.name}" target="_blank" rel="noopener noreferrer" class="px-6 py-2.5 rounded-full text-sm font-bold transition-all" style="background-color: ${data.primaryColor}; color: white; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">Book Now</a>
        </div>
      </div>
    </div>
  `).join('');

  const showProducts = data.showProducts && data.products.length > 0;
  const isCoach = data.templateId === 'coach';

  const templateStyles = {
    modern: `bg-slate-900 text-white`,
    elegant: `bg-stone-50 text-stone-800`,
    startup: `bg-indigo-50 text-slate-900`,
    coach: `bg-[#faf9f6] text-stone-900`,
    creative: `bg-purple-50 text-purple-900`,
    restaurant: `bg-[#fdf8f4] text-stone-800`,
    fitness: `bg-slate-50 text-slate-900`,
    minimalist: `bg-white text-black`
  }[data.templateId] || `bg-white text-black`;

  const heroStyles = {
    modern: `bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900`,
    elegant: `bg-white`,
    startup: `bg-indigo-600 text-white`,
    coach: `bg-white`,
    creative: `bg-white`,
    restaurant: `bg-white`,
    fitness: `bg-white`,
    minimalist: `bg-white`
  }[data.templateId] || `bg-white`;

  const headingFont = {
    coach: "'Playfair Display', serif",
    restaurant: "'Playfair Display', serif",
    creative: "'Plus Jakarta Sans', sans-serif",
    fitness: "'Plus Jakarta Sans', sans-serif",
    minimalist: "'Inter', sans-serif"
  }[data.templateId] || "'Plus Jakarta Sans', sans-serif";
  
  const bodyFont = "'Inter', sans-serif";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        :root {
          --base-font-size: ${data.baseFontSize}px;
          --primary: ${data.primaryColor};
        }
        html { font-size: var(--base-font-size); scroll-behavior: smooth; }
        body { font-family: ${bodyFont}; }
        h1, h2, h3, h4 { font-family: ${headingFont}; }
        .primary-text { color: var(--primary); }
        .primary-bg { background-color: var(--primary); }
        .accent-text { color: ${data.accentColor}; }
        .accent-bg { background-color: ${data.accentColor}; }
        .nav-link:hover { opacity: 0.7; }
        
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
        ${data.templateId === 'creative' ? 'h1 { text-transform: uppercase; letter-spacing: -0.05em; line-height: 0.9 !important; }' : ''}
        ${data.templateId === 'fitness' ? 'h1, h2 { font-weight: 900; font-style: italic; text-transform: uppercase; }' : ''}
    </style>
</head>
<body class="${templateStyles} relative">
    <!-- Anchor for Home/Top -->
    <div id="home" class="absolute top-0 left-0 w-px h-px pointer-events-none"></div>

    <!-- Header -->
    <header id="top-nav" class="fixed top-0 w-full z-40 transition-all duration-300 ${isCoach ? 'bg-white/90 backdrop-blur-sm border-b border-stone-100' : 'bg-white/80 backdrop-blur-md shadow-sm'}">
        <div class="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
            <div class="flex items-center gap-4">
                <img src="${data.logoUrl}" alt="Logo" class="w-12 h-12 rounded-full object-cover">
                <span class="text-2xl font-bold tracking-tight text-stone-900">${data.businessName}</span>
            </div>
            <nav class="hidden md:flex gap-10 text-stone-600 font-semibold text-sm uppercase tracking-widest">
                <a href="#about" class="nav-link transition-colors">About</a>
                ${showProducts ? `<a href="#products" class="nav-link transition-colors">${isCoach ? 'Services' : 'Products'}</a>` : ''}
                <a href="#contact" class="nav-link transition-colors">Contact</a>
            </nav>
            <a href="https://wa.me/${data.whatsapp}" target="_blank" rel="noopener noreferrer" class="px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest shadow-lg hover:opacity-90 transition-all" style="background-color: var(--primary); color: white;">Get Started</a>
        </div>
    </header>

    <!-- Hero -->
    <section class="pt-48 pb-24 px-6 ${heroStyles}">
        <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div class="${isCoach ? 'order-2 md:order-1' : ''}">
                <span class="inline-block mb-4 text-sm font-bold uppercase tracking-[0.3em] opacity-60" style="color: var(--primary)">Welcome</span>
                <h1 class="text-6xl md:text-8xl font-bold mb-8 leading-[1.1] text-stone-900">${data.aboutHeadline}</h1>
                <p class="text-xl mb-10 text-stone-600 leading-relaxed max-w-lg">${data.aboutText.substring(0, 180)}...</p>
                <div class="flex flex-wrap gap-6">
                    ${showProducts ? `<a href="#products" class="px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-all" style="background-color: var(--primary); color: white;">View Services</a>` : ''}
                    <a href="#about" class="px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest border-2 hover:bg-stone-50 transition-all" style="border-color: var(--primary); color: var(--primary);">My Story</a>
                </div>
            </div>
            <div class="relative ${isCoach ? 'order-1 md:order-2' : ''}">
                <div class="absolute -top-10 -left-10 w-40 h-40 rounded-full opacity-20 blur-3xl" style="background-color: var(--primary)"></div>
                <div class="absolute -bottom-10 -right-10 w-60 h-60 rounded-full opacity-10 blur-3xl" style="background-color: var(--primary)"></div>
                <div class="relative rounded-[4rem] overflow-hidden shadow-2xl aspect-[4/5] md:aspect-square">
                  <img src="${data.heroImage}" alt="Hero" class="w-full h-full object-cover">
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-32 px-6 bg-[#faf9f6]">
        <div class="max-w-5xl mx-auto flex flex-col items-center text-center">
            <span class="inline-block mb-6 text-sm font-bold uppercase tracking-[0.3em] opacity-60" style="color: var(--primary)">The Journey</span>
            <h2 class="text-5xl font-bold mb-12 text-stone-900 italic">"Focus on progress, not perfection."</h2>
            <div class="w-24 h-1 mb-12" style="background-color: var(--primary)"></div>
            <p class="text-xl md:text-2xl text-stone-600 leading-loose max-w-4xl">${data.aboutText}</p>
        </div>
    </section>

    <!-- Services/Products Section -->
    ${showProducts ? `
    <section id="products" class="py-32 px-6 bg-white">
        <div class="max-w-7xl mx-auto">
            <div class="text-center mb-20">
                <span class="inline-block mb-4 text-sm font-bold uppercase tracking-[0.3em] opacity-60" style="color: var(--primary)">Offerings</span>
                <h2 class="text-5xl font-bold text-stone-900">${isCoach ? 'Services' : 'Products'}</h2>
            </div>
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
                ${productsHtml}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Contact Section -->
    <section id="contact" class="py-32 px-6 bg-stone-900 text-white overflow-hidden relative">
        <div class="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="h-full w-full"><path d="M0 100 C 20 0 50 0 100 100 Z" fill="white"></path></svg>
        </div>
        <div class="max-w-7xl mx-auto relative z-10">
            <div class="max-w-4xl mx-auto text-center">
                <span class="inline-block mb-4 text-sm font-bold uppercase tracking-[0.3em] opacity-40">Let's Connect</span>
                <h2 class="text-5xl md:text-6xl font-bold mb-16">Contact Information</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
                    <div class="flex flex-col items-center group">
                        <div class="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8 group-hover:bg-white/10 transition-colors">
                            <svg class="w-10 h-10 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </div>
                        <p class="text-xs font-bold uppercase tracking-widest text-stone-500 mb-3">Email Us</p>
                        <a href="mailto:${data.email}" class="text-xl font-medium hover:text-stone-300 transition-colors break-all">${data.email}</a>
                    </div>
                    <div class="flex flex-col items-center group">
                        <div class="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8 group-hover:bg-white/10 transition-colors">
                            <svg class="w-10 h-10 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        </div>
                        <p class="text-xs font-bold uppercase tracking-widest text-stone-500 mb-3">Call Us</p>
                        <a href="tel:${data.phone}" class="text-xl font-medium hover:text-stone-300 transition-colors">${data.phone}</a>
                    </div>
                    <div class="flex flex-col items-center group">
                        <div class="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8 group-hover:bg-white/10 transition-colors">
                            <svg class="w-10 h-10 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>
                        <p class="text-xs font-bold uppercase tracking-widest text-stone-500 mb-3">Our Location</p>
                        <span class="text-xl font-medium">${data.address}</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <footer class="py-16 px-6 text-center text-stone-400 bg-stone-50">
        <div class="max-w-7xl mx-auto">
          <img src="${data.logoUrl}" alt="Logo" class="w-16 h-16 rounded-full object-cover mx-auto mb-6 opacity-50 grayscale">
          <p class="text-sm font-medium uppercase tracking-widest mb-2">${data.businessName}</p>
          <p class="text-xs">&copy; 2024. All rights reserved. Crafted by InstaPage AI.</p>
        </div>
    </footer>

    <!-- Fixed Buttons -->
    <div class="fixed bottom-8 right-8 flex flex-col gap-4 z-[100]">
      <!-- Go To Top Button (Home Icon) -->
      <a href="#home" id="go-top" title="Go to Home" class="w-14 h-14 bg-white shadow-2xl rounded-full flex items-center justify-center text-stone-900 border border-stone-100 hover:scale-110 active:scale-95 transition-all cursor-pointer">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
      </a>

      <!-- WhatsApp Popup Button -->
      <a href="https://wa.me/${data.whatsapp}" target="_blank" rel="noopener noreferrer" title="WhatsApp Us" class="w-14 h-14 bg-[#25D366] text-white shadow-2xl rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.674 1.436 5.662 1.436h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
    </div>

    <script>
      document.addEventListener('DOMContentLoaded', () => {
        // Smooth Scroll Logic
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.startsWith('http') || this.target === '_blank') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
              e.preventDefault();
              targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
              // Update URL hash without jumping
              history.pushState(null, null, targetId);
            }
          });
        });

        // Show/Hide Go To Top Button logic
        const goTopBtn = document.getElementById('go-top');
        if (goTopBtn) {
          window.addEventListener('scroll', () => {
            // Lowered threshold to 200px so it's easier to see it working
            if (window.pageYOffset > 200) {
              goTopBtn.classList.add('show');
            } else {
              goTopBtn.classList.remove('show');
            }
          });
          
          // Redundant click handler just in case
          goTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          });
        }
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
