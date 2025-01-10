import React, { useState } from 'react';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { CalendarEvent, CalendarModal, FabAddNew, FabDelete, NavBar } from '../';
import { getMessagesEs, localizer } from '../../helpers';
import { useUiStore, useCalendarStore } from '../../hooks';

export const CalendarPage = () => {

  const { openDateModal } = useUiStore();
  const { events, setActiveEvent } = useCalendarStore();

  const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'week');

  const eventStyleGetter = (event, start, end, isSelected) => {
    
    const style = {
      backgroundColor: '',
      borderRadius: '',
      opacity: 0,
      color: ''
    };
    if ( isSelected !== false ) {
        style.backgroundColor = '#347CF7',
        style.borderRadius = '0px',
        style.opacity = 0.8,
        style.color = 'white'
  
    }else {
        style.backgroundColor = '#5F9EA0',
        style.borderRadius = '0px',
        style.opacity = 0.8,
        style.color = 'white'
  
    }

    return {style}
  }

  const onDoubleClick = (event) => {
    openDateModal();
  }
  
  const onSelect = (event) => {
    // console.log({ click: event });
    setActiveEvent(event)

  }

  const onViewChanged = (event) => {
    localStorage.setItem('lastView', event);
    setLastView( event )

  }

  return (
    <>
      <NavBar/>

      <Calendar
        culture='es'
        localizer={ localizer }
        events={ events }
        defaultView={ lastView }
        startAccessor="start"
        endAccessor="end"
        style={{
          height: 'calc( 100vh - 80px )' 
        }}
        messages={getMessagesEs()}
        eventPropGetter={ eventStyleGetter }
        components={{
          event: CalendarEvent
        }}
        onDoubleClickEvent={ onDoubleClick }
        onSelectEvent={ onSelect }
        onView={ onViewChanged }
      />
      <CalendarModal/>
      <FabAddNew/>
      <FabDelete/>
    </>
  )
}
