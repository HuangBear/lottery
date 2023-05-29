import { useRef } from 'react';
import { Button, Stack } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { IAward, useLotterytStore } from 'src/stores/lotterytStore';

function AwardEdit() {
  const awards = useLotterytStore((state) => state.awards);
  const lock = useLotterytStore((state) => state.lock);

  const setAward = useLotterytStore((state) => state.setAwards);
  const fileRef = useRef<HTMLInputElement>(null);

  const readFile = (event: any) => {
    const fileReader = new FileReader();
    const { files } = event.target;

    fileReader.readAsText(files[0], 'UTF-8');
    fileReader.onload = (e) => {
      const content = e.target?.result;
      const jsonAwards: IAward[] = JSON.parse(content as string);
      jsonAwards.sort((a, b) => a.order - b.order);
      content && setAward(jsonAwards);
    };
  };
  return (
    <>
      <Stack gap={2} className="col-md-5 mx-auto">
        <div>
          <input ref={fileRef} type="file" onChange={readFile} hidden />
          <Button
            onClick={() => fileRef.current?.click()}
            variant="primary"
            disabled={lock}
          >
            Upload Awards
          </Button>
        </div>
        <div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Order</th>
                <th>Award</th>
                <th>Detail</th>
                <th>Quota</th>
              </tr>
            </thead>
            <tbody>
              {awards.map((val) => (
                <tr key={val.name}>
                  <td>{val.order}</td>
                  <td>{val.name}</td>
                  <td>{val.description}</td>
                  <td>{val.count}</td>
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
