import { Button } from 'react-daisyui';

function Loading({ loading, fullWidth = true, children, size }) {
  return (
    <>
      {loading ? (
        <div
          className={`flex ${
            fullWidth && 'w-full'
          } items-center justify-center`}
        >
          <Button
            loading={true}
            shape={'circle'}
            color={'secondary'}
            size={size}
          />
        </div>
      ) : (
        children
      )}
    </>
  );
}

export default Loading;
