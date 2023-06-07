import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { IStraw, useLotterytStore } from 'src/stores/lotterytStore';

interface IProps {
  awardName: string;
  redrawIdx: number[];
  straws: IStraw[];
  show: boolean;
  setShow: (show: boolean) => void;
  setDrawing: (drawing: boolean) => void;
  callback: () => void;
}
// TODO 改為新增一補抽獎項
function PartialRedrawModal(props: IProps) {
  const [partialRedraw, partialRedrawPrepare] = useLotterytStore((state) => [
    state.partialRedraw,
    state.partialRedrawPrepare,
  ]);
  const handleClose = () => props.setShow(false);
  return (
    <Modal
      show={props.show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          確定要重抽部分得獎者？
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          會將獎項 {props.awardName} 之得獎者：
          {props.straws.map((val) => val.no + '-' + val.name).join(', ')}{' '}
          移除，並重新抽取 {props.redrawIdx.length} 位得獎者，確定嗎？
        </p>
        <p>（使用情境參考：該些得獎者因故無法領獎）</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          取消
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            props.setDrawing(true);
            partialRedrawPrepare(props.redrawIdx);
            handleClose();
            props.callback();

            setTimeout(() => {
              partialRedraw(props.redrawIdx);
              props.setDrawing(false);
            }, 5000);
          }}
        >
          重抽
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PartialRedrawModal;
