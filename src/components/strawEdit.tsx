import { useRef } from 'react';
import { Button, Stack } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { useLotterytStore } from 'src/stores/lotterytStore';

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
          <input ref={fileRef} type="file" onChange={readFile} hidden />
          <Button
            onClick={() => fileRef.current?.click()}
            variant="primary"
            disabled={lock}
          >
            Upload Namelist
          </Button>
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
