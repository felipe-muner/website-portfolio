import React from "react"
import { Button } from "../ui/button"


interface BreadcrumbProps {
  route: string
  isClass?: boolean
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ route, isClass }) => {
  return (
    <section className="h-[500px] pt-[230px] bg-[url('/img/breadcrumb-bg.jpg')] bg-cover bg-center bg-brand-background-2 w-full">
      <div className="mx-auto">
        <div className="flex justify-center items-center">
          <div className="text-center">
            <h2 className="text-6xl text-white font-semibold uppercase mb-4">
              {route}
            </h2>            
            {isClass && <Button className="mt-4 bg-transparent hover:bg-brand-orange px-8 py-6 uppercase border hover:border-brand-orange">
              Take a tour
            </Button>}
          </div>

        </div>
      </div>
    </section>
  )
}

export default Breadcrumb
