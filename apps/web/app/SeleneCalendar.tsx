'use client';
import FullCalendar, { useCalendarController } from "@fullcalendar/react";
import themePlugin from "@fullcalendar/react/themes/monarch"; // YOUR THEME
import dayGridPlugin from "@fullcalendar/react/daygrid";

import '@fullcalendar/react/skeleton.css'; // ALWAYS NEED SKELETON
import '@fullcalendar/react/themes/monarch/theme.css'; // YOUR THEME
import '@fullcalendar/react/themes/monarch/palettes/purple.css';
import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';

interface SimpleEventClickArg {
  event: {
    title: string;
    extendedProps: {
      description?: string;
    };
  };
}

interface SeleneCalendarProps {
  events: any[];
  onEventClick?: (info: SimpleEventClickArg) => void;
}

export function SeleneCalendar({ events, onEventClick }: SeleneCalendarProps) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={events}
      eventClick={onEventClick} 
    />
  );
}

