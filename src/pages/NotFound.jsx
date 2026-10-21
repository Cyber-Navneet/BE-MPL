import Container from '../components/Container.jsx'
import Button from '../components/Button.jsx'

export default function NotFound() {
  return (
    <section className="py-24">
      <Container className="text-center">
        <p className="text-sm font-semibold text-primary">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy">Page not found</h1>
        <p className="mt-3 text-muted">The page you're looking for doesn't exist.</p>
        <Button to="/" className="mt-8">
          Go home
        </Button>
      </Container>
    </section>
  )
}
