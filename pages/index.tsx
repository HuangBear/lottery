import Layout from 'src/layout/Layout';
import { IAward, IStraw } from 'src/stores/lotterytStore';
import { useEffect, useState } from 'react';
import { useLotterytStore } from 'src/stores/lotterytStore';
import { useRouter } from 'next/router';
import PartialRedrawModal from 'src/components/PartialRedrawModal';
import UndoModal from 'src/components/UndoModal';

const DUMMY_AWARD: IAward = {
  name: '頭獎',
  description: 'iPhone 14',
  quota: 1,
  order: 1,
};
const DUMMY_STRAW: IStraw = { no: 1, group: 'ABC', name: 'DEF' };

const Index = () => {
  const router = useRouter();

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
  const [winner, setWinner] = useState<IStraw>();

  const [undoModal, setUndoModal] = useState<boolean>(false);
  const [redrawModal, setRedrawModal] = useState<boolean>(false);

  useEffect(() => {
    setClientSide(true);
  }, []);

  const lackingData = straws.length === 0 || awards.length === 0;

  const handleDraw = () => {
    setDrawing(true);
    setTimeout(() => {
      draw();
      setDrawing(false);
    }, 2500);
  };

  const resultElement = (award: IAward, straw: IStraw) => {
    return (
      <>
        <div className="bgb get" id="lottery">
          <div
            style={{
              position: 'absolute',
              width: '100vw',
              height: '100vh',
              top: 0,
              left: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img src="/images/h_mp2c.gif" width={'100%'} alt="" />
          </div>
          <div className="bg_filter"></div>

          {!drawing && straw && (
            <div className="start">
              <div>
                <img
                  src={award.pic ?? '/gift.png'}
                  alt=""
                  style={{ aspectRatio: '4/3', objectFit: 'contain' }}
                />
              </div>
              <p style={{ color: 'darkred' }}>
                恭喜 {straw.group} - {straw.name}
              </p>
              <p>
                {award.name} - {award.description}
              </p>
              <hr style={{ width: '100%' }} />
              <a className="mt-3" onClick={() => nextAward()}>
                <h3>繼續抽下一獎!</h3>
              </a>
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

  const currentAwardElement = (award: IAward | undefined) => {
    return (
      <>
        <div className="bgb">
          <div className="start">
            {award && (
              <div>
                <img
                  src={award.pic ?? '/gift.png'}
                  alt=""
                  style={{ aspectRatio: '4/3', objectFit: 'contain' }}
                />
              </div>
            )}
            <p>
              {award
                ? `${award.name}-${award.description}`
                : '尚未進行抽獎設定'}
            </p>
            <a
              onClick={() =>
                lackingData
                  ? router.push('/edit')
                  : lock
                  ? handleDraw()
                  : start()
              }
            >
              <h1>
                {lackingData ? '前往設定' : lock ? '抽獎 GO !' : '開始抽獎'}
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
            <UndoModal
              show={undoModal}
              setShow={setUndoModal}
              straws={winners[0].straws}
              awardName={winners[0].award.name}
            />
          </>
        )}
        {currentAward && (displaying || drawing)
          ? resultElement(currentAward, winners[0].straws[0])
          : currentAwardElement(currentAward)}
      </Layout>
    </>
  );
};

export default Index;
