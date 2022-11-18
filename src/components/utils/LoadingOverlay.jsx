import { Button } from 'react-daisyui';

function LoadingOverlay({ loading, children }) {
  return (
    <>
      {loading ? (
        <div className="fixed top-1/2 left-1/2 z-50 flex h-full w-full -translate-y-1/2 -translate-x-1/2 items-center justify-center bg-secondary bg-opacity-75">
          <Button loading={true} shape={'circle'} color={'secondary'} />
        </div>
      ) : (
        children
      )}
    </>
  );
}

export default LoadingOverlay;
