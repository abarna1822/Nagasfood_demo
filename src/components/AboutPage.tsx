import { IMG_DATES_FLATLAY, IMG_HONEY_JAR, IMG_DATES_PALM } from '../data/seedData';
import { ProductMedia } from './ProductMedia';

interface AboutPageProps {
  onBrowseProducts: () => void;
}

export function AboutPage({ onBrowseProducts }: AboutPageProps) {
  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-28 sm:pt-32 pb-20 space-y-16">
      {/* Split Story Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
          <p className="text-xs uppercase tracking-widest text-[#A41220] font-semibold">
            Our Heritage · Trichy-620012
          </p>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-[#2A1408] leading-[1.05]">
            Purity You Can Trust, Quality You Deserve.
          </h1>
          <p className="font-script text-2xl text-[#C9962A]">
            direct from orchard groves to Edamalaiapatti Pudur
          </p>
          <p className="text-base text-[#2A1408]/80 leading-relaxed max-w-xl">
            NAGAS FOODS began with a simple promise in Trichy: families
            should never have to guess whether the dates in a box are fresh, or
            whether a jar of forest honey has been thinned with sugar syrup. We
            partner directly with Bam date growers, Madinah suppliers, and
            Western Ghats forest apiaries—then hand-sort every batch ourselves.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onBrowseProducts}
              className="px-6 py-3 rounded-xl bg-[#A41220] text-[#FFFDF7] text-sm font-medium hover:bg-[#6E0B16] transition-colors cursor-pointer"
            >
              Explore All 25 Lines
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-[#2A1408]/10">
            <ProductMedia src={IMG_DATES_FLATLAY} alt="Hand-sorted Iranian Kimia Dates" />
          </div>
          <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-[#2A1408]/10 mt-6">
            <ProductMedia src={IMG_HONEY_JAR} alt="Wild Forest Raw Honey Jar" />
          </div>
        </div>
      </div>

      {/* Four Quality Pillars */}
      <div className="bg-[#6E0B16] text-[#FFF7EA] rounded-3xl p-8 sm:p-12">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-[#E8A020] font-semibold">
            Standards We Keep
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mt-1">
            Why Trichy households trust our seal
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              num: '01.',
              title: 'Zero Sugar Glaze',
              body: 'Dates are packed with their natural fruit moisture—never coated in glucose syrup to fake gloss.',
            },
            {
              num: '02.',
              title: 'Unheated Raw Honey',
              body: 'Cold-strained straight into glass jars so natural enzymes, pollen, and floral aroma stay intact.',
            },
            {
              num: '03.',
              title: 'Same-Week Sorting',
              body: 'Every pouch and box is hand-checked in Edamalaiapatti Pudur before sealing for local dispatch.',
            },
            {
              num: '04.',
              title: 'FSSAI Licensed',
              body: 'Registered food safety compliance under FSSAI Lic. No: 22423590000134 with transparent weights.',
            },
          ].map((pillar) => (
            <div
              key={pillar.num}
              className="p-6 rounded-2xl bg-[#FFFDF7]/6 border border-[#FFF7EA]/12 space-y-2"
            >
              <p className="font-display text-2xl font-bold text-[#E8A020]">
                {pillar.num}
              </p>
              <h3 className="font-display text-xl font-semibold text-[#FFFDF7]">
                {pillar.title}
              </h3>
              <p className="text-sm text-[#FFF7EA]/80 leading-relaxed">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Storefront Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FFFDF7] border border-[#2A1408]/10 rounded-3xl p-6 sm:p-10">
        <div className="lg:col-span-5 aspect-[4/3] rounded-2xl overflow-hidden">
          <ProductMedia src={IMG_DATES_PALM} alt="Fresh date clusters harvested on the palm" />
        </div>
        <div className="lg:col-span-7 space-y-4">
          <p className="text-xs uppercase tracking-widest text-[#A41220] font-semibold">
            Visit Our Trichy Counter
          </p>
          <h2 className="font-display text-3xl font-bold text-[#2A1408]">
            Edamalaiapatti Pudur, Trichy-620012
          </h2>
          <p className="text-sm text-[#2A1408]/80 leading-relaxed">
            Prefer tasting before buying bulk boxes for weddings, Ramadan
            hampers, or festive gifting? Drop by our Edamalaiapatti Pudur shop
            during store hours or message us directly on WhatsApp for custom
            assortments.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-sm">
            <div>
              <p className="text-xs text-[#2A1408]/60">Customer Care</p>
              <p className="font-semibold tabular-nums">63791 78126</p>
            </div>
            <div>
              <p className="text-xs text-[#2A1408]/60">Email</p>
              <p className="font-semibold break-all">nagasfoodstrichy@gmail.com</p>
            </div>
            <div>
              <p className="text-xs text-[#2A1408]/60">FSSAI Lic. No</p>
              <p className="font-semibold tabular-nums">22423590000134</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
