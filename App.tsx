
import React, { useState, useMemo, useRef } from 'react';
import { 
  Download, 
  Eye, 
  Settings2, 
  Globe, 
  Image as ImageIcon, 
  Briefcase, 
  MessageCircle,
  Sparkles,
  Smartphone,
  Monitor,
  Layout,
  Type as TypeIcon,
  ToggleLeft,
  ToggleRight,
  Package,
  ChevronLeft,
  Upload,
  X,
  Phone
} from 'lucide-react';
import { WebsiteData, Product } from './types';
import { INITIAL_DATA } from './constants.tsx';
import TemplateSelector from './components/TemplateSelector';
import ProductEditor from './components/ProductEditor';
import { improveCopy } from './services/gemini';
import { generateHTML, downloadWebsiteZip } from './services/exporter';

type EditorTab = 'template' | 'details' | 'products' | 'contact';

const App: React.FC = () => {
  const [data, setData] = useState<WebsiteData>(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState<EditorTab>('template');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);

  const previewHtml = useMemo(() => generateHTML(data), [data]);

  const handleDataChange = (updates: Partial<WebsiteData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'heroImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleDataChange({ [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImproveText = async (field: keyof WebsiteData) => {
    const currentValue = data[field] as string;
    if (!currentValue) return;
    setIsAiLoading(true);
    try {
      const improved = await improveCopy(currentValue);
      handleDataChange({ [field]: improved });
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-jakarta">
      {/* Promo Ticker Bar */}
      <div className={`bg-slate-900 text-white py-2 px-4 flex items-center justify-center gap-4 text-xs sm:text-sm overflow-hidden whitespace-nowrap z-20 ${isPreviewOpen ? 'hidden' : 'flex'}`}>
        <div className="flex items-center gap-2">
          <span className="font-medium">Contact us for free publishing support, domain & hosting purchase, or advanced website development.</span>
          <span className="font-bold text-blue-400">📞 +92 321 2696712 | Zubair Younus</span>
        </div>
        <a 
          href="https://wa.me/923212696712" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-full font-bold animate-pulse flex items-center gap-1 transition-all flex-shrink-0"
        >
          <Phone className="w-3 h-3" />
          Contact Now
        </a>
      </div>

      {/* Header - Hidden in Full Screen Preview */}
      <header className={`bg-white border-b px-6 py-4 items-center justify-between z-10 shadow-sm ${isPreviewOpen ? 'hidden' : 'flex'}`}>
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white">
            <Globe className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 hidden sm:block">Free AI Website Creator</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex bg-slate-100 p-1 rounded-lg mr-4">
            <button 
              onClick={() => setViewMode('desktop')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('mobile')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
          <button 
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button 
            onClick={() => downloadWebsiteZip(data)}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-lg"
          >
            <Download className="w-4 h-4" />
            Export ZIP
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar Editor - Hidden in Full Screen Preview */}
        <aside className={`w-full lg:w-[450px] bg-white border-r flex flex-col ${isPreviewOpen ? 'hidden' : 'flex'}`}>
          <div className="flex border-b overflow-x-auto no-scrollbar">
            {[
              { id: 'template', icon: Settings2, label: 'Design' },
              { id: 'details', icon: Briefcase, label: 'Content' },
              { id: 'products', icon: ImageIcon, label: 'Products' },
              { id: 'contact', icon: MessageCircle, label: 'Contact' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as EditorTab)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-semibold transition-colors whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'border-blue-600 text-blue-600 bg-blue-50/30' 
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {activeTab === 'template' && (
              <section className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-4">Choose Style</h3>
                  <TemplateSelector 
                    selectedId={data.templateId} 
                    onSelect={(id) => handleDataChange({ templateId: id })} 
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-4">Theme Branding</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-500">Primary Color</label>
                      <input 
                        type="color" 
                        value={data.primaryColor}
                        onChange={(e) => handleDataChange({ primaryColor: e.target.value })}
                        className="w-full h-12 rounded-lg cursor-pointer border-none p-1"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-500">Accent Color</label>
                      <input 
                        type="color" 
                        value={data.accentColor}
                        onChange={(e) => handleDataChange({ accentColor: e.target.value })}
                        className="w-full h-12 rounded-lg cursor-pointer border-none p-1"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <TypeIcon className="w-4 h-4" />
                      Font Size Adjustment
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                        <span>Small</span>
                        <span className="text-blue-600">{data.baseFontSize}px</span>
                        <span>Large</span>
                      </div>
                      <input 
                        type="range" 
                        min="12" 
                        max="24" 
                        step="1"
                        value={data.baseFontSize}
                        onChange={(e) => handleDataChange({ baseFontSize: parseInt(e.target.value) })}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'details' && (
              <section className="space-y-6">
                {/* Logo Section */}
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    Business Branding
                  </label>
                  
                  <div className="flex items-start gap-4">
                    <div className="relative group">
                      <div className="w-20 h-20 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                        {data.logoUrl ? (
                          <img src={data.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-slate-400" />
                        )}
                      </div>
                      <button 
                        onClick={() => logoInputRef.current?.click()}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl"
                      >
                        <Upload className="w-6 h-6 text-white" />
                      </button>
                      <input 
                        type="file" 
                        ref={logoInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'logoUrl')} 
                      />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <label className="text-xs font-medium text-slate-500">Business Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Acme Studio"
                        value={data.businessName}
                        onChange={(e) => handleDataChange({ businessName: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold"
                      />
                      <p className="text-[10px] text-slate-400">Click the icon to upload your logo</p>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-slate-500">Hero Headline</label>
                    <button onClick={() => handleImproveText('aboutHeadline')} className="text-xs text-blue-600 flex items-center gap-1 hover:underline">
                      <Sparkles className="w-3 h-3" /> Improve with AI
                    </button>
                  </div>
                  <input
                    type="text"
                    value={data.aboutHeadline}
                    onChange={(e) => handleDataChange({ aboutHeadline: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-slate-500">About Story</label>
                    <button onClick={() => handleImproveText('aboutText')} className="text-xs text-blue-600 flex items-center gap-1 hover:underline">
                      <Sparkles className="w-3 h-3" /> Professionalize
                    </button>
                  </div>
                  <textarea
                    value={data.aboutText}
                    onChange={(e) => handleDataChange({ aboutText: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-40"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500">Hero Image</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Image URL..."
                      value={data.heroImage}
                      onChange={(e) => handleDataChange({ heroImage: e.target.value })}
                      className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                    <button 
                      onClick={() => heroInputRef.current?.click()}
                      className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
                      title="Upload from computer"
                    >
                      <Upload className="w-5 h-5" />
                    </button>
                    <input 
                      type="file" 
                      ref={heroInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'heroImage')} 
                    />
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'products' && (
              <section className="space-y-6">
                <div className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <Layout className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-sm font-bold">Product Showcase</p>
                      <p className="text-[10px] text-slate-400">Display this section on your site</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDataChange({ showProducts: !data.showProducts })}
                    className="transition-transform active:scale-95"
                  >
                    {data.showProducts ? (
                      <ToggleRight className="w-8 h-8 text-blue-500" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-500" />
                    )}
                  </button>
                </div>
                
                {data.showProducts && (
                  <ProductEditor 
                    products={data.products} 
                    onChange={(products) => handleDataChange({ products })} 
                  />
                )}

                {!data.showProducts && (
                  <div className="text-center py-12 px-6 border-2 border-dashed rounded-2xl border-slate-200 bg-slate-50/50">
                    <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">Product section is hidden</p>
                    <p className="text-xs text-slate-300 mt-1">Enable it using the toggle above to start adding items.</p>
                  </div>
                )}
              </section>
            )}

            {activeTab === 'contact' && (
              <section className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-500">Contact Email</label>
                    <input
                      type="email"
                      value={data.email}
                      onChange={(e) => handleDataChange({ email: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-500">Phone</label>
                    <input
                      type="text"
                      value={data.phone}
                      onChange={(e) => handleDataChange({ phone: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500">WhatsApp (Number only)</label>
                  <input
                    type="text"
                    placeholder="e.g. 15551234567"
                    value={data.whatsapp}
                    onChange={(e) => handleDataChange({ whatsapp: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500">Office Address</label>
                  <input
                    type="text"
                    value={data.address}
                    onChange={(e) => handleDataChange({ address: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </section>
            )}
          </div>
        </aside>

        {/* Live Preview / Full Screen View */}
        <section className={`flex-1 bg-slate-100 flex items-center justify-center overflow-hidden transition-all duration-300 ${isPreviewOpen ? 'p-0 h-full w-full fixed inset-0 z-50' : 'p-4'}`}>
          <div className={`bg-white shadow-2xl transition-all duration-500 overflow-hidden relative ${
            isPreviewOpen ? 'w-full h-full rounded-0' : (viewMode === 'mobile' ? 'w-[375px] h-[667px] rounded-[3rem] border-[12px] border-slate-900' : 'w-full h-full rounded-2xl')
          }`}>
            <iframe
              srcDoc={previewHtml}
              className="w-full h-full border-none"
              title="Website Preview"
            />
            
            {/* Discreet Back to Editor Button in Full Screen */}
            {isPreviewOpen && (
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="fixed top-6 left-6 flex items-center gap-2 bg-slate-900/10 hover:bg-slate-900/90 text-slate-900/60 hover:text-white px-4 py-2 rounded-full font-bold transition-all backdrop-blur-sm z-[60]"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Editor
              </button>
            )}
          </div>
        </section>
      </main>

      {/* Floating Bottom Nav for Mobile UI Switch - Hidden in Full Screen */}
      {!isPreviewOpen && (
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/80 backdrop-blur-lg border border-white/40 shadow-xl px-4 py-2 rounded-full">
          <button 
            onClick={() => setViewMode('desktop')}
            className={`p-2 rounded-full ${viewMode === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
          >
            <Monitor className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setViewMode('mobile')}
            className={`p-2 rounded-full ${viewMode === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
          >
            <Smartphone className="w-5 h-5" />
          </button>
        </div>
      )}

      {isAiLoading && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[99] flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-blue-600 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI is working...</h2>
              <p className="text-slate-500 text-sm">We're crafting the perfect copy using Gemini AI.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
