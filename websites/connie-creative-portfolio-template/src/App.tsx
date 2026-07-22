import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'

// Replace these labels and links first.
const navItems = [
  ['Button 01', '#section-01'],
  ['Button 02', '#section-02'],
  ['Button 03', '#section-03'],
  ['Button 04', '#section-04'],
] as const

// Add or remove items as needed.
const section02Items = Array.from({ length: 5 }, (_, index) => ({
  title: `Title ${String(index + 1).padStart(2, '0')}`,
  text: 'Text to write here about this service, skill, or offering. Keep it short and useful for the reader.',
}))

const section03Items = Array.from({ length: 3 }, (_, index) => ({
  name: `Project title ${String(index + 1).padStart(2, '0')}`,
  category: 'Category',
}))

const section01Text = 'Text to write here about yourself, your creative approach, your experience, and the kind of work you would like to make. Add a personal detail that helps people understand your style.'

// Reusable entrance animation.
function FadeIn({ children, delay = 0, y = 30, className = '' }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '50px', amount: 0 }} transition={{ delay, duration: .7, ease: [.25, .1, .25, 1] }}>{children}</motion.div>
}

// Use one button style across the template.
function ActionButton({ outlined = false }: { outlined?: boolean }) {
  return <a className={outlined ? 'live-button' : 'contact-button'} href="#section-04">Button <ArrowUpRight size={17} /></a>
}

function ImageHolder({ label = 'Image', className = '' }: { label?: string; className?: string }) {
  return <div className={`image-holder ${className}`} role="img" aria-label={label}><span>{label}</span></div>
}

// Small cursor-following portrait effect.
function Magnet({ children }: { children: ReactNode }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const move = (event: MouseEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    setPosition({ x: (event.clientX - box.left - box.width / 2) / 3, y: (event.clientY - box.top - box.height / 2) / 3 })
  }
  return <div className="magnet" onMouseMove={move} onMouseLeave={() => setPosition({ x: 0, y: 0 })} style={{ transform: `translate3d(${position.x}px,${position.y}px,0)` }}>{children}</div>
}

function HeroSection() {
  return <section className="hero">
    <FadeIn y={-20} className="hero-nav"><nav>{navItems.map(([label, href]) => <a href={href} key={href}>{label}</a>)}</nav></FadeIn>
    {/* Replace with your name. */}
    <FadeIn delay={.15} y={40} className="hero-title"><h1 className="hero-heading">Hi, i&apos;m connie</h1></FadeIn>
    {/* Replace this optimized portrait with your own. */}
    <FadeIn delay={.6} y={30} className="portrait"><Magnet><img src={`${import.meta.env.BASE_URL}assets/connie-portrait.webp`} alt="3D portrait of Connie" /></Magnet></FadeIn>
    <div className="hero-bottom">
      <FadeIn delay={.35} y={20}><p>Text to write here about your work and what makes it memorable.</p></FadeIn>
      <FadeIn delay={.5} y={20}><ActionButton /></FadeIn>
    </div>
  </section>
}

function MarqueeSection() {
  const section = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState(0)
  useEffect(() => {
    const update = () => section.current && setOffset((window.scrollY - section.current.offsetTop + window.innerHeight) * .3)
    update(); window.addEventListener('scroll', update, { passive: true }); return () => window.removeEventListener('scroll', update)
  }, [])
  // Duplicate holders to keep both rows filled.
  return <section className="marquee" id="image-row" ref={section}>{[1, -1].map((direction, row) => <div className="marquee-window" key={row}><div className="marquee-track" style={{ transform: `translateX(${direction * (offset - 200)}px)` }}>{Array.from({ length: 24 }, (_, index) => <ImageHolder key={index} />)}</div></div>)}</section>
}

function AnimatedCharacter({ char, progress, start }: { char: string; progress: MotionValue<number>; start: number }) {
  const opacity = useTransform(progress, [start, Math.min(1, start + .12)], [.2, 1])
  return <span className="animated-character"><span>{char}</span><motion.span style={{ opacity }}>{char}</motion.span></span>
}

function AnimatedText() {
  const target = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target, offset: ['start .8', 'end .2'] })
  return <p className="animated-text" ref={target}>{section01Text.split('').map((char, index) => <AnimatedCharacter key={index} char={char} progress={scrollYProgress} start={index / section01Text.length * .88} />)}</p>
}

function Section01() {
  return <section className="section-01" id="section-01">
    <FadeIn y={40}><h2 className="hero-heading">Title 01</h2></FadeIn>
    <AnimatedText />
    <FadeIn><ActionButton /></FadeIn>
  </section>
}

function Section02() {
  return <section className="section-02" id="section-02"><FadeIn><h2>Title 02</h2></FadeIn><div className="section-02-list">{section02Items.map((item, index) => <FadeIn delay={index * .1} key={item.title}><article><strong>{String(index + 1).padStart(2, '0')}</strong><div><h3>{item.title}</h3><p>{item.text}</p></div></article></FadeIn>)}</div></section>
}

function ItemCard({ item, index }: { item: typeof section03Items[number]; index: number }) {
  const card = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: card, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [.55, 1], [1, 1 - (section03Items.length - 1 - index) * .03])
  return <div className="section-03-stage"><motion.article className="section-03-card" ref={card} style={{ scale, top: `calc(6rem + ${index * 28}px)` }}>
    <div className="section-03-header"><strong>{String(index + 1).padStart(2, '0')}</strong><div><span>{item.category}</span><h3>{item.name}</h3></div><ActionButton outlined /></div>
    <div className="section-03-images"><div><ImageHolder /><ImageHolder /></div><ImageHolder /></div>
  </motion.article></div>
}

function Section03() {
  return <section className="section-03" id="section-03"><FadeIn><h2 className="hero-heading">Title 03</h2></FadeIn>{section03Items.map((item, index) => <ItemCard item={item} index={index} key={item.name} />)}<div className="section-03-end" /></section>
}

function Section04() {
  return <section className="section-04" id="section-04">
    <FadeIn><p className="section-04-kicker">Text to write here about this section</p><h2 className="hero-heading">Title 04</h2></FadeIn>
    {/* Connect this form to your preferred form service. */}
    <FadeIn delay={.15}><form aria-label="Contact form" onSubmit={event => event.preventDefault()}>
      <label><span>Name</span><input type="text" placeholder="Write your name here" /></label>
      <label><span>Email</span><input type="email" placeholder="Write your email here" /></label>
      <label className="message-field"><span>Message</span><textarea rows={5} placeholder="Write your message here" /></label>
      <button className="contact-button" type="submit">Button <ArrowUpRight size={17} /></button>
    </form></FadeIn>
  </section>
}

function ProjectStackScreenshot() {
  return <main className="static-stack-demo">
    <div className="static-stack-heading"><span>Component preview</span><h1>Three-card project stack</h1></div>
    <div className="static-stack-canvas">{section03Items.map((item, index) => <article className="static-stack-card" style={{ top: `${index * 70}px`, left: `${index * 2}%`, width: `${100 - index * 4}%` }} key={item.name}>
      <header><strong>0{index + 1}</strong><div><span>{item.category}</span><h2>{item.name}</h2></div></header>
      <div className="static-stack-images"><ImageHolder /><ImageHolder /></div>
    </article>)}</div>
  </main>
}

export default function App() {
  const search = new URLSearchParams(window.location.search)
  const demo = search.get('demo')
  const isScreenshot = search.has('screenshot')

  // Restore direct section links after React mounts.
  useEffect(() => {
    if (!window.location.hash) return
    requestAnimationFrame(() => document.querySelector(window.location.hash)?.scrollIntoView())
  }, [])

  if (demo === 'scroll-gallery') return <main className="component-demo"><div className="component-demo-heading"><span>Component preview</span><h1>Two-row scrolling gallery</h1><p>Scroll to move both rows in opposite directions.</p></div><MarqueeSection /></main>
  if (demo === 'project-stack' && isScreenshot) return <ProjectStackScreenshot />
  if (demo === 'project-stack') return <main className="component-demo"><Section03 /></main>

  return <main><HeroSection /><MarqueeSection /><Section01 /><Section02 /><Section03 /><Section04 /></main>
}
