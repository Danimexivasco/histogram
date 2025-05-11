import { NotificationModel } from "@/models/supabase/Notification";
import { Notification } from "@/schema/notification";

export class NotificationService {
  static async getAllByUserId(to_user_id: Notification["to_user_id"]) {
    const notifications: Notification[] = await NotificationModel.getAllByUserId(to_user_id);

    if (!notifications) throw new Error("Error getting notifications");

    return notifications;
  }

  static async create({ type, from_user_id, to_user_id }: Partial<Notification>) {
    const notification = await NotificationModel.create({
      type,
      from_user_id,
      to_user_id
    });

    if (!notification) throw new Error("Error creating notification");

    return notification;
  }
}