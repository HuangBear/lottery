import Link from 'next/link';
import Layout from 'src/layout/Layout';

const scripts = (
  <>
    <script
      src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"
      defer
    ></script>
    <script
      defer
      src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"
      integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN"
      crossOrigin="anonymous"
    ></script>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
      integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l"
      crossOrigin="anonymous"
    />
    <script defer src="/js/index.js" />
  </>
);

const Index = () => {
  return (
    <>
      <Layout scripts={scripts}>
        <div className="bgb">
          <div className="start">
            <div>
              <img src="/images/Apple_apple_iphone_14.jpg" alt="" />
            </div>
            <p>頭獎-iPhone 14 一支</p>
            <Link href={'/draw'}>
              {/* <a href="page02.html"> */}
              <h1>抽獎 GO !</h1>
              {/* </a> */}
            </Link>
            <p>
              <small>活動保留最後變更權利!</small>
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Index;
