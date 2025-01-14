
export const CalendarEvent = (event) => {
    // console.log("evento a calendarEvent", event.event.title);
    
    const { title, user } = event.event;
    
    return (
        <>
            <strong>{ title }</strong>
            <span> - { user.name }</span>
        </>
    )
}
