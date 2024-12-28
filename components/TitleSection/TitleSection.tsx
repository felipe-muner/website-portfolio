import { cn } from "@/lib/utils"
import React from "react"

interface TitleSectionProps {
  subtitle: string
  title: string
  className?: string
}

const TitleSection: React.FC<TitleSectionProps> = ({ subtitle, title, className }) => {
  return (
    <div className={
      cn(`text-center mb-11`, className)}>
      <span className="text-brand-orange text-md uppercase font-mulish font-bold">
        {subtitle}
      </span>
      <h2 className="text-[32px] font-bold text-white mt-1 uppercase">
        {title}
      </h2>
    </div>
  )
}

export default TitleSection;