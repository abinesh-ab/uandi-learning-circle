import Aug6S1 from './Aug6S1'

export default function Aug6Deck({ currentSlide }) {
  return (
    <section className={`section-wrapper flex items-start justify-center p-4 md:p-6${currentSlide === 1 ? ' active' : ''}`}>
      <Aug6S1 />
    </section>
  )
}
