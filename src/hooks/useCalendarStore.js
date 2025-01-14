import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store";
import calendarApi from "../api/calendarApi";
import { convertEventsToDatesEvents } from "../helpers";
import Swal from "sweetalert2";

export const useCalendarStore = () => {

    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector( state => state.calendar );
    const { user } = useSelector( state => state.auth );

    const setActiveEvent = ( calendarEvent ) => {
        dispatch( onSetActiveEvent( calendarEvent ) )
    }

    const startSavingEvent = async( calendarEvent ) => {

        try {
            if( calendarEvent.id ){
                //actualizacion
                await calendarApi.put( `/events/${calendarEvent.id}`, calendarEvent );
                dispatch( onUpdateEvent({ ...calendarEvent, user }) );
                Swal.fire('Nota Modificada!', 'La nota ha sido modificada con exito', 'success')
                return;
            }
    
            //creando
            const {data} = await calendarApi.post('/events', calendarEvent);
            dispatch( onAddNewEvent({...calendarEvent, id: data.evento.id, user}) );
            Swal.fire('Nota Creada!', 'La nota ha sido creada con exito', 'success')

        } catch (error) {
            // console.log(error);
            Swal.fire( "Error al guardar", error.response.data.msg, 'error' );
        }
    }

    const startDeletingEvent = async() => {
        // Todo: Llegar al backend
        try {
            await calendarApi.delete(`/events/${ activeEvent.id }` );
            dispatch( onDeleteEvent() );
            Swal.fire('Nota Borrada!', 'La nota ha sido borrada con exito', 'success')
        } catch (error) {
            Swal.fire('Error al eliminar', error.response.data.msg, 'error');
        }
    }

    const startLoadingEvents = async() => {
        try {

            const { data } = await calendarApi.get("/events");
            const events = convertEventsToDatesEvents( data.eventos );
            
            dispatch( onLoadEvents( events ) );
            
        } catch (error) {
            console.log(error.message);
            
        }
    }

    return {
        //* Propiedades
        events,
        activeEvent,
        hasEventSelected: !!activeEvent,

        //*Metodos
        setActiveEvent,
        startSavingEvent,
        startDeletingEvent,
        startLoadingEvents,
    }
}