import Notification from '../utils/Notification';
function Container({ children, notification }) {
  return (
    <div className="container mx-auto max-w-lg p-4  selection:bg-primary selection:text-primary-content">
      {children}
      {notification && <Notification data={notification} />}
    </div>
  );
}

export default Container;
