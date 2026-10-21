import Container from './Container.jsx'
import FeatureCard from './FeatureCard.jsx'
import { features } from '../data/landing.js'

export default function FeaturesSection() {
  return (
    <section id="features" aria-labelledby="features-title" className="bg-white pt-16 pb-20 sm:pt-24 sm:pb-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="features-title" className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            Everything you need in one platform
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            From resume analysis to automated technical interviews, TalentForge covers the entire recruitment
            lifecycle.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:mt-14 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </Container>
    </section>
  )
}
