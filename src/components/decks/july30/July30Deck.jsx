import July30S1 from './July30S1'
import July30S2 from './July30S2'
import July30S3 from './July30S3'
import July30S4 from './July30S4'

const slides = [July30S1, July30S2, July30S3, July30S4]

export default function July30Deck({ currentSlide }) {
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
