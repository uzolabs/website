import { Arrow, Art, external, href, Mark } from "@/components/kit/bits"
import { footerColumns, navActions, site } from "@/lib/site"

/** The closing glass panel, then the links, the name across the page and the legal line. */
export function KitFooter() {
  return (
    <>
      <section className="closing" aria-labelledby="close-h">
        <div className="wrap">
          <div className="cta glass">
            <div className="cta__text">
              <h2 id="close-h">
                Deploy your first contract <span className="grad">on BOT Chain</span>
              </h2>
              <p className="lead">Practice on testnet with free tBOT. On mainnet a deploy costs gas plus a 0.1 BOT fee.</p>
              <div className="row">
                <a className="btn btn--primary" href={navActions.primary.href} {...external(navActions.primary.href)}>
                  {navActions.primary.label}
                  <Arrow />
                </a>
                <a className="btn btn--glass" href={href("/quickstart")}>
                  Read the quickstart
                </a>
              </div>
            </div>
            <div className="cta__art">
              <Art name="deploy" sizes="340px" />
            </div>
          </div>
        </div>
      </section>
      <footer className="footer" id="contact">
        <div className="wrap">
          <div className="footer__grid">
            <div className="footer__brand">
              <a className="logo" href={href("/")}>
                <Mark />
                {site.name}
              </a>
              <p>SDKs, templates and a browser deploy tool for developers on BOT Chain. Built in Lagos.</p>
            </div>
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3>{column.title}</h3>
                <ul>
                  {column.links
                    .filter((link) => link.href.trim() !== "")
                    .map((link) => (
                      <li key={link.label}>
                        <a href={href(link.href)} {...external(link.href)}>
                          {link.label}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="footer__word" aria-hidden="true">
            {site.name}
          </p>
          <p className="footer__legal">
            &copy; {new Date().getFullYear()} {site.name}. {site.name} is an independent project and is not affiliated with or
            endorsed by BOT Chain.
          </p>
        </div>
      </footer>
    </>
  )
}
