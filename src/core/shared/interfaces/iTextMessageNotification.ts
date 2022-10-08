import { NOTIFICATION_ICON } from '../enums/notificationIcon';

export interface ITextMessageNotification {
    notificationIcon: NOTIFICATION_ICON;
    sender: string;
    subject: string;
    message: string;
    fadeIn?: boolean;
    showInBriefing?: boolean;
}
