import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { nav } from "@/data/site";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/logo";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-[4.5rem] sm:px-6">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Logo />
          <span className="font-display text-xl tracking-wide text-fg">HYBRID</span>
        </Link>

        <nav className="hidden items-center gap-4 xl:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="whitespace-nowrap text-sm text-muted transition-colors hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 xl:flex">
          <Link to="/portal" className="whitespace-nowrap text-sm text-muted hover:text-fg">
            Player Portal
          </Link>
          <Button asChild>
            <Link to="/book">Book a camp</Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-sm text-fg xl:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border bg-bg px-4 py-4 xl:hidden">
          <nav className="flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="rounded-sm px-3 py-3 text-fg hover:bg-surface"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/portal"
              className="rounded-sm px-3 py-3 text-fg hover:bg-surface"
              onClick={() => setOpen(false)}
            >
              Player Portal
            </Link>
            <Button asChild className="mt-3 w-full">
              <Link to="/book" onClick={() => setOpen(false)}>
                Book a camp
              </Link>
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
