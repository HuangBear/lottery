import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useLotterytStore } from "src/stores/lotterytStore";

interface IProps {
  show: boolean;
  setShow: (show: boolean) => void;
}

function ResetConfirmModal(props: IProps) {
  const reset = useLotterytStore((state) => state.reset);
  const handleClose = () => props.setShow(false);
  return (
    <Modal
      show={props.show}
      onHide={handleClose}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Sure To Reset?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          RESET 會將已上傳的 entrants, prizes
          清除；若已經開始抽獎程序，則已抽出的名單也會一併清除
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          取消
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            reset();
            handleClose();
          }}
        >
          RESET
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ResetConfirmModal;
