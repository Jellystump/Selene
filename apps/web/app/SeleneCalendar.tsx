'use client';
import FullCalendar, { useCalendarController } from "@fullcalendar/react";
import themePlugin from "@fullcalendar/react/themes/pulse"; 
import dayGridPlugin from "@fullcalendar/react/daygrid";

import '@fullcalendar/react/skeleton.css'; 
import '@fullcalendar/react/themes/pulse/theme.css'; 
import '@fullcalendar/react/themes/pulse/palettes/blue.css';


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
      colorScheme='dark'
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
