import React from 'react';
import { NotificationPage } from '../../components/shared/NotificationPage';

const CustomerNotifications: React.FC = () => {
  return (
    <NotificationPage 
      title="My Notifications" 
      subtitle="Manage your booking alerts and updates" 
    />
  );
};

export default CustomerNotifications;
