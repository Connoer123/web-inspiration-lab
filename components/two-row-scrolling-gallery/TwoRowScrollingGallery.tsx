import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react'

// Moves two repeated rows in opposite directions.
export function TwoRowScrollingGallery({ items }: { items: ReactNode[] }) {
  const section = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const update = () => section.current && setOffset((window.scrollY - section.current.offsetTop + window.innerHeight) * .3)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  const repeatedItems = Array.from({ length: 3 }, (_, repeat) =>
    items.map((item, index) => <Fragment key={`${repeat}-${index}`}>{item}</Fragment>),
  )

  return <section className="scrolling-gallery" ref={section}>{[1, -1].map((direction, row) => <div className="scrolling-gallery-window" key={row}><div className="scrolling-gallery-track" style={{ transform: `translateX(${direction * (offset - 200)}px)` }}>{repeatedItems}</div></div>)}</section>
}
