import React from "react";
import { formatDistanceToNow, parse } from "date-fns";
import { enUS } from "date-fns/locale";

const TimeAgo = ({ date }) => {
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
