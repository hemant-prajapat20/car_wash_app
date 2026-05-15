import React from 'react';
import { NotificationPage } from '../../components/shared/NotificationPage';

const AdminNotifications: React.FC = () => {
  return (
    <NotificationPage 
      title="System Notifications" 
      subtitle="Monitor platform activity and system alerts" 
    />
  );
};

export default AdminNotifications;
