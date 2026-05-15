import { Request, Response } from 'express';
import Notification from '../models/Notification';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { page = 1, limit = 20 } = req.query;

    const notifications = await Notification.find({ receiverId: userId })
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Notification.countDocuments({ receiverId: userId });

    res.status(200).json({
      success: true,
      data: notifications,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const count = await Notification.countDocuments({ receiverId: userId, isRead: false });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, receiverId: userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    await Notification.updateMany(
      { receiverId: userId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const notification = await Notification.findOneAndDelete({ _id: id, receiverId: userId });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import { getIO } from '../socket';

// Utility function to create notifications from other controllers
export const createNotification = async (data: {
  receiverId: any;
  receiverRole: string;
  vendorId?: any;
  title: string;
  message: string;
  type: string;
  status?: string;
}) => {
  try {
    const notification = new Notification(data);
    await notification.save();

    // Emit real-time notification via Socket.io
    const io = getIO();
    io.to(data.receiverId.toString()).emit('notification_received', notification);

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};
