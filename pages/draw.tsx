import Link from 'next/link';
import Layout from 'src/layout/Layout';

const scripts = (
  <>
    <script
      src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"
      defer
    ></script>
    <script
      src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"
      integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN"
      crossOrigin="anonymous"
      defer
    ></script>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
      integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l"
      crossOrigin="anonymous"
    />
    <script src="/js/draw.js" defer />
  </>
);

const Draw = () => {
  return (
    <>
      <Layout scripts={scripts}>
        <div className="bgb get" id="lottery">
          <div className="bg_filter"></div>

          <div className="start">
            <div>
              <img src="/images/Apple_apple_iphone_14.jpg" alt="" />
            </div>
            <p style={{ color: 'darkred' }}>恭喜 安律信息技術 - Max</p>
            <p>頭獎-iPhone 14 一支</p>
            <hr style={{ width: '100%' }} />
            <Link href={'/'} className="mt-3">
              <h3>繼續抽下一獎!</h3>
            </Link>
            <p className="mt-0">
              <small>活動保留最後變更權利! 重抽請點這 </small>
              <a href="#">
                <i className="material-icons-outlined">refresh</i>
              </a>
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Draw;
