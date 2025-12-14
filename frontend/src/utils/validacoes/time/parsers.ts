import { APP_TIMEZONE } from "../date/parsers";
import { format, toZonedTime, fromZonedTime } from "date-fns-tz";

export const timeUtcToLocal = (timeStr?: string | Date | null): string => {
  if (!timeStr) return "";

  let date: Date;

  if (typeof timeStr === "string") {
    const [hours, minutes] = timeStr.split(":").map(Number);
    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      return "";
    }

    date = new Date(Date.UTC(1970, 0, 1, hours, minutes));
  } else {
    date = timeStr;
  }

  const zoned = toZonedTime(date, APP_TIMEZONE);
  return format(zoned, "HH:mm");
};

export const timeLocalToUtc = (timeStr?: string | null): string | undefined => {
  if (!timeStr) return undefined;

  const [hours, minutes] = timeStr.split(":").map(Number);
  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return undefined;
  }

  const localDate = new Date(Date.UTC(1970, 0, 1, hours, minutes));

  const utcDate = fromZonedTime(localDate, APP_TIMEZONE);

  return format(utcDate, "HH:mm", { timeZone: "UTC" });
};
