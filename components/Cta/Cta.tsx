import { cn } from "@/lib/utils"
import Link from "next/link"

interface CtaProps {
  href: string
  label: string
  className?: string
}

export default function Cta({ href, label, className }: CtaProps) {
  return (
    <Link
      href={href}
      className={
        cn(
          `font-mulish inline-block bg-transparent border-2
        border-brand-orange
        text-white
        py-4
        px-8
        text-sm
        font-bold
        uppercase
        tracking-[2px]
        hover:bg-brand-orange
        hover:text-white
        transition
      `, className
        )
      }
    >
      {label}
    </Link>
  )
}
