import Container from './Container.jsx'
import BrandLogo from './BrandLogo.jsx'

export default function Footer() {
  return (
    <footer className="bg-white py-8">
      <Container className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <BrandLogo />
        <p className="text-sm text-muted">© 2025 TalentForge. Built for academic excellence.</p>
      </Container>
    </footer>
  )
}
