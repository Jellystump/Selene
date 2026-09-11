'use client';
import FullCalendar, { useCalendarController } from "@fullcalendar/react";
import themePlugin from "@fullcalendar/react/themes/monarch"; // YOUR THEME
import dayGridPlugin from "@fullcalendar/react/daygrid";

import '@fullcalendar/react/skeleton.css'; // ALWAYS NEED SKELETON
import '@fullcalendar/react/themes/monarch/theme.css'; // YOUR THEME
import '@fullcalendar/react/themes/monarch/palettes/purple.css';


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
      plugins={[dayGridPlugin, themePlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: 'prev today',
        center: 'title',
        right: 'next',
      }}
      events={events}
      eventClick={onEventClick}
    />
  );
}
