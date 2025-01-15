
export const events = [
    {
        id: '1',
        title: 'Cumpleaños del Kakashi',
        notes: 'Hay que comprar el pastel a Kakashi',
        start: new Date('2022-10-21 13:00:00'),
        end: new Date('2022-10-21 15:00:00'),
        bgColor: '#fafafa',
    },
    {
        id: '2',
        title: 'Cumpleaños del Tanjiro',
        notes: 'Hay que comprar el pastel a Tanjiro',
        start: new Date('2022-11-09 13:00:00'),
        end: new Date('2022-11-09 15:00:00'),
        bgColor: '#fafafa',
    }
]

export const initialState = {
    isLoadingEvents: true,
   events: [],
   activeEvent: null,
}

export const calendarWithEventsState = {
    isLoadingEvents: true,
   events: [...events],
   activeEvent: null,
}

export const calendarWithActiveEventState = {
    isLoadingEvents: true,
   events: [...events],
   activeEvent: {...events[0]},
}