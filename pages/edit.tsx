import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import StrawEdit from 'src/components/strawEdit';
import AwardEdit from 'src/components/awardEdit';
import { Button, Stack } from 'react-bootstrap';
import { useLotterytStore } from 'src/stores/lotterytStore';

const Edit: NextPage = () => {
  const lock = useLotterytStore((state) => state.lock);
  const reset = useLotterytStore((state) => state.reset);

  return (
    <div className={styles.container}>
      <Head>
        <title>Edit Your Lottery Config</title>
        <meta name="description" content="Edit Your Lottery Config" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title + ' my-4'}>
          Back to <Link href="/">Home!</Link>
        </h1>

        <Tabs
          defaultActiveKey="instruction"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="instruction" title="Instruction">
            <Stack gap={3} className="col-md-5 mx-auto">
              <div>
                <h2>使用說明</h2>
                <p />
                <ol>
                  <li>從上方的 tab 選擇 Namelist 或是 Award</li>
                  <li>
                    根據各頁說明，上傳指定格式檔案，或下載 demo data 並修改
                  </li>
                  <li>確認資料無誤</li>
                  <li>回到首頁點擊 &quot;LET&apos;S GO!&quot; 開始抽獎</li>
                </ol>
              </div>
              <div>
                <h2>注意事項</h2>
                <p />
                <li>namelist or award 資料任一有缺漏時，無法開始抽獎</li>
                <li>
                  開始抽獎後，namelist & award 資料皆鎖定不能異動，唯有全部
                  reset 才能解鎖
                </li>
                <li>為避免誤觸，開始抽獎後 reset 按鈕才會於此頁顯示</li>
              </div>
              {lock && (
                <Button variant="danger" onClick={() => reset()}>
                  RESET
                </Button>
              )}
            </Stack>
          </Tab>
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
