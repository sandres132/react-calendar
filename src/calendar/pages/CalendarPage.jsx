import { useEffect, useState } from 'react';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { CalendarEvent, CalendarModal, FabAddNew, FabDelete, NavBar } from '../';
import { getMessagesEs, localizer } from '../../helpers';
import { useUiStore, useCalendarStore, useAuthStore } from '../../hooks';

export const CalendarPage = () => {

  const { openDateModal } = useUiStore();
  const { events, setActiveEvent, startLoadingEvents } = useCalendarStore();
  const { user } = useAuthStore();

  const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'week');

  const eventStyleGetter = (event, start, end, isSelected) => {

    const isMyEvent = ( user.uid === event.user._id ) || ( user.uid === event.user.uid );
    // console.log(isMyEvent);

    const style = {}

    if ( !isSelected ) {
        style.backgroundColor = isMyEvent ? '#5F9EA0' : '#116a8b',
        style.borderRadius = '10px',
        style.opacity = 0.8,
        style.color = 'white'
  
    }else {
        style.backgroundColor = '#347CF7',
        style.borderRadius = '10px',
        style.opacity = 0.8,
        style.color = 'white'
  
    }

    return {style}
  }

  const onDoubleClick = () => {
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

  useEffect(() => {
    startLoadingEvents();
  }, [])
  

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
