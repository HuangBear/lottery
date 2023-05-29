import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import StrawEdit from 'src/components/strawEdit';
import AwardEdit from 'src/components/awardEdit';

const Edit: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Edit Your Lottery Config</title>
        <meta name="description" content="Edit Your Lottery Config" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>
          Back to <Link href="/">Home!</Link>
        </h1>

        <Tabs
          defaultActiveKey="namelist"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="namelist" title="Namelist">
            <StrawEdit />
          </Tab>
          <Tab eventKey="award" title="Award">
            <AwardEdit />
          </Tab>
        </Tabs>
      </main>
    </div>
  );
};

export default Edit;
