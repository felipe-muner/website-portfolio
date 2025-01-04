import React from "react"
import {
  Breadcrumb as UIBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface BreadcrumbProps {
  route: string
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ route }) => {
  return (
    <section className="h-[500px] pt-[230px] bg-[url('/img/breadcrumb-bg.jpg')] bg-cover bg-center bg-brand-background-2 w-full">
      <div className="mx-auto">
        <div className="flex justify-center items-center">
          <div className="text-center">
            <h2 className="text-6xl text-white font-semibold uppercase mb-4">
              {route}
            </h2>
            <UIBreadcrumb>
              <BreadcrumbList className="flex justify-center text-2xl">
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-white hover:text-background" href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-white" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-brand-orange">{route}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </UIBreadcrumb>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Breadcrumb
