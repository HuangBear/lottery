import Link from "next/link";
import { IWinner, useLotterytStore } from "src/stores/lotterytStore";
import { shallow } from "zustand/shallow";

interface IProps {
  children: React.ReactNode;
}

const Layout = (props: IProps) => {
  const winners = useLotterytStore((state) => state.winners, shallow);

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
              Fintech Innovation - Security & Compliance Automation
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
            <h3>得獎名單</h3>

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
              <b>關於我們</b>
            </p>
            <p>
              SECURE VECTORS 安律信息技術團隊研發合規服務。擁有七成台灣 PCI DSS
              合規認證市場及服務經驗，安律團隊很清楚了解每家企業的不同合規需求，技術難點及合規管理遭遇的問題，因此
              SECURE VECTORS 能迅速提供顧客最佳的合規管理方案及諮詢服務。
            </p>
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
