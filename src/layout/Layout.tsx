import Link from "next/link";
import { IWinner, useLotterytStore } from "src/stores/lotterytStore";
import { shallow } from "zustand/shallow";

interface IProps {
  children: React.ReactNode;
}

const aboutUs =
  "SECURE VECTORS: Your trusted partner for compliance services. With 70% market share in Taiwan's PCI DSS certification, our experienced team delivers customise solutions to address your compliance needs and challenges.";

const Layout = (props: IProps) => {
  const winners = useLotterytStore((state) => state.winners, shallow);
  const title = useLotterytStore((state) => state.title);

  const groupedWinners = winners.reduce<IWinner[]>((cumulative, current) => {
    let result = [...cumulative];

    if (cumulative.some((val) => val.award.name === current.award.name)) {
      result = result.map((val) => {
        if (val.award.name === current.award.name) {
          return { ...val, straws: [...val.straws, ...current.straws] };
        } else {
          return val;
        }
      });
    } else {
      result = [...result, { ...current }];
    }
    return result;
  }, []);

  return (
    <>
      <header>
        <div id="navbar">
          <nav>
            <div className="logo">
              <Link href="/" id="home">
                <img src="/svg/logo.svg" alt="SecuCollab Logo" />
                <b>Secure Vectors </b>
              </Link>
            </div>
            <div className="titlebar">
              {title || "Fintech Innovation - Security & Compliance Automation"}
            </div>
            <div className="call_me">
              <ul>
                <li>
                  <Link href="/edit">
                    <i className="material-icons-outlined">app_registration</i>{" "}
                    Setup
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        {props.children}
      </header>

      <div className="main">
        {/* <!-- no1 part --> */}
        <section>
          <div className="sbg3">
            <div className="bg_filter"></div>
            <h3>Winner List</h3>

            <div className="key_block">
              {groupedWinners.map((val, idx) => (
                <div key={idx} className="key">
                  <h1>{val.award.name}</h1>
                  <h3>{val.award.description}</h3>
                  <ul>
                    {val.straws.map((st, stIdx) => (
                      <li key={stIdx}>
                        {st.group} {st.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <footer>
        <div>
          <div className="logo">
            <img src="/svg/logo_s1.svg" alt="SECURE VECTORS Logo" />
            <b>SECURE VECTORS</b>
          </div>
          <div className="about">
            <p>
              <b>About Us</b>
            </p>
            <p>{aboutUs}</p>
          </div>
          <div className="follow">
            <p>
              <a
                href="https://www.facebook.com/%E5%8D%94%E4%BD%9C%E5%AE%89%E5%85%A8%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8-SecuCollab-Inc-100573305573616/"
                target="_blink"
              >
                <i className="fab fa-facebook-square"></i>
              </a>
              <a
                href="https://www.linkedin.com/company/securevectors"
                target="_blink"
              >
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="https://twitter.com/securevectors" target="_blink">
                <i className="fab fa-twitter-square"></i>
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Layout;
