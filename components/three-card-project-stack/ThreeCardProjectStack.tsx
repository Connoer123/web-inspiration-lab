import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

type StackItem = { id: string; content: ReactNode }

function StackCard({ item, index, total }: { item: StackItem; index: number; total: number }) {
  const card = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: card, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [.55, 1], [1, 1 - (total - 1 - index) * .03])
  return <div className="stack-stage"><motion.article ref={card} className="stack-card" style={{ scale, top: `calc(6rem + ${index * 28}px)` }}>{item.content}</motion.article></div>
}

// Stacks three cards while scrolling through the section.
export function ThreeCardProjectStack({ items }: { items: [StackItem, StackItem, StackItem] }) {
  return <>{items.map((item, index) => <StackCard item={item} index={index} total={items.length} key={item.id} />)}</>
}
