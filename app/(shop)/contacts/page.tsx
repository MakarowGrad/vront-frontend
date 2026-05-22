import type { Metadata } from 'next';
import { Phone, Clock, Mail, MapPin, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Контакты',
  description: 'Контактная информация В СВОЕЙ ТАРЕЛКЕ',
};

export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-background-primary">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl text-text-primary mb-4">
            Контакты
          </h1>
          <p className="text-body text-text-secondary max-w-lg mx-auto">
            Свяжитесь со мной удобным способом — всегда рада помочь с вашим мероприятием.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-surface-secondary border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
                <User className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-serif text-heading-sm text-text-primary">Фуршетный мастер Жанна</h3>
            </div>
            <p className="text-body text-text-secondary">Работаю в Жигалово и районе</p>
          </div>

          <div className="bg-surface-secondary border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
                <Phone className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-serif text-heading-sm text-text-primary">Телефоны</h3>
            </div>
            <div className="space-y-2">
              <a href="tel:89025475544" className="block text-body text-text-secondary hover:text-gold transition-colors">
                8 (902) 547-55-44
              </a>
              <a href="tel:89642712291" className="block text-body text-text-secondary hover:text-gold transition-colors">
                8 (964) 271-22-91
              </a>
            </div>
          </div>

          <div className="bg-surface-secondary border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-serif text-heading-sm text-text-primary">Режим работы</h3>
            </div>
            <p className="text-body text-text-secondary">Ежедневно: 9:00 — 21:00</p>
          </div>

          <div className="bg-surface-secondary border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-serif text-heading-sm text-text-primary">Работаю в</h3>
            </div>
            <p className="text-body text-text-secondary">Жигалово</p>
          </div>

          <div className="bg-surface-secondary border border-border rounded-2xl p-6 sm:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-serif text-heading-sm text-text-primary">Email</h3>
            </div>
            <a href="mailto:info@vsvoitar.ru" className="text-body text-text-secondary hover:text-gold transition-colors">
              info@vsvoitar.ru
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
