import { ChangeEvent, useRef } from 'react';
import { Button, Stack } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { usePapaParse } from 'react-papaparse';
import { IAward, useLotterytStore } from 'src/stores/lotterytStore';

const format = 'order,name,description,quota';
const downloadDemoData = async () => {
  const ftch = await fetch(`/api/awards`);
  const fileBlob = await ftch.blob();
  let link = document.createElement('a');
  link.href = window.URL.createObjectURL(fileBlob);
  link.download = 'awards.csv';
  link.click();
  link.remove();
};

function AwardEdit() {
  const { readString } = usePapaParse();

  const awards = useLotterytStore((state) => state.awards);
  const lock = useLotterytStore((state) => state.lock);

  const setAward = useLotterytStore((state) => state.setAwards);
  const fileRef = useRef<HTMLInputElement>(null);

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
            首行需為 column name: {format}
            <ol>
              <li>order: 該獎項被抽取的順位，越小越早抽</li>
              <li>name: 該獎項名稱，例：頭獎</li>
              <li>description: 該獎項介紹</li>
              <li>quota: 該獎項共計要抽出幾位</li>
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
        </div>
        <div className="py-2">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Order</th>
                <th>Award Name</th>
                <th>Description</th>
                <th>Quota</th>
              </tr>
            </thead>
            <tbody>
              {awards.map((val, idx) => (
                <tr key={idx}>
                  <td>{val.order}</td>
                  <td>{val.name}</td>
                  <td>{val.description}</td>
                  <td>{val.quota}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Stack>
    </>
  );
}

export default AwardEdit;
