import React from 'react'
import { Link } from 'react-router-dom'

const pageContent = {
  about: {
    title: 'O nas',
    intro: 'Shop Skeleton UI to sklep z produktami kuchni azjatyckiej, wybranymi z myślą o codziennym gotowaniu.',
    sections: [
      ['Starannie wybrane produkty', 'Dbamy o czytelny skład, aktualną dostępność i uczciwe ceny.'],
      ['Proste zakupy', 'Koszyk, płatność i śledzenie zamówienia są dostępne bez zakładania konta.'],
    ],
  },
  help: {
    title: 'Centrum pomocy',
    intro: 'Znajdź odpowiedź na pytania dotyczące zakupów, dostawy i zamówień.',
    sections: [
      ['Zamówienia', 'Status zamówienia sprawdzisz po jego numerze na stronie „Sprawdź zamówienie”.'],
      ['Dostawa', 'Podczas składania zamówienia wybierzesz dostępną metodę dostawy.'],
    ],
  },
  contact: {
    title: 'Kontakt',
    intro: 'Napisz do nas, jeśli potrzebujesz pomocy z produktem lub zamówieniem.',
    sections: [
      ['E-mail', 'marcelstulczewski@gmail.com'],
      ['Telefon', '+48 508 569 648'],
    ],
  },
  faq: {
    title: 'Najczęściej zadawane pytania',
    intro: 'Najważniejsze informacje przed i po złożeniu zamówienia.',
    sections: [
      ['Jak sprawdzić zamówienie?', 'Użyj numeru zamówienia na stronie sprawdzania zamówień.'],
      ['Kiedy sprawdzana jest dostępność?', 'Ostateczna dostępność jest potwierdzana podczas składania zamówienia.'],
    ],
  },
  privacy: {
    title: 'Polityka prywatności',
    intro: 'Wykorzystujemy dane podane przy zamówieniu wyłącznie do jego realizacji.',
    sections: [
      ['Dane zamówienia', 'Dane dostawy i płatności są używane do obsługi złożonego zamówienia.'],
    ],
  },
  terms: {
    title: 'Regulamin',
    intro: 'Składając zamówienie, potwierdzasz wybór produktów, dostawy i metody płatności.',
    sections: [
      ['Dostępność', 'Stan magazynowy jest ostatecznie potwierdzany podczas finalizacji zamówienia.'],
    ],
  },
}

function InfoPage({ page }) {
  const content = pageContent[page]

  return (
    <div className="mx-auto max-w-3xl py-8">
      <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-blue-600">Shop Skeleton UI</p>
      <h1 className="text-3xl font-bold text-gray-900">{content.title}</h1>
      <p className="mt-3 text-gray-600">{content.intro}</p>
      <div className="mt-8 space-y-4">
        {content.sections.map(([heading, text]) => (
          <section key={heading} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">{heading}</h2>
            <p className="mt-2 text-gray-600">{text}</p>
          </section>
        ))}
      </div>
      <Link to="/" className="mt-8 inline-flex font-semibold text-blue-600 hover:text-blue-700">Wróć do sklepu</Link>
    </div>
  )
}

export default InfoPage
