import type { Metadata } from 'next';
import { Clock, MapPin, Phone, Heart, Sparkles, UtensilsCrossed } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Обо мне',
  description: 'В СВОЕЙ ТАРЕЛКЕ — фуршетный мастер Жанна, Жигалово',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background-primary">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl text-text-primary mb-4">
            Обо мне
          </h1>
          <p className="text-body text-text-secondary max-w-lg mx-auto">
            В СВОЕЙ ТАРЕЛКЕ — это я, Жанна, ваш фуршетный мастер в Жигалово.
            Готовлю, оформляю и организую фуршеты для любых поводов — от тёплой домашней встречи до
            масштабного праздника.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-surface-secondary border border-border rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-serif text-heading-sm text-text-primary mb-2">С душой</h3>
            <p className="text-body-sm text-text-secondary">
              Каждое блюдо готовлю лично, с вниманием к деталям и любовью к своему делу.
            </p>
          </div>

          <div className="bg-surface-secondary border border-border rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-serif text-heading-sm text-text-primary mb-2">Красивая подача</h3>
            <p className="text-body-sm text-text-secondary">
              Не просто вкусно — ещё и эстетично. Стол будет выглядеть так, что захочется сделать фото.
            </p>
          </div>

          <div className="bg-surface-secondary border border-border rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center mx-auto mb-4">
              <UtensilsCrossed className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-serif text-heading-sm text-text-primary mb-2">Индивидуально</h3>
            <p className="text-body-sm text-text-secondary">
              Подберу меню под ваш вкус, бюджет и повод. Учту все пожелания и особенности.
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="bg-surface-secondary border border-border rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="font-serif text-2xl text-text-primary">Почему меня выбирают</h2>
          <div className="space-y-4 text-body text-text-secondary leading-relaxed">
            <p>
              Я работаю одна — и это моё преимущество. Вы общаетесь напрямую с тем, кто будет готовить
              и оформлять ваш стол. Никаких посредников, никакой «передачи информации через третьих лиц».
            </p>
            <p>
              Каждый фуршет для меня — не просто заказ, а возможность сделать чей-то день особенным.
              Я подхожу к каждому мероприятию индивидуально: подбираю блюда под тематику, количество гостей
              и ваши предпочтения. От закуски до десерта — всё продумано.
            </p>
            <p>
              Работаю в Жигалово и ближайших населённых пунктах. Звоните или пишите — обсудим
              ваш праздник и подберём идеальное меню.
            </p>
          </div>

          <div className="border-t border-border pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gold shrink-0" />
              <span className="text-body-sm text-text-secondary">Ежедневно: 9:00 — 21:00</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gold shrink-0" />
              <span className="text-body-sm text-text-secondary">8 (902) 547-55-44</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gold shrink-0" />
              <span className="text-body-sm text-text-secondary">8 (964) 271-22-91</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gold shrink-0" />
              <span className="text-body-sm text-text-secondary">Жигалово</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
