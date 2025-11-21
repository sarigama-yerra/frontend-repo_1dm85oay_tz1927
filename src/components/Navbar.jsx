import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { Menu } from 'lucide-react'

const links = [
  { label: 'Jobs', href: '#' },
  { label: 'Syllabus', href: '#' },
  { label: 'Results', href: '#' },
  { label: 'Mentorship', href: '#' },
]

export default function Navbar() {
  const navRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.nav-roll')
      items.forEach((el) => {
        const inner = el.querySelector('.inner')
        const tl = gsap.timeline({ paused: true })
        tl.to(inner, { yPercent: -50, duration: 0.35, ease: 'power3.out' })
        el.addEventListener('mouseenter', () => tl.play())
        el.addEventListener('mouseleave', () => tl.reverse())
      })
    }, navRef)

    return () => ctx.revert()
  }, [])

  return (
    <header ref={navRef} className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
      <div className="flex items-center justify-between px-6 py-4 text-white uppercase tracking-tight">
        <a href="#" className="font-black text-xl">UniConnect</a>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="nav-roll overflow-hidden h-6 leading-[24px]">
              <span className="block inner will-change-transform">
                <span className="block">{l.label}</span>
                <span className="block text-[#CCFF00]">{l.label}</span>
              </span>
            </a>
          ))}
        </nav>
        <button className="md:hidden inline-flex items-center justify-center size-10 rounded-full border border-white/20">
          <Menu size={18} />
        </button>
      </div>
    </header>
  )
}
