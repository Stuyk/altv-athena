import { NOTIFICATION_ICON } from '@AthenaShared/enums/notificationIcons';

export interface INotification {
    notificationIcon: NOTIFICATION_ICON;
    sender: string;
    subject: string;
    message: string;
    fadeIn?: boolean;
    showInBriefing?: boolean;
}
