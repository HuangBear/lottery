import { ChangeEvent, useRef, useState } from 'react';
import { Button, Form, Stack } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { usePapaParse } from 'react-papaparse';
import { IAward, useLotterytStore } from 'src/stores/lotterytStore';
import Image from 'react-bootstrap/Image';

const format = 'order,name,description,quota,pic';
const downloadDemoData = async () => {
  const ftch = await fetch(`/api/awards`);
  const fileBlob = await ftch.blob();
  let link = document.createElement('a');
  link.href = window.URL.createObjectURL(fileBlob);
  link.download = 'awards.csv';
  link.click();
  link.remove();
};

const DEFAULT_AWARD: IAward = {
  order: 1,
  name: '',
  description: '',
  quota: 1,
  pic: undefined,
};

function AwardEdit() {
  const { readString } = usePapaParse();
  const [editingIdx, setEditingIdx] = useState<number>();
  const [editingOrder, setEditingOrder] = useState<number>(1);
  const [editingName, setEditingName] = useState<string>('');
  const [editingDescription, setEditingDescription] = useState<string>('');
  const [editingQuota, setEditingQuota] = useState<number>(1);
  const [editingPic, setEditingPic] = useState<any>();

  const awards = useLotterytStore((state) => state.awards);
  const lock = useLotterytStore((state) => state.lock);

  const setAward = useLotterytStore((state) => state.setAwards);
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const readFile = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    if (files) {
      const fileReader = new FileReader();
      fileReader.readAsText(files[0], 'UTF-8');
      fileReader.onload = (e) => {
        const content = e.target?.result as string;
        content &&
          readString<IAward>(content, {
            worker: true,
            header: true,
            complete: (results) => setAward(results.data),
          });
      };
    }
  };
  const readImage = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    if (files) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(files[0]);
      fileReader.onload = () => setEditingPic(fileReader.result);
    }
  };

  const setEditingData = (award: IAward) => {
    setEditingOrder(award.order);
    setEditingName(award.name);
    setEditingDescription(award.description);
    setEditingQuota(award.quota);
    setEditingPic(award.pic);
  };

  const handleEditingIndex = (idx: number | undefined) => {
    if (!lock) {
      if (idx === undefined) {
        setEditingData(DEFAULT_AWARD);
      } else {
        setEditingData({ ...awards[idx] });
      }
      setEditingIdx(idx);
    }
  };

  const handleSubmitEdit = () => {
    const tempEditIdx = editingIdx;
    const tempData: IAward = {
      order: editingOrder,
      name: editingName,
      description: editingDescription,
      quota: editingQuota,
      pic: editingPic,
    };

    setAward(
      awards.map((val, idx) =>
        tempEditIdx === idx && tempData ? tempData : val
      )
    );
    handleEditingIndex(undefined);
  };

  const handleAddAward = () => {
    console.log('add!');
    const tempData: IAward = {
      order: editingOrder,
      name: editingName,
      description: editingDescription,
      quota: editingQuota,
      pic: editingPic,
    };
    setAward([...awards, tempData]);
    handleEditingIndex(undefined);
  };

  const handleRemove = (idxToRemove: number) =>
    setAward(awards.filter((_val, idx) => idx !== idxToRemove));

  const loadDemoData = async () =>
    (await fetch('/api/awards')).text().then((val) =>
      readString<IAward>(val, {
        worker: true,
        header: true,
        complete: (results) => {
          setAward(results.data);
        },
      })
    );

  const editRow = (edit: boolean) => (
    // <Form onSubmit={edit ? handleSubmitEdit : handleAddAward}>
    <>
      <td>
        <Form.Control
          placeholder="order"
          type="number"
          defaultValue={editingOrder}
          onChange={(event) => setEditingOrder(+event.target.value)}
        />
      </td>
      <td>
        <Form.Control
          placeholder="name"
          defaultValue={editingName}
          onChange={(event) => setEditingName(event.target.value)}
        />
      </td>
      <td>
        <Form.Control
          placeholder="description"
          as="textarea"
          defaultValue={editingDescription}
          onChange={(event) => setEditingDescription(event.target.value)}
        />
      </td>
      <td>
        <Form.Control
          placeholder="quota"
          type="number"
          min="1"
          defaultValue={editingQuota}
          onChange={(event) => setEditingQuota(+event.target.value)}
        />
      </td>
      <td style={{ textAlign: 'center' }}>
        {editingPic && (
          <>
            <Image
              className="col-6 mx-2"
              src={editingPic}
              rounded
              alt="editing picture"
              style={{
                aspectRatio: '1/1',
                objectFit: 'contain',
              }}
            />
            <br />
          </>
        )}

        <Button
          size="sm"
          variant="outline-primary"
          className="m-1"
          disabled={lock}
          onClick={() => imageRef.current?.click()}
        >
          Upload
        </Button>
      </td>
      <td style={{ textAlign: 'center' }}>
        {edit ? (
          <>
            <Button
              size="sm"
              variant="outline-primary"
              onClick={handleSubmitEdit}
              className="m-1"
              disabled={lock}
            >
              Update
            </Button>
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={() => handleEditingIndex(undefined)}
              className="m-1"
              disabled={lock}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            variant="primary"
            onClick={handleAddAward}
            className="m-1"
            disabled={lock}
          >
            Add
          </Button>
        )}
      </td>
    </>
    // </Form>
  );

  return (
    <>
      <Stack gap={2} className="col-md-10 col-12 mx-auto">
        <div>
          <h2>上傳獎項資料</h2>
          <p />
          <li>csv</li>
          <li>
            格式：{format}，可參考{' '}
            <a href="/api/awards" target="_blank">
              demo data
            </a>
          </li>
          <li>
            首行需為 column name: {format}，其中 pic 若預計線上編輯則可省略
            <ol>
              <li>order: 該獎項被抽取的順位，越小越早抽</li>
              <li>name: 該獎項名稱，例：頭獎</li>
              <li>description: 該獎項介紹</li>
              <li>quota: 該獎項共計要抽出幾位</li>
              <li>
                pic: 獎項圖片，base64 string，可先將圖片轉換成 base64
                字串後放到檔案中，也可以上傳僅含上述資料之檔案後再進行線上編輯
              </li>
            </ol>
          </li>
        </div>
        <div>
          <Button
            onClick={() => fileRef.current?.click()}
            variant="primary"
            disabled={lock}
            className="col-md-3 col-12"
          >
            Upload Awards
          </Button>
          <Button
            className="col-md-3 col-12 my-2 m-md-2"
            onClick={() => loadDemoData()}
            variant="secondary"
            disabled={lock}
          >
            Use demo data
          </Button>
          <Button
            className="col-md-4 col-12"
            onClick={() => downloadDemoData()}
            variant="outline-secondary"
          >
            Download demo data
          </Button>
          <input
            ref={fileRef}
            type="file"
            onChange={readFile}
            onClick={(event) => {
              event.currentTarget.value = '';
            }}
            hidden
          />
          <input
            ref={imageRef}
            type="file"
            accept="image/*"
            onChange={readImage}
            onClick={(event) => {
              event.currentTarget.value = '';
            }}
            hidden
          />
        </div>
        <div className="py-2">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Order</th>
                <th>Award Name</th>
                <th>Description</th>
                <th>Quota</th>
                <th>Image</th>
                <th>Control</th>
              </tr>
            </thead>
            <tbody>
              {awards.map((val, idx) => (
                <tr key={idx}>
                  {editingIdx === idx ? (
                    editRow(true)
                  ) : (
                    <>
                      <td>{val.order}</td>
                      <td>{val.name}</td>
                      <td>{val.description}</td>
                      <td>{val.quota}</td>
                      <td style={{ textAlign: 'center' }}>
                        {val.pic && (
                          <Image
                            className="col-6"
                            src={val.pic}
                            rounded
                            alt={`pictue ${val.name}`}
                            style={{ aspectRatio: '1/1', objectFit: 'contain' }}
                          />
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <Button
                          size="sm"
                          variant="outline-primary"
                          className="m-1"
                          onClick={() => handleEditingIndex(idx)}
                          disabled={lock}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          className="m-1"
                          variant="outline-danger"
                          onClick={() => handleRemove(idx)}
                          disabled={lock}
                        >
                          Remove
                        </Button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {editingIdx === undefined && <tr>{editRow(false)}</tr>}
            </tbody>
          </Table>
        </div>
      </Stack>
    </>
  );
}

export default AwardEdit;
