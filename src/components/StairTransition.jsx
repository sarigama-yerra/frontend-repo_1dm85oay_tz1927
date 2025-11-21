import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const COLUMNS = 6

export default function StairTransition({ onComplete }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cols = gsap.utils.toArray('.stair-col')
      gsap.set(cols, { yPercent: 0 })

      const tl = gsap.timeline({
        defaults: { duration: 0.9, ease: 'power4.inOut' },
        onComplete: () => {
          if (containerRef.current) {
            gsap.set(containerRef.current, { autoAlpha: 0, display: 'none' })
          }
          onComplete && onComplete()
        }
      })

      cols.forEach((col, i) => {
        tl.to(
          col,
          { yPercent: i % 2 === 0 ? -110 : 110 },
          i === 0 ? 0 : `>-0.8`
        )
      })
    }, containerRef)

    return () => ctx.revert()
  }, [onComplete])

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] pointer-events-none select-none">
      <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${COLUMNS}, 1fr)` }}>
        {Array.from({ length: COLUMNS }).map((_, i) => (
          <div
            key={i}
            className="stair-col h-full w-full bg-black border-r border-white/5 last:border-none"
            aria-hidden
          />
        ))}
      </div>
    </div>
  )
}
