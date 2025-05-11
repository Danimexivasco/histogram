import { createClient } from "@/lib/supabase/client";
import { Notification } from "@/schema/notification";

const supabase = await createClient();

export class NotificationModel {
  static async getAllByUserId(to_user_id: Notification["to_user_id"]) {
    const { data, error } = await supabase.from("notifications").select("*").eq("to_user_id", to_user_id).order("created_at", {
      ascending: false
    });

    if (error) return [];

    return data;
  }

  static async create({ type, from_user_id, to_user_id }: Partial<Notification>) {
    const { data, error } = await supabase.from("notifications").insert([{
      type,
      from_user_id,
      to_user_id
    }]);

    if (error) return null;

    return data;
  }
}