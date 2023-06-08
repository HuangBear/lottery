interface IProps {
  children: React.ReactNode;
  scripts: React.ReactNode;
}

const Layout = (props: IProps) => {
  return (
    <>
      <header>
        <div id="navbar">
          <nav>
            <div className="logo">
              <a href="#" id="home">
                <img src="/svg/logo.svg" alt="SecuCollab Logo" />
                <b>Secure Vectors </b>
              </a>
            </div>
            <div className="titlebar">Lottery拿大獎，人人有機會</div>
            <div className="call_me">
              <ul>
                <li>
                  <a href="#">
                    <i className="material-icons-outlined">app_registration</i>{' '}
                    Setup
                  </a>
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
              <div className="key">
                <h1>頭獎</h1>
                <h3>iPhone 14 一支</h3>
                <ul>
                  <li>新XXX公司 林O亮</li>
                </ul>
              </div>
              <div className="key">
                <h1>幸運獎</h1>
                <h3>活動卷500元 一張</h3>
                <ul>
                  <li>新XXX公司 林O亮</li>
                </ul>
              </div>
              <div className="key">
                <h1>幸運獎</h1>
                <h3>活動卷500元 一張</h3>
                <ul>
                  <li>新XXX公司 林O亮</li>
                </ul>
              </div>
              <div className="key">
                <h1>幸運獎</h1>
                <h3>活動卷500元 一張</h3>
                <ul>
                  <li>新XXX公司 林O亮</li>
                </ul>
              </div>
              <div className="key">
                <h1>幸運獎</h1>
                <h3>活動卷500元 一張</h3>
                <ul>
                  <li>新XXX公司 林O亮</li>
                </ul>
              </div>
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
      {props.scripts}
    </>
  );
};

export default Layout;
