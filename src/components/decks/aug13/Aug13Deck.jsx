import Aug13S1 from './Aug13S1'
import Aug13S2 from './Aug13S2'
import Aug13S3 from './Aug13S3'
import Aug13S4 from './Aug13S4'
import Aug13S5 from './Aug13S5'
import Aug13S6 from './Aug13S6'
import Aug13S7 from './Aug13S7'

export default function Aug13Deck({ currentSlide, lockedSlides, rsvp, handleRSVP, navigate }) {
  const slides = [Aug13S1, Aug13S2, Aug13S3, Aug13S4, Aug13S5, Aug13S6, Aug13S7]

  return (
    <>
      {slides.map((Slide, idx) => {
        const slideNum = idx + 1
        const isActive = currentSlide === slideNum
        return (
          <section
            key={slideNum}
            className={`section-wrapper flex items-center justify-center p-6 md:p-10${isActive ? ' active' : ''}`}
          >
            <Slide
              navigate={navigate}
              rsvp={rsvp}
              handleRSVP={handleRSVP}
              locked={slideNum === 4 && lockedSlides.has(4)}
            />
          </section>
        )
      })}
    </>
  )
}
