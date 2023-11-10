import { useRef, useState } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { IStraw, useLotterytStore } from "src/stores/lotterytStore";
import { usePapaParse } from "react-papaparse";

const format = "no,group,name";
const downloadDemoData = async () => {
  const ftch = await fetch(`/api/namelist`);
  const fileBlob = await ftch.blob();
  let link = document.createElement("a");
  link.href = window.URL.createObjectURL(fileBlob);
  link.download = "namelist.csv";
  link.click();
  link.remove();
};

const DEFAULT_STRAW: IStraw = {
  no: 1,
  group: "",
  name: "",
};

function StrawEdit() {
  const { readString } = usePapaParse();
  const [editingIdx, setEditingIdx] = useState<number>();
  const [editingNo, setEditingNo] = useState<number>(1);
  const [editingName, setEditingName] = useState<string>("");
  const [editingGroup, setEditingGroup] = useState<string>("");

  const straws = useLotterytStore((state) => state.straws);
  const shuffledStraws = useLotterytStore((state) => state.shuffledStraws);
  const started = useLotterytStore((state) => state.started);

  const strawToDisplay = () => {
    if (started && shuffledStraws !== undefined) {
      let result = shuffledStraws.slice();
      result.sort((a, b) => a.no - b.no);

      return result;
    } else {
      return straws;
    }
  };

  const setStraws = useLotterytStore((state) => state.setStraws);
  const addToShuffledStraws = useLotterytStore(
    (state) => state.addToShuffledStraws
  );
  const fileRef = useRef<HTMLInputElement>(null);

  const readFile = (event: any) => {
    const { files } = event.target;

    if (files) {
      const fileReader = new FileReader();
      fileReader.readAsText(files[0], "UTF-8");
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
    if (!started) {
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

  const handleAddStraw = () => {
    const tempData: IStraw = {
      no: editingNo,
      group: editingGroup,
      name: editingName,
    };
    setStraws([...straws, tempData]);
    if (started) {
      addToShuffledStraws(tempData);
    }
    handleEditingIndex(undefined);
  };

  const handleRemove = (idxToRemove: number) =>
    setStraws(straws.filter((_val, idx) => idx !== idxToRemove));

  const loadDemoData = async () =>
    (await fetch("/api/namelist")).text().then((val) =>
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
      <td style={{ textAlign: "center" }}>
        {edit ? (
          <>
            {!started && (
              <>
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={handleSubmitEdit}
                  className="m-1"
                  disabled={started}
                >
                  Update
                </Button>
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => handleEditingIndex(undefined)}
                  className="m-1"
                  disabled={started}
                >
                  Cancel
                </Button>
              </>
            )}
          </>
        ) : (
          <Button
            size="sm"
            variant="primary"
            onClick={handleAddStraw}
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
          <h2>編輯抽獎人資料</h2>
          <p />
          <h3>上傳檔案</h3>
          <li>
            上傳資料會<b>覆蓋掉當前所有資料</b>
            ，若有需要請先上傳資料後再進行線上編輯/新增
          </li>
          <li>
            要求 CSV 檔案，格式為：{format}，可參考{" "}
            <a href="/api/namelist" target="_blank">
              demo data
            </a>
          </li>
          <li>
            檔案首行需為 column name: {format}，順序不拘
            <ol>
              <li>no: 抽獎人編號</li>
              <li>group: 抽獎人所屬團體</li>
              <li>name: 抽獎人名稱</li>
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
            Upload Entrants
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
              event.currentTarget.value = "";
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
                <th>Control</th>
              </tr>
            </thead>
            <tbody>
              {strawToDisplay().map((val, idx) => (
                <tr key={idx}>
                  {editingIdx === idx ? (
                    editRow(true)
                  ) : (
                    <>
                      <td>{val.no}</td>
                      <td>{val.group}</td>
                      <td>{val.name}</td>
                      <td style={{ textAlign: "center" }}>
                        {!started && (
                          <>
                            <Button
                              size="sm"
                              variant="outline-primary"
                              className="m-1"
                              onClick={() => handleEditingIndex(idx)}
                              disabled={started}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              className="m-1"
                              variant="outline-danger"
                              onClick={() => handleRemove(idx)}
                              disabled={started}
                            >
                              Remove
                            </Button>
                          </>
                        )}
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

export default StrawEdit;
