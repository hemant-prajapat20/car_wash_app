import React, { useEffect, useRef, useState } from 'react';
import { Bell, CheckCircle2, Info, AlertTriangle, XCircle, MoreVertical, Check, Trash2, Loader2, ArrowRight, X, FileText } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchNotifications, fetchUnreadCount, markRead, markAllRead, removeNotification, Notification } from '../../store/notificationSlice';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/axiosConfig';

import { socketService } from '../../services/socketService';
import { addNotification } from '../../store/notificationSlice';

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { notifications, unreadCount, loading } = useSelector((state: RootState) => state.notifications);
  const { user } = useSelector((state: RootState) => state.auth);
  const prevCountRef = useRef(unreadCount);

  // Handle sound notification (Keep this for immediate sound on unreadCount increase)
  useEffect(() => {
    if (unreadCount > prevCountRef.current) {
      const audio = new Audio('/sounds/notification.mp3');
      audio.play().catch(err => console.log('Audio playback failed:', err));
    }
    prevCountRef.current = unreadCount;
  }, [unreadCount]);

  useEffect(() => {
    dispatch(fetchUnreadCount());
    if (isOpen) {
      dispatch(fetchNotifications(1));
    }

    // --- REAL-TIME SOCKET SETUP ---
    if (user && user._id) {
      socketService.connect(user._id);
      
      socketService.onNotification((notification) => {
        dispatch(addNotification(notification));
        
        // Show a premium real-time toast alert matching the theme
        toast.custom((t) => (
          <div 
            className={`${
              t.visible ? 'animate-in fade-in slide-in-from-top-4 duration-300' : 'animate-out fade-out slide-out-to-top-4 duration-200'
            } max-w-sm w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 border border-slate-100 p-4 font-inter`}
          >
            <div className="flex-1 w-0">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-[15px] shadow-sm">
                    {notification.status === 'success' ? '✅' : notification.status === 'error' ? '❌' : '🔔'}
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-xs font-black text-slate-900 leading-tight">{notification.title}</p>
                  <p className="mt-1 text-[11px] font-semibold text-slate-400 leading-normal">{notification.message}</p>
                </div>
              </div>
            </div>
            <div className="ml-4 flex-shrink-0 flex items-center">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="rounded-xl p-1.5 text-slate-300 hover:text-slate-500 hover:bg-slate-50 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ), { duration: 5000 });
      });
    }

    return () => {
      socketService.disconnect();
    };
  }, [dispatch, isOpen, user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string, status: string) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="text-emerald-500" size={16} />;
      case 'warning': return <AlertTriangle className="text-amber-500" size={16} />;
      case 'error': return <XCircle className="text-rose-500" size={16} />;
      default: return <Info className="text-blue-500" size={16} />;
    }
  };

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(markAllRead());
  };

  const handleMarkRead = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    dispatch(markRead(id));
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    dispatch(removeNotification(id));
  };


  const getRedirectPath = () => {
    if (!user) return '/notifications';
    switch (user.role) {
      case 'superAdmin': return '/admin/notifications';
      case 'vendor': return '/vendor/notifications';
      default: return '/customer/notifications';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-all relative group"
      >
        <Bell size={18} className={unreadCount > 0 ? 'animate-pulse text-blue-600' : ''} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full border-2 border-white flex items-center justify-center px-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed left-3 right-3 top-[60px] sm:absolute sm:top-auto sm:left-auto sm:right-0 sm:mt-3 sm:w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[100]"
          >
            <div className="p-4 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                <p className="text-[10px] text-slate-400 font-medium">You have {unreadCount} unread alerts</p>
              </div>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllRead}
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest"
                  >
                    Mark all read
                  </button>
                )}
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
                  aria-label="Close notifications"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {loading && notifications.length === 0 ? (
                <div className="p-10 flex flex-col items-center justify-center">
                  <Loader2 size={24} className="animate-spin text-blue-600 mb-2" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Loading...</p>
                </div>
              ) : notifications.length > 0 ? (
                <div className="divide-y divide-slate-50">
                  {notifications.map((notification) => (
                    <div 
                      key={notification._id}
                      onClick={(e) => !notification.isRead && handleMarkRead(e, notification._id)}
                      className={`p-4 hover:bg-slate-50 transition-all group relative cursor-pointer ${!notification.isRead ? 'bg-blue-50/40 border-l-4 border-blue-600' : ''}`}
                    >
                      <div className="flex gap-3">
                        <div className="mt-0.5 shrink-0">
                          {getIcon(notification.type, notification.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className={`text-[12px] truncate ${!notification.isRead ? 'font-black text-slate-950' : 'font-medium text-slate-500'}`}>
                              {notification.title}
                            </h4>
                            <span className="text-[9px] font-medium text-slate-400 shrink-0">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <p className={`text-[11px] line-clamp-2 mb-2 ${!notification.isRead ? 'font-bold text-slate-800' : 'font-normal text-slate-400'}`}>
                            {notification.message}
                          </p>

                          {notification.bookingId && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/invoice/${notification.bookingId}`);
                                setIsOpen(false);
                              }}
                              className="mb-2 text-[9px] font-black text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/70 border border-blue-100 rounded-lg px-2.5 py-1.5 transition-all flex items-center gap-1.5 self-start uppercase tracking-wider"
                            >
                              <FileText size={10} />
                              View Invoice
                            </button>
                          )}
                          
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notification.isRead && (
                              <button 
                                onClick={(e) => handleMarkRead(e, notification._id)}
                                className="p-1.5 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-emerald-600 hover:border-emerald-100 shadow-sm transition-all"
                                title="Mark as read"
                              >
                                <Check size={12} />
                              </button>
                            )}
                            <button 
                              onClick={(e) => handleDelete(e, notification._id)}
                              className="p-1.5 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-rose-600 hover:border-rose-100 shadow-sm transition-all"
                              title="Delete"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Bell size={20} className="text-slate-300" />
                  </div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">No notifications yet</p>
                </div>
              )}
            </div>

            <button 
              onClick={() => {
                navigate(getRedirectPath());
                setIsOpen(false);
              }}
              className="w-full p-3 bg-slate-50 border-t border-slate-100 text-[10px] font-bold text-slate-500 hover:text-blue-600 hover:bg-white transition-all uppercase tracking-widest flex items-center justify-center gap-2"
            >
              View all notifications <ArrowRight size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
