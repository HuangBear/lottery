import type { NextPage } from 'next';
import Head from 'next/head';
import { Button, Stack } from 'react-bootstrap';
import { useLotterytStore } from 'src/stores/lotterytStore';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useRouter } from 'next/router';
import LotteryNavbar from 'src/components/Navbar';
import Confetti from 'react-confetti';
import { useElementSize } from 'usehooks-ts';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import PartialRedrawModal from 'src/components/PartialRedrawModal';
import UndoModal from 'src/components/UndoModal';
import { RingLoader } from 'react-spinners';

const Home: NextPage = () => {
  const straws = useLotterytStore((state) => state.straws);
  const awards = useLotterytStore((state) => state.awards);
  const winners = useLotterytStore((state) => state.winners);

  const awardsToDraw = useLotterytStore((state) => state.awardsToDraw);
  const currentAward = awardsToDraw && awardsToDraw[0];

  const lock = useLotterytStore((state) => state.lock);
  const displaying = useLotterytStore((state) => state.displaying);

  const start = useLotterytStore((state) => state.start);
  const draw = useLotterytStore((state) => state.draw);
  const nextAward = useLotterytStore((state) => state.nextAward);

  const [clientSide, setClientSide] = useState<boolean>(false);
  const [drawing, setDrawing] = useState<boolean>(false);
  const [redrawing, setRedrawing] = useState<boolean>(false);
  const [toRedraw, setToRedraw] = useState<number[]>([]);

  const [undoModal, setUndoModal] = useState<boolean>(false);
  const [redrawModal, setRedrawModal] = useState<boolean>(false);

  const [confettiRef, { width: confettiWidth, height: confettiHeight }] =
    useElementSize();

  useEffect(() => {
    setClientSide(true);
  }, []);

  const lackingData = straws.length === 0 || awards.length === 0;

  const route = useRouter();

  const handleNextAward = () => {
    nextAward();
  };

  const handleSetRedraw = (idx: number) => {
    setToRedraw((prev) => {
      if (prev.includes(idx)) {
        return prev.filter((val) => val !== idx);
      } else {
        return [...prev, idx];
      }
    });
  };
  const handleRedrawSwitch = (open: boolean) => {
    if (!open) {
      setToRedraw([]);
    }
    setRedrawing(open);
  };

  const handleDrawing = () => {
    setDrawing(true);
    setTimeout(() => {
      setDrawing(false);
      draw();
    }, 5000);
  };
  return (
    <div style={{ minHeight: '100vh' }} ref={confettiRef}>
      <Head>
        <title>Lottery</title>
        <meta
          name="description"
          content="Simple customizable lottery web page"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {displaying && <Confetti width={confettiWidth} height={confettiHeight} />}
      <LotteryNavbar />

      {winners[0]?.award && (
        <>
          <PartialRedrawModal
            show={redrawModal}
            setShow={setRedrawModal}
            straws={winners[0].straws.filter((_val, idx) =>
              toRedraw.includes(idx)
            )}
            redrawIdx={toRedraw}
            awardName={winners[0].award.name}
            callback={() => handleRedrawSwitch(false)}
            setDrawing={setDrawing}
          />
          <UndoModal
            show={undoModal}
            setShow={setUndoModal}
            straws={winners[0].straws}
            awardName={winners[0].award.name}
          />
        </>
      )}

      <main className="my-4 px-4 col-10 mx-auto">
        <Stack gap={3} className="col-12  mx-auto">
          {clientSide && (
            <>
              {!lock && (
                <OverlayTrigger
                  placement={'bottom'}
                  overlay={
                    <Tooltip>
                      {lackingData
                        ? '尚未上傳抽獎人或獎項資訊，請至編輯頁編輯'
                        : '開始抽獎後，即無法變更抽獎人名單及獎項'}
                    </Tooltip>
                  }
                >
                  <Button
                    className="col-6 mx-auto"
                    onClick={() =>
                      lackingData ? route.push('/edit') : start()
                    }
                  >
                    {lackingData ? 'Setting' : "LET'S GO!"}
                  </Button>
                </OverlayTrigger>
              )}
              {displaying && awardsToDraw && winners.length > 0 && (
                <div>
                  <Row xs={1} sm={1} md={2} lg={3} className="g-4 mx-auto">
                    {winners[0].straws.map((val, idx) => (
                      <Col key={idx} className="mx-auto">
                        <Card className="text-center ">
                          <Card.Img
                            style={{ aspectRatio: '1/1', objectFit: 'contain' }}
                            variant="top"
                            src={winners[0].award.pic || '/gift.png'}
                            alt="current award picture"
                          />
                          <Card.Body>
                            <Card.Title style={{ fontWeight: 800 }}>
                              {winners[0].award.name}
                            </Card.Title>
                            <Card.Text className="text-center">
                              {val.group}
                              <br />
                              {val.no} - {val.name}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                  <Row>
                    <Col>
                      <Button
                        className="my-4"
                        variant="outline-secondary"
                        onClick={() => setUndoModal(true)}
                      >
                        回到抽取此獎項前狀態
                      </Button>
                      {redrawing ? (
                        <>
                          <Button
                            className="my-lg-4 mx-md-4"
                            variant="outline-secondary"
                            onClick={() => handleRedrawSwitch(false)}
                          >
                            取消
                          </Button>
                          <Button
                            className="my-lg-4 mx-4 mx-md-0"
                            variant="outline-danger"
                            onClick={() => setRedrawModal(true)}
                            disabled={toRedraw.length === 0}
                          >
                            重抽
                          </Button>
                        </>
                      ) : (
                        <Button
                          className="my-lg-4 mx-md-4"
                          variant="outline-danger"
                          onClick={() => handleRedrawSwitch(true)}
                        >
                          重抽部分得獎人
                        </Button>
                      )}
                    </Col>
                    {awardsToDraw?.length > 1 && (
                      <Col style={{ textAlign: 'right' }}>
                        <Button
                          className="my-4"
                          variant="secondary"
                          onClick={handleNextAward}
                        >
                          下個獎項
                        </Button>
                      </Col>
                    )}
                  </Row>
                </div>
              )}
              {!displaying && currentAward && (
                <Card
                  className="text-center mx-auto col-10 col-md-6 col-lg-4"
                  style={{ position: 'relative' }}
                >
                  <div>
                    <Card.Img
                      variant="top"
                      src={currentAward.pic || '/gift.png'}
                      alt="current award picture"
                      style={{ aspectRatio: '1/1', objectFit: 'contain' }}
                    />
                    {/* {true && ( */}
                    {drawing && (
                      <>
                        <CenterizedRingLoader
                          speedMultiplier={1.3}
                          size={180}
                        />
                        <CenterizedRingLoader speedMultiplier={1} size={200} />
                      </>
                    )}
                  </div>
                  <Card.Body>
                    <Card.Title style={{ fontWeight: 800 }}>
                      {currentAward.name}
                    </Card.Title>
                    <Card.Text>{currentAward.description}</Card.Text>
                    <Card.Text>
                      此獎項預計抽出 <b>{currentAward.quota}</b> 位幸運得主
                    </Card.Text>
                    <Button
                      variant="outline-danger"
                      onClick={() => handleDrawing()}
                      disabled={drawing}
                    >
                      得獎的是！
                    </Button>
                  </Card.Body>
                </Card>
              )}
              <div>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>獎項</th>
                      <th>得獎者</th>
                    </tr>
                  </thead>
                  <tbody>
                    {winners.map((val, idx) => (
                      <tr key={idx}>
                        <td>{val.award.name}</td>
                        <td>
                          {val.straws.map((st, stIdx) => {
                            return idx === 0 && redrawing ? (
                              <Form.Check
                                key={stIdx}
                                type="checkbox"
                                id={`${st.no}-${st.name}`}
                                label={`${st.no}-${st.name}`}
                                value={stIdx}
                                onChange={() => handleSetRedraw(stIdx)}
                              />
                            ) : (
                              <span className="mr-2" key={stIdx}>
                                {st.no}-{st.name}&nbsp;&nbsp;
                              </span>
                            );
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </>
          )}
        </Stack>
      </main>
    </div>
  );
};

interface ILoader {
  speedMultiplier?: number;
  size?: number;
  color?: string;
}

const CenterizedRingLoader = ({
  speedMultiplier = 1,
  size = 150,
  color = '#dc3545',
}: ILoader) => {
  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <RingLoader
        size={size}
        aria-label="Loading Spinner"
        color={color}
        speedMultiplier={speedMultiplier}
      />
    </div>
  );
};

export default Home;
