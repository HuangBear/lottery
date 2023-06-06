import type { NextPage } from 'next';
import Head from 'next/head';
import { Button, Stack } from 'react-bootstrap';
import { useLotterytStore } from 'src/stores/lotterytStore';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useRouter } from 'next/router';
import LotteryNavbar from 'src/components/Navbar';
import Confetti from 'react-confetti';
import { useElementSize } from 'usehooks-ts';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const Home: NextPage = () => {
  const straws = useLotterytStore((state) => state.straws);
  const awards = useLotterytStore((state) => state.awards);
  const winners = useLotterytStore((state) => state.winners);

  const awardsToDraw = useLotterytStore((state) => state.awardsToDraw);
  const currentAward = awardsToDraw && awardsToDraw[0];

  const lock = useLotterytStore((state) => state.lock);

  const start = useLotterytStore((state) => state.start);
  const draw = useLotterytStore((state) => state.draw);
  const nextAward = useLotterytStore((state) => state.nextAward);

  const [drawing, setDrawing] = useState<boolean>(false);
  const [displaying, setDisplaying] = useState<boolean>(false);
  const [clientSide, setClientSide] = useState<boolean>(false);

  const [confettiRef, { width: confettiWidth, height: confettiHeight }] =
    useElementSize();

  useEffect(() => {
    setClientSide(true);
  }, []);

  useEffect(() => {
    if (awardsToDraw?.length == 0) {
      setDisplaying(true);
    }
  }, [awardsToDraw]);
  const lackingData = straws.length === 0 || awards.length === 0;

  const route = useRouter();

  const handleNextAward = () => {
    nextAward();
    setDisplaying(false);
  };

  const handleDrawing = () => {
    setDrawing(true);
    setTimeout(() => {
      setDisplaying(true);
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
                    onClick={() =>
                      lackingData ? route.push('/edit') : start()
                    }
                  >
                    LET&apos;S GO!
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
                  {awardsToDraw?.length > 1 && (
                    <Button
                      className="my-4"
                      variant="secondary"
                      onClick={handleNextAward}
                    >
                      Continue!
                    </Button>
                  )}
                </div>
              )}
              {!displaying && currentAward && (
                <Card className="text-center mx-auto col-10 col-md-6 col-lg-4">
                  <Card.Img
                    variant="top"
                    src={currentAward.pic || '/gift.png'}
                    alt="current award picture"
                    style={{ aspectRatio: '1/1', objectFit: 'contain' }}
                  />
                  <Card.Body>
                    <Card.Title style={{ fontWeight: 800 }}>
                      {currentAward.name}
                    </Card.Title>
                    <Card.Text>{currentAward.description}</Card.Text>
                    <Card.Text>
                      此獎項預計抽出 {currentAward.quota} 位幸運得主
                    </Card.Text>
                    {drawing ? (
                      <Spinner animation="grow" variant="danger" />
                    ) : (
                      <Button variant="primary" onClick={() => handleDrawing()}>
                        WINNER GOES TO!
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              )}
              <div>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Award Name</th>
                      <th>Winner(s)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {winners.map((val, idx) => (
                      <tr key={idx}>
                        <td>{val.award.name}</td>
                        <td>
                          {val.straws
                            .map((st) => st.no + '-' + st.name)
                            .join(', ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>{' '}
            </>
          )}
        </Stack>
      </main>
    </div>
  );
};

export default Home;
