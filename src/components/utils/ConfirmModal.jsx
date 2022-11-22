import { Button, Modal } from 'react-daisyui';

function ConfirmModal({ open, handleVisible, handleAction, data }) {
  return (
    <Modal open={open} responsive={true}>
      <Modal.Body>{data.text}</Modal.Body>
      <Modal.Actions>
        <Button size="sm" onClick={handleVisible} children={data.no} />
        <Button
          size="sm"
          onClick={handleAction}
          children={data.ok}
          color="error"
        />
      </Modal.Actions>
    </Modal>
  );
}
export default ConfirmModal;
