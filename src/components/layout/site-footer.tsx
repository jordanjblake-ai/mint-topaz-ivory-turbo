import { Link } from "@tanstack/react-router";
import { CookieSettingsButton } from "@/components/site/cookie-banner";
import { Instagram } from "lucide-react";
import { company } from "@/data/legal";
import { nav, site } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-3xl text-fg">HYBRID</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            {site.tagline}. Sport, travel, and community in one week.
          </p>
          <p className="mt-4 text-xs text-muted">
            {company.name}
            <br />
            Company no. {company.number}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">Explore</p>
          <ul className="mt-4 space-y-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link to={item.href} className="inline-flex min-h-11 items-center text-sm text-fg hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/portal" className="inline-flex min-h-11 items-center text-sm text-fg hover:text-accent">
                Player Portal
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">Contact</p>
          <a href={`mailto:${site.email}`} className="mt-4 block text-sm text-fg hover:text-accent">
            {site.email}
          </a>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm text-fg hover:text-accent"
          >
            <Instagram className="size-4" />
            {site.instagramHandle}
          </a>
          <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-muted">Legal</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link to="/terms" className="inline-flex min-h-11 items-center text-sm text-fg hover:text-accent">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="inline-flex min-h-11 items-center text-sm text-fg hover:text-accent">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/cookies" className="inline-flex min-h-11 items-center text-sm text-fg hover:text-accent">
                Cookie Policy
              </Link>
            </li>
            <li>
              <CookieSettingsButton className="inline-flex min-h-11 items-center text-sm text-fg hover:text-accent" />
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/80 py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} {company.name}. {site.positioning}.
        <span className="mx-2 text-border">·</span>
        <Link to="/ops" className="hover:text-fg">
          Staff
        </Link>
        <span className="mx-2 text-border">·</span>
        <Link to="/portal" className="hover:text-fg">
          Player Portal
        </Link>
        <span className="mx-2 text-border">·</span>
        <Link to="/coaches-corner" className="hover:text-fg">
          Coaches Corner
        </Link>
      </div>
    </footer>
  );
}
