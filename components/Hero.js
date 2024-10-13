import Image from 'next/image'
import { Button } from '@/components/ui/button'

const Hero = () => {
  return (
    <section className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Ship your startup in days, not weeks
            </h1>
            <p className="mt-6 text-xl text-gray-300">
              Our platform provides all the tools and resources you need to
              launch your startup quickly and efficiently.
            </p>
            <div className="mt-10">
              <Button size="lg" className="px-8 py-3 text-lg">
                Start Building Now
              </Button>
            </div>
          </div>
          <div className="mt-12 lg:mt-0">
            <Image
              src="/hero-image.jpg"
              alt="Startup Launch"
              width={600}
              height={400}
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
