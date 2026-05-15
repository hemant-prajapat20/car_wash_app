import express from 'express';
import { 
  getNotifications, 
  getUnreadCount, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification,
  createNotification
} from '../controllers/notificationController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All notification routes are protected
router.use(protect);

router.get('/', getNotifications);
router.get('/unread', getUnreadCount);
router.patch('/read/:id', markAsRead);
router.patch('/read-all', markAllAsRead);
router.delete('/:id', deleteNotification);

export default router;
