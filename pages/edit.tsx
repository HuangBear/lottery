import type { NextPage } from "next";
import Head from "next/head";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import StrawEdit from "src/components/StrawEdit";
import AwardEdit from "src/components/AwardEdit";
import { Button, Form, Stack } from "react-bootstrap";
import ResetConfirmModal from "src/components/ResetConfirmModal";
import { useEffect, useState } from "react";
import LotteryNavbar from "src/components/Navbar";
import Link from "next/link";
import { useLotterytStore } from "src/stores/lotterytStore";

const Edit: NextPage = () => {
  const title = useLotterytStore((store) => store.title);
  const setTitle = useLotterytStore((store) => store.setTitle);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [clientSide, setClientSide] = useState<boolean>(false);
  const [tempTitle, setTempTitle] = useState<string | undefined>(title);

  useEffect(() => {
    setClientSide(true);
  }, []);

  const handleInputChange = (e: any) => {
    setTempTitle(e.target.value);
  };

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
              <div className="my-2">
                <h2>修改活動標題</h2>
                <div className="d-flex gap-2 mb-3 w-80">
                  <Form.Control
                    placeholder="event title"
                    defaultValue={tempTitle}
                    onChange={handleInputChange}
                  />
                  <Button
                    variant="danger"
                    className="col-2 mx-auto"
                    onClick={() => setTitle(tempTitle)}
                  >
                    修改
                  </Button>
                </div>
                <h2>使用說明</h2>
                <p />
                <ol>
                  <li>從上方的 tab 選擇 Namelist 或是 Award</li>
                  <li>
                    根據各頁說明，上傳指定格式檔案（可下載 demo data
                    並修改），或線上編輯
                  </li>
                  <li>確認資料無誤，</li>
                  <li>
                    回到 <Link href="/">首頁</Link> 點擊 &quot;開始抽獎&quot;
                  </li>
                </ol>
              </div>
              <div>
                <h2>注意事項</h2>
                <p />
                <li>namelist or award 資料任一有缺漏時，無法開始抽獎</li>
                <li>
                  下方 RESET 按鈕可清除所有資料（含 namelist, awards 及
                  <b>已抽出獎項名單</b>）
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
        </Tabs>
      </main>
    </div>
  );
};

export default Edit;
