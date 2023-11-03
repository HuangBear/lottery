import Layout from "src/layout/Layout";
import { useState } from "react";
import { IStraw, useLotterytStore } from "src/stores/lotterytStore";
import { useRouter } from "next/router";
import PartialRedrawModal from "src/components/PartialRedrawModal";

const Index = () => {
  const router = useRouter();

  const straws = useLotterytStore((state) => state.straws);
  const shuffledStraws = useLotterytStore((state) => state.shuffledStraws);
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

  const noMoreStraw =
    shuffledStraws !== undefined && shuffledStraws.length === 0;

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
              position: "absolute",
              width: "calc(100vw - 18px)",
              height: "100vh",
              top: 0,
              left: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {drawing && (
              <img src="/images/h_mp2c-infinite.gif" width={"100%"} alt="" />
            )}
          </div>

          <div className="bg_filter"></div>

          {!drawing && currentAward && straw && (
            <div className="start">
              <div>
                <img
                  src={currentAward.pic ?? "/gift.png"}
                  alt=""
                  style={{ aspectRatio: "4/3", objectFit: "contain" }}
                />
              </div>
              <p style={{ color: "darkred" }}>
                Congratulations! {straw.group} - {straw.name}
              </p>
              <p>
                {currentAward.name} - {currentAward.description}
              </p>
              <hr style={{ width: "100%" }} />
              {awards.length === 0 ? (
                <a className="mt-3">
                  <h3>All prizes have been drawn</h3>
                </a>
              ) : (
                <a className="mt-3" href="#" onClick={() => nextAward()}>
                  <h3>Next Prize!</h3>
                </a>
              )}

              <p className="mt-0">
                <small>
                  The organizer reserves the right to make any final changes.
                  Click here to re-draw{" "}
                </small>
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
                  src={currentAward.pic ?? "/gift.png"}
                  alt=""
                  style={{ aspectRatio: "4/3", objectFit: "contain" }}
                />
              </div>
            )}
            <p>
              {lackingData
                ? "Lottery settings are not yet completed"
                : currentAward && started
                ? `${currentAward.name} - ${currentAward.description}`
                : ""}
            </p>
            {noMoreStraw && (
              <p>
                <small>
                  No more entrant to draw, please add more entrants at setup
                  page
                </small>
              </p>
            )}
            <a
              href="#"
              onClick={() =>
                lackingData || noMoreStraw
                  ? router.push("/edit")
                  : started
                  ? handleDraw()
                  : start()
              }
            >
              <h1>
                {lackingData || noMoreStraw
                  ? "Setting"
                  : started
                  ? "Start the lucky draw"
                  : "Start the lucky draw"}
              </h1>
            </a>
            <p>
              <small>
                The organizer reserves the right to make any final changes.
              </small>
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
