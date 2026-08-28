import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { nav } from "@/data/site";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/logo";
import { cn } from "@/lib/utils";

type NavItem = (typeof nav)[number];
type NavChild = Extract<NavItem, { children: readonly unknown[] }>["children"][number];

function itemChildren(item: NavItem): NavChild[] {
  return "children" in item ? [...item.children] : [];
}

function HeaderLink({
  href,
  search,
  className,
  onClick,
  children,
}: {
  href: string;
  search?: { interest: string };
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  if (href === "/contact") {
    return (
      <Link to="/contact" search={search} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  if (href === "/portal") {
    return (
      <Link to="/portal" className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  if (href === "/coaches") {
    return (
      <Link to="/coaches" className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  if (href === "/coaching") {
    return (
      <Link to="/coaching" className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  if (href === "/story-time") {
    return (
      <Link to="/story-time" className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <Link to={href as "/"} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

function DesktopMenu({ item }: { item: NavItem }) {
  const children = itemChildren(item);
  if (!children.length) {
    return (
      <Link to={item.href} className="text-sm text-muted transition-colors hover:text-fg">
        {item.label}
      </Link>
    );
  }

  return (
    <div className="group relative">
      <Link
        to={item.href}
        className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-fg"
        aria-haspopup="true"
      >
        {item.label}
        <ChevronDown className="size-3.5 text-accent transition-transform duration-150 group-hover:rotate-180 group-focus-within:rotate-180" aria-hidden />
      </Link>
      <div className="absolute top-full left-0 z-50 hidden min-w-72 pt-3 group-hover:block group-focus-within:block">
        <div className="rounded-md border border-border bg-bg/95 p-2 shadow-soft backdrop-blur-md">
          <p className="px-3 pt-2 pb-1 text-[10px] font-semibold tracking-widest text-muted uppercase">
            {item.label}
          </p>
          {children.map((child: NavChild) => (
            <HeaderLink
              key={child.href + child.label}
              href={child.href}
              search={"search" in child ? child.search : undefined}
              className="block rounded-sm px-3 py-2.5 hover:bg-surface"
            >
              <span className="block text-sm text-fg">{child.label}</span>
              {"note" in child && child.note ? (
                <span className="mt-0.5 block text-xs text-muted">{child.note}</span>
              ) : null}
            </HeaderLink>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-40 overflow-visible border-b border-border/70 bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-[4.5rem] sm:px-6">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Logo />
          <span className="font-display text-xl tracking-wide text-fg">HYBRID</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <DesktopMenu key={item.href} item={item} />
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
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
            {nav.map((item) => {
              const children = itemChildren(item);
              const expanded = openSection === item.href;
              return (
                <div key={item.href}>
                  {children.length ? (
                    <div className="flex items-center">
                      <Link
                        to={item.href}
                        className="min-h-11 flex-1 rounded-sm px-3 py-3 text-fg hover:bg-surface"
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        className="inline-flex size-11 items-center justify-center text-muted"
                        aria-label={`${expanded ? "Hide" : "Show"} ${item.label} pages`}
                        aria-expanded={expanded}
                        onClick={() => setOpenSection(expanded ? null : item.href)}
                      >
                        <ChevronDown className={cn("size-4 transition-transform", expanded && "rotate-180")} />
                      </button>
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className="rounded-sm px-3 py-3 text-fg hover:bg-surface"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                  {expanded
                    ? children.map((child: NavChild) => (
                        <HeaderLink
                          key={child.href + child.label}
                          href={child.href}
                          search={"search" in child ? child.search : undefined}
                          className="block rounded-sm py-3 pr-3 pl-6 text-sm text-muted hover:bg-surface hover:text-fg"
                          onClick={() => setOpen(false)}
                        >
                          {child.label}
                        </HeaderLink>
                      ))
                    : null}
                </div>
              );
            })}
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
