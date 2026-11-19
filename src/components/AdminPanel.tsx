import { useState } from 'react';
import {
  Check,
  Download,
  Image as ImageIcon,
  Lock,
  LogOut,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
  Video,
} from 'lucide-react';
import { HERO_PALM_IMAGE, HERO_PALM_VIDEO, IMG_DATES } from '../data/seedData';
import { useNagasStore } from '../store/StoreContext';
import type { OrderStage, Product, ProductCategory } from '../types/commerce';
import { formatINR, ORDER_STAGES } from '../utils/commerce';

type AdminTab =
  | 'overview'
  | 'products'
  | 'orders'
  | 'testimonials'
  | 'inquiries'
  | 'settings'
  | 'data';

export function AdminPanel() {
  const {
    products,
    orders,
    testimonials,
    inquiries,
    settings,
    backendMode,
    adminToken,
    loginAdmin,
    logoutAdmin,
    upsertProduct,
    deleteProduct,
    toggleProductSoldOut,
    updateOrderStage,
    addTestimonial,
    deleteTestimonial,
    toggleInquiryRead,
    updateSettings,
    updateHeroMedia,
    exportAllData,
    importAllData,
    resetAllData,
  } = useNagasStore();

  const unlocked = Boolean(adminToken);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [tab, setTab] = useState<AdminTab>('overview');

  // Product editor state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<ProductCategory>('dates');
  const [prodOrigin, setProdOrigin] = useState('');
  const [prodNote, setProdNote] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImg, setProdImg] = useState(IMG_DATES);
  const [prodVariantsText, setProdVariantsText] = useState(
    '100g Pouch:120, 100g Box:140, 200g Box:260'
  );

  // Testimonial form
  const [tmAuthor, setTmAuthor] = useState('');
  const [tmLocation, setTmLocation] = useState('Trichy');
  const [tmItem, setTmItem] = useState('');
  const [tmQuote, setTmQuote] = useState('');

  // Data import status
  const [importStatus, setImportStatus] = useState<string>('');
  const [settingsSaved, setSettingsSaved] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setAuthError('');
    const result = await loginAdmin(passcode.trim());
    setLoggingIn(false);
    if (!result.ok) {
      setAuthError(result.error || 'Incorrect passcode. Try nagas2026.');
    } else {
      setPasscode('');
    }
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setShowNewForm(true);
    setProdName(p.name);
    setProdCategory(p.category);
    setProdOrigin(p.origin);
    setProdNote(p.tastingNote);
    setProdDesc(p.description);
    setProdImg(p.imageUrl);
    setProdVariantsText(
      p.variants.map((v) => `${v.format}:${v.price}`).join(', ')
    );
  };

  const openCreateProduct = () => {
    setEditingProduct(null);
    setShowNewForm(true);
    setProdName('');
    setProdCategory('dates');
    setProdOrigin('Trichy');
    setProdNote('');
    setProdDesc('');
    setProdImg(IMG_DATES);
    setProdVariantsText('100g Pouch:140, 100g Box:160, 200g Box:300');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;
    const parsedVariants = prodVariantsText
      .split(',')
      .map((part) => {
        const [fmt, priceStr] = part.split(':').map((s) => s.trim());
        const price = Number(priceStr);
        if (!fmt || !Number.isFinite(price) || price <= 0) return null;
        return { format: fmt, price };
      })
      .filter((v): v is { format: string; price: number } => v !== null);

    const safeVariants =
      parsedVariants.length > 0
        ? parsedVariants
        : [{ format: '100g Pouch', price: 150 }];

    upsertProduct({
      id: editingProduct?.id ?? `custom-${Date.now()}`,
      name: prodName.trim(),
      category: prodCategory,
      origin: prodOrigin.trim() || 'Trichy',
      tastingNote: prodNote.trim() || 'Hand-sorted fresh lot',
      description:
        prodDesc.trim() || 'Carefully selected and packed by NAGAS FOODS.',
      imageUrl: prodImg || IMG_DATES,
      variants: safeVariants,
      soldOut: editingProduct?.soldOut ?? false,
      featured: editingProduct?.featured ?? false,
    });

    setShowNewForm(false);
    setEditingProduct(null);
  };

  const handleProductPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProdImg(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleHeroFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    kind: 'video' | 'image'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (kind === 'video') {
          updateHeroMedia({
            mode: 'video',
            videoUrl: reader.result,
            isCustomUploaded: true,
          });
        } else {
          updateHeroMedia({
            mode: 'image',
            imageUrl: reader.result,
            isCustomUploaded: true,
          });
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadBackup = () => {
    const blob = new Blob([exportAllData()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nagas-foods-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        const res = await importAllData(reader.result);
        setImportStatus(
          res.ok
            ? 'Backup imported successfully.'
            : res.error || 'Import failed.'
        );
      }
    };
    reader.readAsText(file);
  };

  if (!unlocked) {
    return (
      <section className="max-w-md mx-auto px-4 pt-32 pb-20">
        <div className="bg-[#FFFDF7] border border-[#2A1408]/15 rounded-2xl p-8 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-[#6E0B16] text-[#FFFDF7] flex items-center justify-center mb-4">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="font-display text-3xl font-bold text-[#2A1408]">
            Admin Dashboard
          </h1>
          <p className="text-sm text-[#2A1408]/70 mt-1">
            Enter store passcode to manage products, orders, testimonials,
            inquiries, and hero media.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="admin-passcode"
                className="block text-xs font-semibold uppercase tracking-wider text-[#2A1408]/75 mb-1.5"
              >
                Passcode
              </label>
              <input
                id="admin-passcode"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#2A1408]/20 bg-white text-sm focus:outline-none focus:border-[#A41220]"
              />
              {authError && (
                <p className="text-xs text-[#A41220] mt-1">{authError}</p>
              )}
              <p className="text-xs text-[#2A1408]/55 mt-2">
                Demo passcode: <code className="font-mono">nagas2026</code>
              </p>
            </div>
            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-2.5 px-5 rounded-xl bg-[#A41220] text-[#FFFDF7] text-sm font-medium hover:bg-[#6E0B16] transition-colors cursor-pointer disabled:opacity-60"
            >
              {loggingIn ? 'Verifying...' : 'Unlock Dashboard'}
            </button>
          </form>
        </div>
      </section>
    );
  }

  const unreadInquiries = inquiries.filter((i) => !i.read).length;
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

  const tabs: Array<{ id: AdminTab; label: string }> = [
    { id: 'overview', label: 'Overview' },
    { id: 'products', label: `Products (${products.length})` },
    { id: 'orders', label: `Orders (${orders.length})` },
    { id: 'testimonials', label: `Testimonials (${testimonials.length})` },
    { id: 'inquiries', label: `Inquiries (${unreadInquiries} new)` },
    { id: 'settings', label: 'Settings & Hero' },
    { id: 'data', label: 'Data Backup' },
  ];

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-28 sm:pt-32 pb-14">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#2A1408]/12">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#A41220] font-semibold">
            Store Operations ·{' '}
            {backendMode === 'supabase'
              ? 'Supabase Connected'
              : 'Server Local JSON Store (Add SUPABASE_URL & Key to sync cloud)'}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#2A1408]">
            NAGAS FOODS Admin
          </h1>
        </div>
        <button
          type="button"
          onClick={logoutAdmin}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#2A1408]/20 text-sm font-medium text-[#2A1408] hover:bg-[#FFFDF7] cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Lock Admin</span>
        </button>
      </div>

      {/* Tab Bar */}
      <div className="flex flex-wrap gap-2 py-5 border-b border-[#2A1408]/10">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              tab === t.id
                ? 'bg-[#6E0B16] text-[#FFFDF7]'
                : 'bg-[#FFFDF7] text-[#2A1408] border border-[#2A1408]/15 hover:border-[#A41220]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {tab === 'overview' && (
        <div className="py-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Catalogue Lines', value: products.length },
              { label: 'Total Orders', value: orders.length },
              { label: 'Unread Inquiries', value: unreadInquiries },
              { label: 'Gross Order Value', value: formatINR(totalRevenue) },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="bg-[#FFFDF7] border border-[#2A1408]/12 rounded-2xl p-6"
              >
                <p className="text-xs uppercase tracking-wider text-[#2A1408]/60 font-semibold">
                  {kpi.label}
                </p>
                <p className="font-display text-3xl font-bold text-[#A41220] mt-2 tabular-nums">
                  {kpi.value}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-[#FFFDF7] border border-[#2A1408]/12 rounded-2xl p-6">
            <h2 className="font-display text-xl font-bold text-[#2A1408] mb-3">
              Quick Summary
            </h2>
            <p className="text-sm text-[#2A1408]/75 leading-relaxed">
              Hero media is currently set to{' '}
              <strong>
                {settings.heroMedia.mode === 'video'
                  ? 'Full-Screen Motion / Video'
                  : 'Still Image'}
              </strong>
              . Delivery fee is{' '}
              <strong className="tabular-nums">
                {formatINR(settings.deliveryFee)}
              </strong>{' '}
              (free above{' '}
              <strong className="tabular-nums">
                {formatINR(settings.freeDeliveryThreshold)}
              </strong>
              ).
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS */}
      {tab === 'products' && (
        <div className="py-8 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl font-bold text-[#2A1408]">
              Manage Catalogue ({products.length})
            </h2>
            <button
              type="button"
              onClick={openCreateProduct}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#A41220] text-[#FFFDF7] text-sm font-medium hover:bg-[#6E0B16] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>

          {showNewForm && (
            <form
              onSubmit={handleSaveProduct}
              className="bg-[#FFFDF7] border border-[#2A1408]/15 rounded-2xl p-6 space-y-4"
            >
              <h3 className="font-display text-xl font-bold text-[#2A1408]">
                {editingProduct ? `Edit: ${editingProduct.name}` : 'New Product'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">
                    Product Name
                  </label>
                  <input
                    required
                    type="text"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#2A1408]/20 bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={prodCategory}
                    onChange={(e) =>
                      setProdCategory(e.target.value as ProductCategory)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#2A1408]/20 bg-white text-sm"
                  >
                    <option value="dates">Dates</option>
                    <option value="honey">Raw Honey</option>
                    <option value="dry-fruits">Nuts & Dry Fruits</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">
                    Origin
                  </label>
                  <input
                    type="text"
                    value={prodOrigin}
                    onChange={(e) => setProdOrigin(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#2A1408]/20 bg-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">
                    Tasting Note
                  </label>
                  <input
                    type="text"
                    value={prodNote}
                    onChange={(e) => setProdNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#2A1408]/20 bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1">
                    Formats & Prices (Format:Price, comma-separated)
                  </label>
                  <input
                    type="text"
                    value={prodVariantsText}
                    onChange={(e) => setProdVariantsText(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#2A1408]/20 bg-white text-sm tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#2A1408]/20 bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase mb-1">
                  Upload Product Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProductPhotoUpload}
                  className="text-sm"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1E7A46] text-[#FFFDF7] text-sm font-medium cursor-pointer"
                >
                  Save Product
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewForm(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-[#2A1408]/20 text-sm cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="bg-[#FFFDF7] border border-[#2A1408]/12 rounded-2xl overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FFF7EA] border-b border-[#2A1408]/10 text-xs uppercase tracking-wider text-[#2A1408]/70">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Formats & Prices</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A1408]/10">
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-[#2A1408]">{p.name}</p>
                      <p className="text-xs text-[#2A1408]/60">{p.origin}</p>
                    </td>
                    <td className="py-3 px-4 text-xs tabular-nums">
                      {p.variants
                        .map((v) => `${v.format}: ${formatINR(v.price)}`)
                        .join(' · ')}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => toggleProductSoldOut(p.id)}
                        className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                          p.soldOut
                            ? 'bg-[#6E0B16] text-[#FFFDF7]'
                            : 'bg-[#1E7A46]/15 text-[#1E7A46]'
                        }`}
                      >
                        {p.soldOut ? 'Sold Out' : 'In Stock'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => openEditProduct(p)}
                        className="text-xs font-semibold text-[#A41220] hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProduct(p.id)}
                        aria-label={`Delete ${p.name}`}
                        className="p-1.5 text-[#2A1408]/50 hover:text-[#A41220] cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS */}
      {tab === 'orders' && (
        <div className="py-8 space-y-4">
          <h2 className="font-display text-2xl font-bold text-[#2A1408]">
            Customer Orders ({orders.length})
          </h2>
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-[#FFFDF7] border border-[#2A1408]/12 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <p className="font-display font-bold text-lg text-[#2A1408] tabular-nums">
                  {order.id} · {formatINR(order.total)}
                </p>
                <p className="text-sm text-[#2A1408]/80">
                  {order.customer.name} · {order.customer.phone} ·{' '}
                  {order.paymentMethod}
                </p>
                <p className="text-xs text-[#2A1408]/60 mt-1">
                  {order.items
                    .map((i) => `${i.productName} (${i.format}) × ${i.quantity}`)
                    .join(', ')}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {ORDER_STAGES.map((st: OrderStage) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => updateOrderStage(order.id, st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      order.stage === st
                        ? 'bg-[#1E7A46] text-[#FFFDF7]'
                        : 'bg-[#FFF7EA] text-[#2A1408]/75 hover:bg-[#2A1408]/10'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: TESTIMONIALS */}
      {tab === 'testimonials' && (
        <div className="py-8 space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!tmAuthor.trim() || !tmQuote.trim()) return;
              addTestimonial({
                author: tmAuthor.trim(),
                location: tmLocation.trim() || 'Trichy',
                itemBought: tmItem.trim() || 'NAGAS Assortment',
                quote: tmQuote.trim(),
              });
              setTmAuthor('');
              setTmItem('');
              setTmQuote('');
            }}
            className="bg-[#FFFDF7] border border-[#2A1408]/12 rounded-2xl p-6 space-y-4"
          >
            <h2 className="font-display text-xl font-bold text-[#2A1408]">
              Add Customer Testimonial
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                required
                type="text"
                placeholder="Customer Name"
                value={tmAuthor}
                onChange={(e) => setTmAuthor(e.target.value)}
                className="px-3 py-2 rounded-lg border border-[#2A1408]/20 bg-white text-sm"
              />
              <input
                type="text"
                placeholder="Locality (e.g., Srirangam, Trichy)"
                value={tmLocation}
                onChange={(e) => setTmLocation(e.target.value)}
                className="px-3 py-2 rounded-lg border border-[#2A1408]/20 bg-white text-sm"
              />
              <input
                type="text"
                placeholder="Product Purchased"
                value={tmItem}
                onChange={(e) => setTmItem(e.target.value)}
                className="px-3 py-2 rounded-lg border border-[#2A1408]/20 bg-white text-sm"
              />
            </div>
            <textarea
              required
              rows={2}
              placeholder="Customer quote..."
              value={tmQuote}
              onChange={(e) => setTmQuote(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#2A1408]/20 bg-white text-sm"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#A41220] text-[#FFFDF7] text-sm font-medium cursor-pointer"
            >
              Add Testimonial
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-[#FFFDF7] border border-[#2A1408]/12 rounded-2xl p-5 flex justify-between gap-4"
              >
                <div>
                  <p className="text-sm text-[#2A1408]/85">"{t.quote}"</p>
                  <p className="text-xs font-semibold text-[#A41220] mt-2">
                    {t.author} · {t.location}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteTestimonial(t.id)}
                  aria-label={`Delete testimonial by ${t.author}`}
                  className="p-1.5 text-[#2A1408]/50 hover:text-[#A41220] self-start cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: INQUIRIES */}
      {tab === 'inquiries' && (
        <div className="py-8 space-y-4">
          <h2 className="font-display text-2xl font-bold text-[#2A1408]">
            Customer Inquiries ({inquiries.length})
          </h2>
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className={`bg-[#FFFDF7] border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                inq.read ? 'border-[#2A1408]/10' : 'border-[#A41220]'
              }`}
            >
              <div>
                <p className="font-semibold text-[#2A1408]">
                  {inq.name} ·{' '}
                  <span className="tabular-nums">{inq.phone}</span>
                  {inq.email ? ` · ${inq.email}` : ''}
                </p>
                <p className="text-sm text-[#2A1408]/80 mt-1">{inq.message}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleInquiryRead(inq.id)}
                className={`px-4 py-2 rounded-lg text-xs font-medium shrink-0 cursor-pointer ${
                  inq.read
                    ? 'bg-[#FFF7EA] text-[#2A1408]/75'
                    : 'bg-[#1E7A46] text-[#FFFDF7]'
                }`}
              >
                {inq.read ? 'Marked Read' : 'Mark as Read'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 6: SETTINGS & HERO MEDIA */}
      {tab === 'settings' && (
        <div className="py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#FFFDF7] border border-[#2A1408]/12 rounded-2xl p-6 space-y-4">
            <h2 className="font-display text-xl font-bold text-[#2A1408]">
              Commerce & WhatsApp Settings
            </h2>
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">
                WhatsApp Number
              </label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) =>
                  updateSettings({ whatsappNumber: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-lg border border-[#2A1408]/20 bg-white text-sm tabular-nums"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase mb-1">
                  Delivery Fee (₹)
                </label>
                <input
                  type="number"
                  value={settings.deliveryFee}
                  onChange={(e) =>
                    updateSettings({ deliveryFee: Number(e.target.value) || 0 })
                  }
                  className="w-full px-3.5 py-2 rounded-lg border border-[#2A1408]/20 bg-white text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase mb-1">
                  Free Delivery Threshold (₹)
                </label>
                <input
                  type="number"
                  value={settings.freeDeliveryThreshold}
                  onChange={(e) =>
                    updateSettings({
                      freeDeliveryThreshold: Number(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-lg border border-[#2A1408]/20 bg-white text-sm tabular-nums"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">
                Top Announcement Bar Text
              </label>
              <input
                type="text"
                value={settings.announcementText}
                onChange={(e) =>
                  updateSettings({ announcementText: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-lg border border-[#2A1408]/20 bg-white text-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setSettingsSaved(true);
                window.setTimeout(() => setSettingsSaved(false), 1500);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E7A46] text-[#FFFDF7] text-sm font-medium cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{settingsSaved ? 'Settings Saved' : 'Apply Settings'}</span>
            </button>
          </div>

          <div className="bg-[#FFFDF7] border border-[#2A1408]/12 rounded-2xl p-6 space-y-4">
            <h2 className="font-display text-xl font-bold text-[#2A1408]">
              Hero Media Switcher
            </h2>
            <p className="text-xs text-[#2A1408]/70">
              Switch between full-screen date-palm motion/video and still image,
              or upload a custom video/photo from your computer.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => updateHeroMedia({ mode: 'video' })}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium inline-flex items-center justify-center gap-2 cursor-pointer ${
                  settings.heroMedia.mode === 'video'
                    ? 'bg-[#6E0B16] text-[#FFFDF7]'
                    : 'bg-[#FFF7EA] text-[#2A1408]'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Video / Motion Mode</span>
              </button>
              <button
                type="button"
                onClick={() => updateHeroMedia({ mode: 'image' })}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium inline-flex items-center justify-center gap-2 cursor-pointer ${
                  settings.heroMedia.mode === 'image'
                    ? 'bg-[#6E0B16] text-[#FFFDF7]'
                    : 'bg-[#FFF7EA] text-[#2A1408]'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Still Image Mode</span>
              </button>
            </div>

            <div className="space-y-3 pt-2">
              <label className="block text-xs font-semibold uppercase">
                Upload Hero Video (.mp4 / .webm)
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleHeroFileUpload(e, 'video')}
                  className="mt-1 block text-xs"
                />
              </label>

              <label className="block text-xs font-semibold uppercase">
                Upload Hero Still Image (.jpg / .png)
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleHeroFileUpload(e, 'image')}
                  className="mt-1 block text-xs"
                />
              </label>
            </div>

            {settings.heroMedia.isCustomUploaded && (
              <button
                type="button"
                onClick={() =>
                  updateHeroMedia({
                    mode: 'video',
                    imageUrl: HERO_PALM_IMAGE,
                    videoUrl: HERO_PALM_VIDEO,
                    isCustomUploaded: false,
                  })
                }
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#A41220] text-[#A41220] text-xs font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Remove Uploaded Media & Revert to Date-Palm Default</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB 7: DATA EXPORT / IMPORT / RESET */}
      {tab === 'data' && (
        <div className="py-8 max-w-2xl space-y-6">
          <div className="bg-[#FFFDF7] border border-[#2A1408]/12 rounded-2xl p-6 space-y-4">
            <h2 className="font-display text-xl font-bold text-[#2A1408]">
              Export, Import & Reset Store Data
            </h2>
            <p className="text-sm text-[#2A1408]/75">
              Catalogue items, orders, testimonials, inquiries, and hero
              settings are persisted on the backend ({backendMode === 'supabase' ? 'Supabase PostgreSQL' : 'Server JSON Store'}).
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleDownloadBackup}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#A41220] text-[#FFFDF7] text-sm font-medium cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export JSON Backup</span>
              </button>

              <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#2A1408]/20 bg-white text-sm font-medium cursor-pointer hover:bg-[#FFF7EA]">
                <Upload className="w-4 h-4" />
                <span>Import JSON</span>
                <input
                  type="file"
                  accept="application/json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={async () => {
                  await resetAllData();
                  setImportStatus('All data reset to initial 25-product defaults.');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#6E0B16] text-[#6E0B16] text-sm font-medium cursor-pointer hover:bg-[#6E0B16]/5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset to Demo Defaults</span>
              </button>
            </div>

            {importStatus && (
              <p className="text-sm font-medium text-[#1E7A46]">{importStatus}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
