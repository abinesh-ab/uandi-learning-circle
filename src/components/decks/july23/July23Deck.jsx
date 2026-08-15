import July23S1 from './July23S1'
import July23S2 from './July23S2'
import July23S3 from './July23S3'
import July23S4 from './July23S4'
import July23S5 from './July23S5'
import July23S6 from './July23S6'
import July23S7 from './July23S7'
import July23S8 from './July23S8'
import July23S9 from './July23S9'

const slides = [July23S1, July23S2, July23S3, July23S4, July23S5, July23S6, July23S7, July23S8, July23S9]

export default function July23Deck({ currentSlide }) {
  return (
    <>
      {slides.map((Slide, idx) => {
        const slideNum = idx + 1
        return (
          <section
            key={slideNum}
            className={`section-wrapper flex items-center justify-center p-6 md:p-12${currentSlide === slideNum ? ' active' : ''}`}
          >
            <Slide />
          </section>
        )
      })}
    </>
  )
}
