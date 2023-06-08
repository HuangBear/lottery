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
  const [editingPic, setEditingPic] = useState<any>();

  const awards = useLotterytStore((state) => state.awards);
  const started = useLotterytStore((state) => state.started);

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
    setEditingPic(award.pic);
  };

  const handleEditingIndex = (idx: number | undefined) => {
    if (idx === undefined) {
      setEditingData(DEFAULT_AWARD);
    } else {
      setEditingData({ ...awards[idx] });
    }
    setEditingIdx(idx);
  };

  const handleSubmitEdit = () => {
    const tempEditIdx = editingIdx;
    const tempData: IAward = {
      order: editingOrder,
      name: editingName,
      description: editingDescription,
      quota: 1,
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
    const tempData: IAward = {
      order: editingOrder,
      name: editingName,
      description: editingDescription,
      quota: 1,
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
            >
              Update
            </Button>
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={() => handleEditingIndex(undefined)}
              className="m-1"
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
          >
            Add
          </Button>
        )}
      </td>
    </>
  );

  return (
    <>
      <Stack gap={2} className="col-md-10 col-12 mx-auto">
        <div>
          <h2>編輯獎項資料</h2>
          <p />
          <h3>上傳檔案</h3>
          <li>
            上傳資料會<b>覆蓋掉當前所有資料</b>
            ，若有需要請先上傳資料後再進行線上編輯/新增
          </li>
          <li>
            開始抽獎後，因前述原因不提供上傳，若有需要增加獎項請使用線上編輯功能
          </li>
          <li>
            要求 CSV 檔案，格式為：{format}，可參考{' '}
            <a href="/api/awards" target="_blank">
              demo data
            </a>
          </li>
          <li>
            檔案首行需為 column name: {format}，順序不拘，其中 pic
            若預計線上編輯則可省略
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
          <h3>線上編輯</h3>
          <li>
            上傳資料會<b>覆蓋掉當前所有資料</b>
            ，若有需要請先上傳資料後再進行線上編輯/新增
          </li>
          <li>下方 table 提供線上編輯功能</li>
          <li>
            上傳資料後點選 <b>Edit</b> 編輯資料再按 <b>Update</b> 完成更新
          </li>
          <li>
            利用最下方欄位編輯新資料，再按 <b>Add</b> 將其加入
          </li>
        </div>
        <div>
          <Button
            onClick={() => fileRef.current?.click()}
            variant="primary"
            disabled={started}
            className="col-md-3 col-12"
          >
            Upload Awards
          </Button>
          <Button
            className="col-md-3 col-12 my-2 m-md-2"
            onClick={() => loadDemoData()}
            variant="secondary"
            disabled={started}
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
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          className="m-1"
                          variant="outline-danger"
                          onClick={() => handleRemove(idx)}
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
