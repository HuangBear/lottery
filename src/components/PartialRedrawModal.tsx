import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { IStraw, useLotterytStore } from "src/stores/lotterytStore";

interface IProps {
  awardName: string;
  redrawIdx: number[];
  straws: IStraw[];
  show: boolean;
  setShow: (show: boolean) => void;
  setDrawing: (drawing: boolean) => void;
  callback?: () => void;
}
function PartialRedrawModal(props: IProps) {
  const [partialRedraw, partialRedrawPrepare] = useLotterytStore((state) => [
    state.partialRedraw,
    state.partialRedrawPrepare,
  ]);
  const handleClose = () => props.setShow(false);
  return (
    <Modal
      show={props.show}
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Sure to Re-draw?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Winner of <b>{props.awardName}</b>,{" "}
          <b>
            {props.straws.map((val) => val.group + "-" + val.name).join(", ")}
          </b>
          , will be removed from entrants list and redraw for{" "}
          {props.redrawIdx.length} new winner(s), is that OK?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            props.setDrawing(true);
            partialRedrawPrepare(props.redrawIdx);
            handleClose();
            props.callback && props.callback();

            setTimeout(() => {
              partialRedraw(props.redrawIdx);
              props.setDrawing(false);
            }, 2000);
          }}
        >
          Re-draw
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PartialRedrawModal;
