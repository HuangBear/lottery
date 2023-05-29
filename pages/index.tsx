import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import { Button, Stack } from 'react-bootstrap';
import { useLotterytStore } from 'src/stores/lotterytStore';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import CardGroup from 'react-bootstrap/CardGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const straws = useLotterytStore((state) => state.straws);
  const awards = useLotterytStore((state) => state.awards);
  const winners = useLotterytStore((state) => state.winners);

  const awardsToDraw = useLotterytStore((state) => state.awardsToDraw);
  const currentAward = awardsToDraw && awardsToDraw[0];

  const lock = useLotterytStore((state) => state.lock);

  const start = useLotterytStore((state) => state.start);
  const draw = useLotterytStore((state) => state.draw);

  const [drawing, setDrawing] = useState<boolean>(false);
  const [displaying, setDisplaying] = useState<boolean>(false);

  const lackingData = straws.length === 0 || awards.length === 0;

  const route = useRouter();

  const handleDrawing = () => {
    setDrawing(true);
    setTimeout(() => {
      setDrawing(false);
      draw();
      setDisplaying(true);
    }, 5000);
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Lottery</title>
        <meta
          name="description"
          content="Simple customizable lottery web page"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title + ' my-4'}>
          Go to <Link href="/edit">Edit!</Link>
        </h1>
        <Stack gap={3} className="col-md-5 mx-auto">
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
                onClick={() => (lackingData ? route.push('/edit') : start())}
                // disabled={straws.length === 0 || awards.length === 0}
              >
                LET&apos;S GO!
              </Button>
            </OverlayTrigger>
          )}
          {displaying && awardsToDraw && winners.length > 0 && (
            <div>
              <CardGroup>
                {winners[0].straws.map((val) => (
                  <Card className="text-center" key={val.no}>
                    <Card.Img variant="top" src="/gift.png" />
                    <Card.Body>
                      <Card.Title>{winners[0].awardName}</Card.Title>
                      <Card.Text>
                        {val.group}&nbsp;{val.name}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                ))}
              </CardGroup>
              {awardsToDraw?.length > 0 && (
                <Button
                  className="my-4"
                  variant="secondary"
                  onClick={() => setDisplaying(false)}
                >
                  Continue!
                </Button>
              )}
            </div>
          )}

          {!displaying && currentAward && (
            <Card style={{ width: '24rem' }} className="text-center mx-auto">
              <Card.Img variant="top" src="/gift.png" />
              <Card.Body>
                <Card.Title>{currentAward.name}</Card.Title>
                <Card.Text>{currentAward.description}</Card.Text>
                <Card.Text>
                  This award will have {currentAward.quota} winner(s)
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
                {winners.map((val) => (
                  <tr key={val.awardName}>
                    <td>{val.awardName}</td>
                    <td>{val.straws.map((st) => st.name).join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Stack>
      </main>
    </div>
  );
};

export default Home;
