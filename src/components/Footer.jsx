import amazonLogo from '../assets/images/amazon_logo.png'
import usFlag from '../assets/images/uSA.png'

function FooterColumn({ title, links }) {
  return (
    <div className="amazon-home-footer__column">
      <h3>{title}</h3>
      <ul>
        {links.map((link) => (
          <li key={link}>
            <a href="#top">{link}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer({ columns, services }) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="amazon-home-footer">
      <a className="amazon-home-footer__back-to-top" href="#top">
        Back to top
      </a>

      <div className="amazon-home-footer__main">
        <div className="amazon-home-footer__grid">
          {columns.map((column) => (
            <FooterColumn key={column.title} title={column.title} links={column.links} />
          ))}
        </div>
      </div>

      <div className="amazon-home-footer__locale-bar">
        <div className="amazon-home-footer__locale-shell">
          <img className="amazon-home-footer__logo" src={amazonLogo} alt="Amazon" />

          <div className="amazon-home-footer__locale-actions">
            <button type="button">English</button>
            <button type="button">USD - U.S. Dollar</button>
            <button type="button">
              <img src={usFlag} alt="" />
              United States
            </button>
          </div>
        </div>
      </div>

      <div className="amazon-home-footer__services">
        <div className="amazon-home-footer__services-grid">
          {services.map((service) => (
            <div key={service.title} className="amazon-home-footer__service-card">
              <a href="#top">{service.title}</a>
              <span>{service.description}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="amazon-home-footer__legal">
        <div className="amazon-home-footer__legal-links">
          <a href="#top">Conditions of Use</a>
          <a href="#top">Privacy Notice</a>
          <a href="#top">Interest-Based Ads</a>
        </div>
        <p>© 1996-{currentYear}, Amazon.com, Inc. or its affiliates</p>
      </div>
    </footer>
  )
}
