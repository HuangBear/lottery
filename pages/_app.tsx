import "../styles/globals.css";
import "/css/stypes.css";
import "bootstrap/dist/css/bootstrap.min.css";
import type { AppProps } from "next/app";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Secure Vectors Lucky Draw</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
