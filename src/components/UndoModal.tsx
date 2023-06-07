import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { IStraw, useLotterytStore } from 'src/stores/lotterytStore';

interface IProps {
  awardName: string;
  straws: IStraw[];
  show: boolean;
  setShow: (show: boolean) => void;
}
function UndoModal(props: IProps) {
  const undoCurrentDraw = useLotterytStore((state) => state.undoCurrentDraw);
  const handleClose = () => props.setShow(false);
  return (
    <Modal
      show={props.show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      onHide={handleClose}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          確定要還原到此次抽獎前？
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          會將獎項 <b>{props.awardName}</b> 之得獎者：
          <b>
            {props.straws.map((val) => val.no + '-' + val.name).join(', ')}
          </b>{' '}
          全數放回抽獎人列表，供重新抽取此獎項，確定嗎？
        </p>
        （使用情境參考：操作失誤、提早開出獎項）
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} className="mx-4">
          取消
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            handleClose();
            undoCurrentDraw();
          }}
        >
          確認
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UndoModal;
