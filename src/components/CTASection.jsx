import { ArrowRight } from 'lucide-react'
import Container from './Container.jsx'
import Button from './Button.jsx'

export default function CTASection() {
  return (
    <section aria-labelledby="cta-title" className="bg-gradient-to-b from-[#1650dc] to-deep py-16">
      <Container className="text-center">
        <h2 id="cta-title" className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready to transform your hiring?
        </h2>
        <p className="mx-auto mt-4 max-w-[34rem] text-base leading-relaxed text-blue-100">
          Join thousands of students and recruiters using TalentForge to find the perfect match.
        </p>
        <Button to="/signup" variant="inverse" className="mt-8 font-semibold">
          Get Started Free <ArrowRight size={16} aria-hidden="true" />
        </Button>
      </Container>
    </section>
  )
}
