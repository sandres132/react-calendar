import calendarApi from "../../src/api/calendarApi"

describe('Pruebas en en el CalendarApi', () => {

    test('should have the default configuration', () => {
        expect(calendarApi.defaults.baseURL).toBe( process.env.VITE_API_URL )
    });

    test("should have x-token in header of all requests", async() => {
        const token = "ABC-123-XYZ";
        localStorage.setItem( "token", token );
        const res = await calendarApi.get( "/auth" );
        // console.log( "res", res );
        
        expect( res.config.headers[ "x-token" ] ).toBe(token)
    });
})