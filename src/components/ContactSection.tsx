import { useState } from 'react';
import { CheckCircle2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useNagasStore } from '../store/StoreContext';
import type { ValidationErrors } from '../types/commerce';
import {
  buildWhatsAppHref,
  getWeeklyShopHours,
  validateInquiryForm,
} from '../utils/commerce';

export function ContactSection({ standalone = false }: { standalone?: boolean }) {
  const { settings, testimonials, addInquiry } = useNagasStore();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const weeklyHours = getWeeklyShopHours();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateInquiryForm(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      await addInquiry({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });
      setSubmitted(true);
      setForm({ name: '', phone: '', email: '', message: '' });
    } catch {
      setSubmitError('Could not send inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="testimonials-section"
      className={`scroll-mt-24 sm:scroll-mt-28 max-w-[1440px] mx-auto px-4 sm:px-8 space-y-16 ${
        standalone ? 'pt-28 sm:pt-32 pb-20' : 'py-14 sm:py-20'
      }`}
    >
      {/* Testimonials Grid */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#A41220] font-semibold">
              Community Voices
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2A1408] mt-1">
              Trusted across Trichy kitchens
            </h2>
          </div>
          <p className="font-script text-2xl text-[#C9962A]">
            real households, repeat pantry orders
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((item) => (
            <blockquote
              key={item.id}
              className="bg-[#FFFDF7] border border-[#2A1408]/10 rounded-2xl p-6 flex flex-col justify-between gap-4"
            >
              <p className="text-sm text-[#2A1408]/85 leading-relaxed">
                "{item.quote}"
              </p>
              <footer className="pt-3 border-t border-[#2A1408]/10">
                <p className="font-display font-semibold text-sm text-[#2A1408]">
                  {item.author}
                </p>
                <p className="text-xs text-[#2A1408]/60 mt-0.5">
                  {item.location} · {item.itemBought}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>

      {/* Contact & Inquiry Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#A41220] font-semibold">
              {standalone ? 'Contact NAGAS FOODS' : 'Reach Out Directly'}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2A1408] mt-1">
              Bulk hampers, store visits & questions
            </h2>
            <p className="text-sm text-[#2A1408]/75 mt-2 leading-relaxed">
              Need custom gift boxes, wedding trays, or wholesale dates pricing?
              Leave an inquiry or message us directly on WhatsApp.
            </p>
          </div>

          <div className="bg-[#FFFDF7] border border-[#2A1408]/10 rounded-2xl p-6 space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#A41220] mt-1 shrink-0" />
              <div>
                <p className="font-semibold text-[#2A1408]">NAGAS FOODS, Trichy</p>
                <p className="text-[#2A1408]/75">
                  Edamalaiapatti Pudur, Trichy-620012, Tamil Nadu
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#A41220] shrink-0" />
              <span className="tabular-nums font-medium">
                {settings.whatsappNumber}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#A41220] shrink-0" />
              <span>nagasfoodstrichy@gmail.com</span>
            </div>

            <div className="pt-2">
              <a
                href={buildWhatsAppHref(
                  settings.whatsappNumber,
                  'Hello NAGAS FOODS Trichy! I would like to place an order / inquire about your products.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-5 rounded-xl bg-[#1E7A46] text-[#FFFDF7] font-medium text-sm inline-flex items-center justify-center gap-2 hover:bg-[#176238] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat / Order via WhatsApp</span>
              </a>
            </div>
          </div>

          {standalone && (
            <div className="bg-[#FFFDF7] border border-[#2A1408]/10 rounded-2xl p-6">
              <p className="text-xs uppercase tracking-widest text-[#A41220] font-semibold mb-3">
                Shop Hours (Placeholder)
              </p>
              <ul className="divide-y divide-[#2A1408]/8 text-sm">
                {weeklyHours.map((entry) => (
                  <li
                    key={entry.day}
                    className={`py-2 flex items-center justify-between ${
                      entry.isToday ? 'font-bold text-[#A41220]' : 'text-[#2A1408]/80'
                    }`}
                  >
                    <span>
                      {entry.day}
                      {entry.isToday ? ' (Today)' : ''}
                    </span>
                    <span className="tabular-nums">{entry.hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="lg:col-span-7 bg-[#FFFDF7] border border-[#2A1408]/12 rounded-2xl p-6 sm:p-8 shadow-xs">
          <h3 className="font-display text-2xl font-bold text-[#2A1408]">
            Send an Inquiry
          </h3>
          <p className="text-xs text-[#2A1408]/65 mt-1">
            Messages go directly to our Trichy store desk (also visible inside Admin Inquiries).
          </p>

          {submitted && (
            <div className="mt-4 p-4 rounded-xl bg-[#1E7A46]/10 border border-[#1E7A46]/30 text-[#1E7A46] text-sm flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>
                Inquiry received! Our team in Trichy will call or WhatsApp you shortly.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="inq-name"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#2A1408]/75 mb-1.5"
                >
                  Your Name
                </label>
                <input
                  id="inq-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Full name"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#2A1408]/20 bg-white text-sm focus:outline-none focus:border-[#A41220]"
                />
                {errors.name && (
                  <p className="text-xs text-[#A41220] mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="inq-phone"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#2A1408]/75 mb-1.5"
                >
                  Phone / WhatsApp
                </label>
                <input
                  id="inq-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="10-digit mobile number"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#2A1408]/20 bg-white text-sm tabular-nums focus:outline-none focus:border-[#A41220]"
                />
                {errors.phone && (
                  <p className="text-xs text-[#A41220] mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="inq-email"
                className="block text-xs font-semibold uppercase tracking-wider text-[#2A1408]/75 mb-1.5"
              >
                Email (Optional)
              </label>
              <input
                id="inq-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#2A1408]/20 bg-white text-sm focus:outline-none focus:border-[#A41220]"
              />
              {errors.email && (
                <p className="text-xs text-[#A41220] mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="inq-message"
                className="block text-xs font-semibold uppercase tracking-wider text-[#2A1408]/75 mb-1.5"
              >
                Message / Product Requirement
              </label>
              <textarea
                id="inq-message"
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us the varieties, quantities, or delivery location..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#2A1408]/20 bg-white text-sm focus:outline-none focus:border-[#A41220]"
              />
              {errors.message && (
                <p className="text-xs text-[#A41220] mt-1">{errors.message}</p>
              )}
            </div>

            {submitError && (
              <p className="text-xs font-medium text-[#A41220]">{submitError}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-[#A41220] text-[#FFFDF7] text-sm font-medium hover:bg-[#6E0B16] transition-colors cursor-pointer disabled:opacity-60"
            >
              {submitting ? 'Sending...' : 'Send Inquiry'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
