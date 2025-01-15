import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from "../../../src/store/calendar/calendarSlice"
import { calendarWithActiveEventState, calendarWithEventsState, events, initialState } from "../../fixtures/calendarStates";

describe('Tests in claendarSlice', () => {

    test('should return dafault state', () => {

        const state = calendarSlice.getInitialState();
        expect(state).toEqual(initialState)
    });

    test('onSetActiveEvent should activate the event', () => {

        const state = calendarSlice.reducer( calendarWithEventsState, onSetActiveEvent( events[0] ) );
        expect(state.activeEvent).toEqual(events[0]);
    });

    test('onAddNewEvent should add the event', () => {

        const newEvent = {
            id: '3',
            title: 'Cumpleaños del Momonuske',
            notes: 'Hay que comprar el pastel a Momonuske',
            start: new Date('2022-02-12 13:00:00'),
            end: new Date('2022-02-12 15:00:00'),
            bgColor: '#fafafa',
        }

        const state = calendarSlice.reducer( calendarWithEventsState, onAddNewEvent( newEvent ) );
        expect(state.events ).toEqual( [...events, newEvent ] );
    })

    test('onUpdateEvent should update the event', () => {

        const updatedEvent = {
            id: '1',
            title: 'Cumpleaños del Kakashi',
            notes: 'Hay que comprar el pastel a Kakashi antes q sea tarde',
            start: new Date('2022-02-12 13:00:00'),
            end: new Date('2022-02-12 15:00:00'),
            bgColor: '#fafafa',
        }

        const state = calendarSlice.reducer( calendarWithEventsState, onUpdateEvent( updatedEvent ) );
        expect( state.events ).toContain( updatedEvent );
    });

    

    test('onDeleteEvent should delete the activeEvent', () => {

        // const newEvent = {
        //     id: '3',
        //     title: 'Cumpleaños del Momonuske',
        //     notes: 'Hay que comprar el pastel a Momonuske',
        //     start: new Date('2022-02-12 13:00:00'),
        //     end: new Date('2022-02-12 15:00:00'),
        //     bgColor: '#fafafa',
        // }

        // const state = calendarSlice.reducer( calendarWithEventsState, onAddNewEvent( newEvent ) );
        // const state2 = calendarSlice.reducer( state, onSetActiveEvent( state.events[2] ) );
        // const state3 = calendarSlice.reducer( state2, onDeleteEvent() );

        // expect(state3.events.length ).toBe(2)

        const state = calendarSlice.reducer( calendarWithActiveEventState, onDeleteEvent() );
        expect( state.activeEvent ).toBe(null);
        expect( state.events ).not.toContain( events[0] );

        
    });
    
    test('onLoadEvents should set the events', () => {

        const state = calendarSlice.reducer( initialState, onLoadEvents(events) );
        // expect( state.events.length ).toBe( 2 );
        expect( state.events ).toHaveLength( 2 );

        const newState = calendarSlice.reducer( state, onLoadEvents(events) );
        expect( newState.events.length ).toBe( events.length );
    });

    test('onLogoutCalendar should clear the state', () => {

        const state = calendarSlice.reducer( calendarWithActiveEventState, onLogoutCalendar() );
        expect( state ).toEqual( initialState );
    });
    
})