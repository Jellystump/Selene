'use client';
import FullCalendar, { useCalendarController } from "@fullcalendar/react";
import themePlugin from "@fullcalendar/react/themes/monarch"; // YOUR THEME
import dayGridPlugin from "@fullcalendar/react/daygrid";

import '@fullcalendar/react/skeleton.css'; // ALWAYS NEED SKELETON
import '@fullcalendar/react/themes/monarch/theme.css'; // YOUR THEME
import '@fullcalendar/react/themes/monarch/palettes/purple.css';


export function SeleneCalendar(){
    const controller = useCalendarController();
    const buttons = controller.getButtonState();
    return(
        <FullCalendar
        headerToolbar={{
            left: 'prev',
            center: 'title',
            right: 'next',
        }}
        plugins={[ themePlugin, dayGridPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        />
    );
};