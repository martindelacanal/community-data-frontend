export interface ViewNotification {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  message: string;
  creation_date: string;
  notifications: {notification_id: number, user_id: string, message: string, creation_date: string}[];
}
