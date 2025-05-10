import React from "react";
import { formatDistanceToNow, parse } from "date-fns";
import { enUS } from "date-fns/locale";

// TimeAgo component takes a date prop and displays a relative time (e.g., "5 minutes ago")
const TimeAgo = ({ date }) => {

  // Parsing the input date string to a JavaScript Date object.
  // The format string must match the input format exactly.
  const parsedDate = parse(date, "EEE MMM dd HH:mm:ss 'IST' yyyy", new Date(), {
    locale: enUS,
  });

  return (
    <span className="text-gray-500 text-xs">
      {formatDistanceToNow(parsedDate, { addSuffix: true, locale: enUS })}
    </span>
  );
};

export default TimeAgo;
