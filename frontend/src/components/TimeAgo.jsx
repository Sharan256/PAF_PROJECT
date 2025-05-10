import React from "react";
import { formatDistanceToNow, parse, isValid } from "date-fns";
import { enUS } from "date-fns/locale";

// TimeAgo component takes a date prop and displays a relative time (e.g., "5 minutes ago")
const TimeAgo = ({ date }) => {
  if (!date) return null;

  let parsedDate;
  try {
    // Try parsing as ISO string first
    parsedDate = new Date(date);
    
    // If not valid, try parsing with the specific format
    if (!isValid(parsedDate)) {
      parsedDate = parse(date, "EEE MMM dd HH:mm:ss 'IST' yyyy", new Date(), {
        locale: enUS,
      });
    }

    // If still not valid, return null
    if (!isValid(parsedDate)) {
      console.warn('Invalid date format:', date);
      return null;
    }

    return (
      <span className="text-gray-500 text-xs">
        {formatDistanceToNow(parsedDate, { addSuffix: true, locale: enUS })}
      </span>
    );
  } catch (error) {
    console.warn('Error parsing date:', error);
    return null;
  }
};

export default TimeAgo;
