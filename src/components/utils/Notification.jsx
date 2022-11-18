import { useEffect, useState } from 'react';
import { Alert, Button, Toast } from 'react-daisyui';
import { FaTimes } from 'react-icons/fa';

function Notification({ data }) {
  const [alerts, setAlerts] = useState([]);

  const handleRemoveToast = (index) => {
    setAlerts((alerts) => alerts.filter((_, i) => i !== index));
  };

  useEffect(() => {
    data && setAlerts((alerts) => [...alerts, data]);
  }, [data]);

  return (
    <Toast vertical="top">
      {alerts.map((alert, index) => (
        <Alert key={index} status={alert.status}>
          <div className="w-full flex-row justify-between gap-2">
            <h3>{alert.text}</h3>
          </div>
          <Button
            color="ghost"
            shape="circle"
            startIcon={<FaTimes />}
            onClick={() => handleRemoveToast(index)}
          />
        </Alert>
      ))}
    </Toast>
  );
}

export default Notification;
