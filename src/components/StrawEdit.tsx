import { useRef, useState } from 'react';
import { Button, Form, Stack } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { IStraw, useLotterytStore } from 'src/stores/lotterytStore';
import { usePapaParse } from 'react-papaparse';

const format = 'no,group,name';
const downloadDemoData = async () => {
  const ftch = await fetch(`/api/namelist`);
  const fileBlob = await ftch.blob();
  let link = document.createElement('a');
  link.href = window.URL.createObjectURL(fileBlob);
  link.download = 'namelist.csv';
  link.click();
  link.remove();
};

const DEFAULT_STRAW: IStraw = {
  no: 1,
  group: '',
  name: '',
};

function StrawEdit() {
  const { readString } = usePapaParse();
  const [editingIdx, setEditingIdx] = useState<number>();
  const [editingNo, setEditingNo] = useState<number>(1);
  const [editingName, setEditingName] = useState<string>('');
  const [editingGroup, setEditingGroup] = useState<string>('');

  const straws = useLotterytStore((state) => state.straws);
  const lock = useLotterytStore((state) => state.lock);

  const setStraws = useLotterytStore((state) => state.setStraws);
  const fileRef = useRef<HTMLInputElement>(null);

  const readFile = (event: any) => {
    const { files } = event.target;

    if (files) {
      const fileReader = new FileReader();
      fileReader.readAsText(files[0], 'UTF-8');
      fileReader.onload = (e) => {
        const content = e.target?.result as string;
        content &&
          readString<IStraw>(content, {
            worker: true,
            header: true,
            complete: (results) => setStraws(results.data),
          });
      };
    }
  };

  const setEditingData = (straw: IStraw) => {
    setEditingNo(straw.no);
    setEditingGroup(straw.group);
    setEditingName(straw.name);
  };

  const handleEditingIndex = (idx: number | undefined) => {
    if (!lock) {
      if (idx === undefined) {
        setEditingData(DEFAULT_STRAW);
      } else {
        setEditingData({ ...straws[idx] });
      }
      setEditingIdx(idx);
    }
  };

  const handleSubmitEdit = () => {
    const tempEditIdx = editingIdx;
    const tempData: IStraw = {
      no: editingNo,
      group: editingGroup,
      name: editingName,
    };

    setStraws(
      straws.map((val, idx) =>
        tempEditIdx === idx && tempData ? tempData : val
      )
    );
    handleEditingIndex(undefined);
  };

  const handleAddAward = () => {
    const tempData: IStraw = {
      no: editingNo,
      group: editingGroup,
      name: editingName,
    };
    setStraws([...straws, tempData]);
    handleEditingIndex(undefined);
  };

  const handleRemove = (idxToRemove: number) =>
    setStraws(straws.filter((_val, idx) => idx !== idxToRemove));

  const loadDemoData = async () =>
    (await fetch('/api/namelist')).text().then((val) =>
      readString<IStraw>(val, {
        worker: true,
        header: true,
        complete: (results) => {
          setStraws(results.data);
        },
      })
    );

  const editRow = (edit: boolean) => (
    <>
      <td>
        <Form.Control
          placeholder="no"
          type="number"
          defaultValue={editingNo}
          onChange={(event) => setEditingNo(+event.target.value)}
        />
      </td>
      <td>
        <Form.Control
          placeholder="group"
          defaultValue={editingGroup}
          onChange={(event) => setEditingGroup(event.target.value)}
        />
      </td>
      <td>
        <Form.Control
          placeholder="name"
          defaultValue={editingName}
          onChange={(event) => setEditingName(event.target.value)}
        />
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
  );

  return (
    <>
      <Stack gap={2} className="col-md-10 col-12 mx-auto">
        <div>
          <h2>上傳抽獎人資料</h2>
          <p />
          <li>csv</li>
          <li>
            格式：{format}，可參考{' '}
            <a href="/api/namelist" target="_blank">
              demo data
            </a>
          </li>
          <li>
            首行需為 column name: {format}
            <ol>
              <li>no: 抽獎人編號</li>
              <li>group: 抽獎人所屬團體</li>
              <li>name: 抽獎人名稱</li>
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
            Upload Namelist
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
        </div>
        <div className="py-2">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Group</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {straws.map((val, idx) => (
                <tr key={idx}>
                  {editingIdx === idx ? (
                    editRow(true)
                  ) : (
                    <>
                      <td>{val.no}</td>
                      <td>{val.group}</td>
                      <td>{val.name}</td>
                    </>
                  )}
                </tr>
              ))}
              <tr>{editRow(false)}</tr>
            </tbody>
          </Table>
        </div>
      </Stack>
    </>
  );
}

export default StrawEdit;
