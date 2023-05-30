import { useRef } from 'react';
import { Button, Stack } from 'react-bootstrap';
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

function StrawEdit() {
  const { readString } = usePapaParse();

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

  return (
    <>
      <Stack gap={2} className="col-md-10 col-12 mx-auto">
        <div>
          <h2>上傳抽獎人資料</h2>
          <p />
          <li>json</li>
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
