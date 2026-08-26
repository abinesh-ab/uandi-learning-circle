import Aug27Deck from './aug27/Aug27Deck'
import Aug20Deck from './aug20/Aug20Deck'
import Aug13Deck from './aug13/Aug13Deck'
import Aug6Deck from './aug6/Aug6Deck'
import July30Deck from './july30/July30Deck'
import July23Deck from './july23/July23Deck'

export default function DecksMode({ activeDeck, currentSlide, aug13LockedSlides, aug13RSVP, handleAug13RSVP, navigate }) {
  return (
    <div className="relative w-full h-full">
      {activeDeck === 'deck-aug27' && (
        <Aug27Deck currentSlide={currentSlide} />
      )}
      {activeDeck === 'deck-aug20' && (
        <Aug20Deck currentSlide={currentSlide} />
      )}
      {activeDeck === 'deck-aug13' && (
        <Aug13Deck
          currentSlide={currentSlide}
          lockedSlides={aug13LockedSlides}
          rsvp={aug13RSVP}
          handleRSVP={handleAug13RSVP}
          navigate={navigate}
        />
      )}
      {activeDeck === 'deck-aug6' && (
        <Aug6Deck currentSlide={currentSlide} />
      )}
      {activeDeck === 'deck-july30' && (
        <July30Deck currentSlide={currentSlide} />
      )}
      {activeDeck === 'deck-july23' && (
        <July23Deck currentSlide={currentSlide} />
      )}
    </div>
  )
}
