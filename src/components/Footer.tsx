import { FormEvent } from 'react'
import type { ReactElement } from 'react'
import { Link, useNavigate } from 'react-router-dom'

interface FooterProps {
  variant?: 'instagram' | 'contact'
  minimal?: boolean
}

export default function Footer({ variant = 'instagram', minimal = false }: FooterProps): ReactElement {
  const navigate = useNavigate()

  const handleNewsletter = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const email = (data.get('email') as string) ?? ''
    navigate(`/thank-you?email=${encodeURIComponent(email)}`)
  }

  return (
    <footer className="site-footer" id="footer">
      {!minimal && (
        <div className="container footer-top">
          <div className="footer-brand">
            <Link className="brand" to="/" aria-label="Napak Living home">
              <span className="brand-mark" aria-hidden="true"></span>
              <span>napak living</span>
            </Link>
            <p>Objects for a slower home.</p>
          </div>
          <div className="footer-column">
            <p className="footer-label">Explore</p>
            <Link to="/catalog">Shop</Link>
            <Link to="/collections">Collections</Link>
            <Link to="/lookbook">Lookbook</Link>
            <Link to="/about">Our story</Link>
          </div>
          <div className="footer-column">
            <p className="footer-label">Get in touch</p>
            <a href="mailto:hello@napakliving.com">hello@napakliving.com</a>
            <a href="https://wa.me/6281234567890">WhatsApp</a>
            <Link to="/business">Trade inquiries</Link>
            {variant === 'instagram' ? (
              <a href="#footer">Instagram ↗</a>
            ) : (
              <Link to="/contact">Contact</Link>
            )}
          </div>
          <div className="newsletter">
            <p className="footer-label">Stay close</p>
            <p>Occasional notes from our home.</p>
            <form className="newsletter-form" onSubmit={handleNewsletter}>
              <label className="sr-only" htmlFor="footer-email">
                Email address
              </label>
              <input
                id="footer-email"
                name="email"
                type="email"
                placeholder="Email address"
                autoComplete="email"
                required
              />
              <button type="submit" aria-label="Subscribe to newsletter">
                ↗
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="container footer-bottom">
        <span className="mono">© 2024 Napak Living</span>
        <span className="mono">Jakarta / Indonesia</span>
        <a className="mono" href="#main-content">
          Back to top ↑
        </a>
      </div>
    </footer>
  )
}