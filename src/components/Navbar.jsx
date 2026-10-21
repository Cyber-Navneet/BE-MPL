import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Container from './Container.jsx'
import BrandLogo from './BrandLogo.jsx'
import Button from './Button.jsx'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <BrandLogo boxed />

        <nav aria-label="Account" className="flex items-center gap-2 sm:gap-6">
          <Link
            to="/login"
            className="rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap text-body hover:text-navy focus-visible:outline-2 focus-visible:outline-primary"
          >
            Sign In
          </Link>
          <Button to="/signup" size="sm">
            Get Started <ArrowRight size={16} aria-hidden="true" />
          </Button>
        </nav>
      </Container>
    </header>
  )
}
