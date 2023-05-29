import { useRef } from 'react';
import { Button, Stack } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { useLotterytStore } from 'src/stores/lotterytStore';

const format = '[object, object, object]';
const downloadDemoData = async () => {
  const ftch = await fetch(`/api/namelist`);
  const fileBlob = await ftch.blob();
  let link = document.createElement('a');
  link.href = window.URL.createObjectURL(fileBlob);
  link.download = 'namelist.json';
  link.click();
  link.remove();
};

function StrawEdit() {
  const straws = useLotterytStore((state) => state.straws);
  const lock = useLotterytStore((state) => state.lock);

  const setStraws = useLotterytStore((state) => state.setStraws);
  const fileRef = useRef<HTMLInputElement>(null);

  const readFile = (event: any) => {
    const fileReader = new FileReader();
    const { files } = event.target;

    fileReader.readAsText(files[0], 'UTF-8');
    fileReader.onload = (e) => {
      const content = e.target?.result;
      console.log(content);
      content && setStraws(JSON.parse(content as string));
    };
  };
  return (
    <>
      <Stack gap={2} className="col-md-5 mx-auto">
        <div>
          <h2>上傳抽獎人資料</h2>
          <p />
          <li>json</li>
          <li>格式：{format}</li>
          <li>
            object 欄位名稱（注意大小寫）及代表意義如下
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
          >
            Upload Namelist
          </Button>
          <Button
            className="mx-2"
            onClick={() => downloadDemoData()}
            variant="secondary"
            disabled={lock}
          >
            Download demo data
          </Button>
          <input ref={fileRef} type="file" onChange={readFile} hidden />
        </div>
        <div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Group</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {straws.map((val) => (
                <tr key={val.no}>
                  <td>{val.no}</td>
                  <td>{val.group}</td>
                  <td>{val.name}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Stack>
    </>
  );
}

export default StrawEdit;
