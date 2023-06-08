import Layout from 'src/layout/Layout';
import { useState } from 'react';
import { IStraw, useLotterytStore } from 'src/stores/lotterytStore';
import { useRouter } from 'next/router';
import PartialRedrawModal from 'src/components/PartialRedrawModal';

const Index = () => {
  const router = useRouter();

  const straws = useLotterytStore((state) => state.straws);
  const awards = useLotterytStore((state) => state.awards);
  const winners = useLotterytStore((state) => state.winners);

  const currentAward = useLotterytStore((state) => state.currentAward);

  const started = useLotterytStore((state) => state.started);
  const displaying = useLotterytStore((state) => state.displaying);

  const start = useLotterytStore((state) => state.start);
  const draw = useLotterytStore((state) => state.draw);
  const nextAward = useLotterytStore((state) => state.nextAward);

  const [drawing, setDrawing] = useState<boolean>(false);

  const [redrawModal, setRedrawModal] = useState<boolean>(false);

  const lackingData =
    (straws.length === 0 || awards.length === 0) && !currentAward;

  const handleDraw = () => {
    setDrawing(true);
    setTimeout(() => {
      draw();
      setDrawing(false);
    }, 2500);
  };

  const resultElement = (straw: IStraw) => {
    return (
      <>
        <div className="bgb get" id="lottery">
          <div
            style={{
              position: 'absolute',
              width: 'calc(100vw - 18px)',
              height: '100vh',
              top: 0,
              left: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {drawing && (
              <img src="/images/h_mp2c-infinite.gif" width={'100%'} alt="" />
            )}
          </div>

          <div className="bg_filter"></div>

          {!drawing && currentAward && straw && (
            <div className="start">
              <div>
                <img
                  src={currentAward.pic ?? '/gift.png'}
                  alt=""
                  style={{ aspectRatio: '4/3', objectFit: 'contain' }}
                />
              </div>
              <p style={{ color: 'darkred' }}>
                恭喜 {straw.group} - {straw.name}
              </p>
              <p>
                {currentAward.name} - {currentAward.description}
              </p>
              <hr style={{ width: '100%' }} />
              {awards.length === 0 ? (
                <a className="mt-3">
                  <h3>獎項已全數抽完</h3>
                </a>
              ) : (
                <a className="mt-3" href="#" onClick={() => nextAward()}>
                  <h3>繼續抽下一獎!</h3>
                </a>
              )}

              <p className="mt-0">
                <small>活動保留最後變更權利! 重抽請點這 </small>
                <a onClick={() => setRedrawModal(true)} href="#">
                  <i className="material-icons-outlined">refresh</i>
                </a>
              </p>
            </div>
          )}
        </div>
      </>
    );
  };

  const currentAwardElement = () => {
    return (
      <>
        <div className="bgb">
          <div className="start">
            {started && currentAward && (
              <div>
                <img
                  src={currentAward.pic ?? '/gift.png'}
                  alt=""
                  style={{ aspectRatio: '4/3', objectFit: 'contain' }}
                />
              </div>
            )}
            <p>
              {lackingData
                ? '尚未完成抽獎設定'
                : currentAward && started
                ? `${currentAward.name} - ${currentAward.description}`
                : ''}
            </p>
            <a
              onClick={() =>
                lackingData
                  ? router.push('/edit')
                  : started
                  ? handleDraw()
                  : start()
              }
            >
              <h1>
                {lackingData ? '前往設定' : started ? '抽獎 GO !' : '開始抽獎'}
              </h1>
            </a>
            <p>
              <small>活動保留最後變更權利!</small>
            </p>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <Layout>
        {winners[0]?.award && (
          <>
            <PartialRedrawModal
              show={redrawModal}
              setShow={setRedrawModal}
              straws={winners[0].straws}
              redrawIdx={winners[0].straws.map((_val, idx) => idx)}
              awardName={winners[0].award.name}
              setDrawing={setDrawing}
            />
          </>
        )}
        {currentAward && (displaying || drawing)
          ? resultElement(winners[0]?.straws[0])
          : currentAwardElement()}
      </Layout>
    </>
  );
};

export default Index;
