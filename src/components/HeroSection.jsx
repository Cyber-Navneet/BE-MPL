import { ArrowRight, Sparkles } from 'lucide-react'
import Container from './Container.jsx'
import Button from './Button.jsx'
import TrustIndicators from './TrustIndicators.jsx'

export default function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-white">
      {/* Soft background glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-pale via-white/60 to-white" />
        <div className="absolute top-40 -left-56 h-[30rem] w-[30rem] rounded-full bg-emerald-100/60 blur-3xl" />
        <div className="absolute top-16 -right-64 h-[30rem] w-[30rem] rounded-full bg-blue-100/80 blur-3xl" />
      </div>

      <Container className="pt-16 pb-24 sm:pt-28 sm:pb-36">
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-pale px-4 py-1.5 text-sm font-medium text-deep">
          <Sparkles size={16} className="text-primary" aria-hidden="true" />
          AI-Powered Recruitment Platform
        </span>

        <h1
          id="hero-title"
          className="mt-6 text-[2.5rem] leading-[1.05] font-extrabold tracking-[-0.035em] text-navy sm:text-6xl"
        >
          Hire smarter.
          <span className="block text-primary">Interview faster.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-body sm:text-lg">
          The end-to-end platform that connects students with opportunities and empowers recruiters with AI-driven
          screening, automated assessments, and explainable matching.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button to="/signup?role=student" aria-label="Get started as a student">
            I'm a Student <ArrowRight size={16} aria-hidden="true" />
          </Button>
          <Button to="/signup?role=recruiter" variant="outline" aria-label="Get started as a recruiter">
            I'm a Recruiter
          </Button>
        </div>

        <div className="mt-10">
          <TrustIndicators />
        </div>
      </Container>
    </section>
  )
}
