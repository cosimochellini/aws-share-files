import mitt from 'mitt';
import { device } from '../services/device.service';
import { retrieveError } from '../utils/retrieveError';

const dialogEmitter = mitt<Record<notificationActions, notificationData>>();

export enum notificationType {
  success = 'success',
  info = 'info',
  warning = 'warning',
  error = 'error',
}

enum notificationActions {
  show = 'show',
}

export type notificationData = {
  type: notificationType;
  message: string;
};

export const notification = {
  show: (type: notificationType, message: string) => {
    dialogEmitter.emit(notificationActions.show, { type, message });
  },

  success: (message: string) => {
    notification.show(notificationType.success, message);
  },

  info: (message: string) => {
    notification.show(notificationType.info, message);
  },

  warning: (message: string) => {
    notification.show(notificationType.warning, message);
  },

  error: (message: unknown) => {
    // keeping console.error for backwards compatibility
    // and to log errors to the server
    console.error(message);

    const errorMessage = retrieveError(message);

    device.runOnClient(() => notification.show(notificationType.error, errorMessage));
  },

  onShow: (callback: (data: notificationData) => void) => {
    dialogEmitter.on(notificationActions.show, callback);
  },
};
