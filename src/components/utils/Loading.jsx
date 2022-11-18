import { Button } from 'react-daisyui';

function Loading({ loading }) {
  return (
    <>
      {loading && (
        <div className="flex w-full items-center justify-center ">
          <Button loading={true} shape={'circle'} color={'secondary'} />
        </div>
      )}
    </>
  );
}

export default Loading;
