import { useEffect, useRef } from 'react'
import Spline from '@splinetool/react-spline'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import StairTransition from './components/StairTransition'
import Navbar from './components/Navbar'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const marqueeRef = useRef(null)
  const cursorRef = useRef(null)

  useEffect(() => {
    // Custom cursor
    const cursor = cursorRef.current
    const move = (e) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.2, ease: 'power3.out' })
    }
    window.addEventListener('mousemove', move)

    // Smooth-ish scroll inertia effect for marquees
    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray('.marquee-row')
      rows.forEach((row, i) => {
        const speed = i % 2 === 0 ? -50 : 50
        const inner = row.querySelector('.marquee-inner')
        gsap.to(inner, {
          xPercent: speed,
          repeat: -1,
          ease: 'none',
          duration: 20,
        })

        // speed up on scroll
        let scrollVel = 0
        ScrollTrigger.create({
          onUpdate: (self) => {
            const v = self.getVelocity() / 1000
            if (Math.abs(v - scrollVel) > 0.2) {
              scrollVel = v
              gsap.to(inner, { timeScale: 1 + Math.min(Math.max(v, -2), 2), duration: 0.2 })
            }
          },
        })
      })

      // Line by line reveal
      gsap.utils.toArray('.reveal-line').forEach((el, i) => {
        gsap.fromTo(
          el,
          { yPercent: 100 },
          {
            yPercent: 0,
            duration: 0.8,
            ease: 'power4.out',
            scrollTrigger: { trigger: el, start: 'top 80%' },
          }
        )
      })

      // Parallax images
      gsap.utils.toArray('[data-parallax]').forEach((el) => {
        gsap.to(el, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', scrub: true },
        })
      })
    })

    return () => {
      window.removeEventListener('mousemove', move)
      ctx.revert()
    }
  }, [])

  return (
    <div className="bg-[#F0F0F0] text-black min-h-screen selection:bg-black selection:text-[#F0F0F0]">
      <StairTransition />
      <Navbar />

      {/* Custom cursor */}
      <div ref={cursorRef} className="fixed top-0 left-0 pointer-events-none z-[60] mix-blend-difference">
        <div className="size-8 rounded-full bg-white/90 backdrop-invert" />
      </div>

      {/* HERO */}
      <section className="relative h-[100svh] w-full overflow-hidden border-b border-black">
        <Spline scene="https://prod.spline.design/EF7JOSsHLk16Tlw9/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="text-center uppercase tracking-[-0.02em] leading-[0.95]">
            <h1 className="text-[10vw] font-black">ONE NATION.</h1>
            <h1 className="text-[10vw] font-black">ONE APP.</h1>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="relative border-b border-black">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'Syllabus', img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600&auto=format&fit=crop' },
            { title: 'Results', img: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?q=80&w=1600&auto=format&fit=crop' },
            { title: 'Career Connect', img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop' },
            { title: 'Mentorship', img: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1600&auto=format&fit=crop' },
          ].map((item, i) => (
            <FeatureTile key={i} {...item} />
          ))}
        </div>
      </section>

      {/* MARQUEES */}
      <section className="border-b border-black py-8 md:py-14 bg-black text-[#F0F0F0]">
        <MarqueeRow text="UNIVERSITY PARTNERS • ".repeat(20)} />
        <MarqueeRow text="RECENT PLACEMENTS • ".repeat(20)} reverse />
      </section>

      {/* STUDY NOW PAY LATER */}
      <section className="py-24 md:py-40">
        <div className="container mx-auto px-6">
          <div className="overflow-hidden">
            <p className="reveal-line text-6xl md:text-8xl font-black uppercase leading-[0.95]">Study Now,</p>
          </div>
          <div className="overflow-hidden">
            <p className="reveal-line text-6xl md:text-8xl font-black uppercase leading-[0.95]">Pay Later.</p>
          </div>
          <p className="mt-6 max-w-3xl text-lg md:text-xl">Flexible financing designed for ambitious learners. Focus on mastering skills today—settle tuition once you land your role through UniConnect.</p>
        </div>
      </section>

      <footer className="border-t border-black py-12 text-center uppercase text-sm tracking-tight">© {new Date().getFullYear()} UniConnect</footer>
    </div>
  )
}

function FeatureTile({ title, img }) {
  const ref = useRef(null)
  const imgRef = useRef(null)

  useEffect(() => {
    const el = ref.current
    const imgEl = imgRef.current

    const enter = () => {
      gsap.to(el, { backgroundColor: '#CCFF00', color: '#000', duration: 0.25, ease: 'power2.out' })
      gsap.to(imgEl, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power3.out' })
    }
    const leave = () => {
      gsap.to(el, { backgroundColor: '#F0F0F0', color: '#000', duration: 0.25, ease: 'power2.out' })
      gsap.to(imgEl, { autoAlpha: 0, scale: 0.9, duration: 0.3, ease: 'power3.out' })
    }
    const move = (e) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      gsap.to(imgEl, { x: x - 100, y: y - 80, duration: 0.2, ease: 'power3.out' })
    }

    el.addEventListener('mouseenter', enter)
    el.addEventListener('mouseleave', leave)
    el.addEventListener('mousemove', move)
    return () => {
      el.removeEventListener('mouseenter', enter)
      el.removeEventListener('mouseleave', leave)
      el.removeEventListener('mousemove', move)
    }
  }, [])

  return (
    <div ref={ref} className="relative aspect-[4/3] md:aspect-square border border-black p-6 md:p-8 overflow-hidden group cursor-none">
      <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight">{title}</h3>
      <img
        ref={imgRef}
        src={img}
        alt=""
        className="pointer-events-none absolute top-0 left-0 w-48 h-36 object-cover rounded-md shadow-2xl opacity-0 scale-90"
      />
    </div>
  )
}

function MarqueeRow({ text, reverse = false }) {
  return (
    <div className="marquee-row overflow-hidden whitespace-nowrap">
      <div className={`marquee-inner inline-block will-change-transform ${reverse ? 'animate-[none]' : ''}`}>
        <span className="text-[8vw] font-black uppercase tracking-tight mr-8">{text}</span>
        <span className="text-[8vw] font-black uppercase tracking-tight mr-8">{text}</span>
      </div>
    </div>
  )
}

export default App
