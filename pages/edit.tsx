import type { NextPage } from 'next';
import Head from 'next/head';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import StrawEdit from 'src/components/StrawEdit';
import AwardEdit from 'src/components/AwardEdit';
import { Button, Stack } from 'react-bootstrap';
import ResetConfirmModal from 'src/components/ResetConfirmModal';
import { useEffect, useState } from 'react';
import LotteryNavbar from 'src/components/Navbar';
import Link from 'next/link';
import QuickStart from 'src/components/QuickStart';

const Edit: NextPage = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [clientSide, setClientSide] = useState<boolean>(false);

  useEffect(() => {
    setClientSide(true);
  }, []);

  return (
    <div>
      <Head>
        <title>Edit Your Lottery Config</title>
        <meta name="description" content="Edit Your Lottery Config" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ResetConfirmModal show={modalOpen} setShow={setModalOpen} />

      <LotteryNavbar />

      <main className="my-4 col-10 mx-auto">
        <Tabs
          defaultActiveKey="instruction"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="instruction" title="Instruction">
            <Stack gap={3} className="col-md-10 col-12 mx-auto">
              <div>
                <h2>使用說明</h2>
                <p />
                <ol>
                  <li>從上方的 tab 選擇 Namelist 或是 Award</li>
                  <li>
                    根據各頁說明，上傳指定格式檔案（可下載 demo data
                    並修改），或線上編輯
                  </li>
                  <li>
                    確認資料無誤，<b>開始抽獎後即無法變更資料</b>
                  </li>
                  <li>
                    回到 <Link href="/">首頁</Link> 點擊 &quot;LET&apos;S
                    GO!&quot; 開始抽獎
                  </li>
                </ol>
                <li>
                  或直接至 Quick Start Tab 設定抽獎人數與獎項數量後立即開始
                </li>
              </div>
              <div>
                <h2>注意事項</h2>
                <p />
                <li>namelist or award 資料任一有缺漏時，無法開始抽獎</li>
                <li>
                  開始抽獎後，namelist & award 資料皆鎖定不能異動，僅有底下的
                  reset 按鈕才能重置資料並解鎖
                </li>
              </div>

              <Button
                variant="danger"
                className="col-12 col-md-6 mx-auto"
                onClick={() => setModalOpen(true)}
              >
                RESET
              </Button>
            </Stack>
          </Tab>
          <Tab eventKey="namelist" title="Namelist">
            {clientSide && <StrawEdit />}
          </Tab>
          <Tab eventKey="award" title="Award">
            {clientSide && <AwardEdit />}
          </Tab>
          <Tab eventKey="quickStart" title="Quick Start">
            {clientSide && <QuickStart />}
          </Tab>
        </Tabs>
      </main>
    </div>
  );
};

export default Edit;
