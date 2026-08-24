import Aug20S1 from './Aug20S1'
import Aug20S2 from './Aug20S2'
import Aug20S3 from './Aug20S3'

export default function Aug20Deck({ currentSlide }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-start overflow-y-auto px-4 pt-20 pb-28">
      {currentSlide === 1 && <Aug20S1 />}
      {currentSlide === 2 && <Aug20S2 />}
      {currentSlide === 3 && <Aug20S3 />}
    </div>
  )
}
