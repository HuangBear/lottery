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
          確定要重抽？
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          會將獎項 <b>{props.awardName}</b> 之得獎者：
          <b>
            {props.straws.map((val) => val.no + '-' + val.name).join(', ')}
          </b>{' '}
          自抽獎人及中獎人列表移除，並重新抽取 {props.redrawIdx.length}{' '}
          位得獎者，確定嗎？
        </p>
        （使用情境參考：該些得獎者因故無法領獎）
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose}>
          取消
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
          重抽
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PartialRedrawModal;
