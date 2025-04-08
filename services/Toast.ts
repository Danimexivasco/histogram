import{ toast } from "sonner";

export function isErrorType(error: unknown): error is Error {
  return error instanceof Error;
}

export class ToastService {
  static success(message: string) {
    toast.success(message);
  }
  static warning(message: string) {
    toast.warning(message);
  }
  static info(message: string) {
    toast.info(message);
  }
  static error(message: string) {
    toast.error(message);
  }
}