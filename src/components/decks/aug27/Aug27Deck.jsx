import Aug27S1 from './Aug27S1'
import Aug27S2 from './Aug27S2'
import Aug27S3 from './Aug27S3'
import Aug27S4 from './Aug27S4'

export default function Aug27Deck({ currentSlide }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-start overflow-y-auto px-4 pt-20 pb-28">
      {currentSlide === 1 && <Aug27S1 />}
      {currentSlide === 2 && <Aug27S2 />}
      {currentSlide === 3 && <Aug27S3 />}
      {currentSlide === 4 && <Aug27S4 />}
    </div>
  )
}
