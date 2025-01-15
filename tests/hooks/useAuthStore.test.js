import { configureStore } from "@reduxjs/toolkit"
import { authSlice } from "../../src/store"
import { renderHook, waitFor } from "@testing-library/react"
import { useAuthStore } from "../../src/hooks"
import { Provider } from "react-redux"
import { initialState, notAuthenticatedState } from "../fixtures/authStates"
import { act } from "react"
import { testUserCredentials } from "../fixtures/testUser"
import { calendarApi } from "../../src/api"

const getMockStore = ( initialState ) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer,
        },
        preloadedState: {
            auth: { ...initialState }
        }
    })
}

describe('Tests in useAuthStore', () => {

    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    })
    
    test('should return default values', () => {

        const mockStore = getMockStore( { status: 'checking', user: {}, errorMessage: undefined } );
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{children}</Provider>
        })

        expect( result.current ).toEqual({
            status: 'checking',
            user: expect.any(Object),
            errorMessage: undefined,
            checkAuthToken: expect.any(Function),
            startRegister: expect.any(Function),
            startLogin: expect.any(Function),
            startLogout: expect.any(Function),
        })
    });

    test('startLogin should login correctly', async() => {

        const mockStore = getMockStore( { ...notAuthenticatedState } );
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{children}</Provider>
        })

        await act(async() => {
            await result.current.startLogin( testUserCredentials )
        })

        const { errorMessage, status, user } = result.current;
        expect( { errorMessage, status, user } ).toEqual({
            errorMessage: undefined,
            status: "authenticated",
            user: { name: 'Test-user', uid: '6786b5d6f3fab4fd20297762'}
        });

        expect( localStorage.getItem( "token" ) ).toEqual( expect.any( String ) );
        expect( localStorage.getItem( "token-init-date" ) ).toEqual( expect.any( String ) );

    })

    test('startLogin should fail authentication', async() => {

        const mockStore = getMockStore( { ...notAuthenticatedState } );
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{children}</Provider>
        })

        await act(async() => {
            await result.current.startLogin( { email: "algo@google.com", password: "12345678" } )
        })

        const { errorMessage, status, user } = result.current;
        
        expect( localStorage.getItem( "token" ) ).toBe( null );
        expect( localStorage.getItem( "token-init-date" ) ).toBe( null );
        expect( { errorMessage, status, user } ).toEqual({
            errorMessage: expect.any(String),
            status: "not-authenticated",
            user: {}
        });

        waitFor(
            () => expect( result.current.errorMessage ).toBe( undefined )
        )
    })

    test('startRegister should create a user', async() => {

        const newUser = { email: "algo@google.com", password: "12345678", name: "Test-user2" }

        const mockStore = getMockStore( { ...notAuthenticatedState } );
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{children}</Provider>
        })

        // Para evitar que haga la request post y solo la simule para el nuevo usuario
        const spy = jest.spyOn( calendarApi, 'post').mockReturnValue({
            data: {
                ok: true,
                uid: "algun-id",
                name: "Test-user2",
                token: "algun-token"
            }
        })

        await act(async() => {
            await result.current.startRegister( newUser )
        })

        const { errorMessage, status, user } = result.current;
        expect( { errorMessage, status, user } ).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: "Test-user2", uid: "algun-id" }
        });

        spy.mockRestore();
    })

    test('startRegister should fail creating user', async() => {

        const mockStore = getMockStore( { ...notAuthenticatedState } );
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{children}</Provider>
        })

        await act(async() => {
            await result.current.startRegister( testUserCredentials )
        })

        const { errorMessage, status, user } = result.current;
        expect( { errorMessage, status, user } ).toEqual({
            errorMessage: "Ya existe un usuario con ese email",
            status: "not-authenticated",
            user: {},
        });

    })

    test('checkAuthToken should fail if there is not a token', async() => {

        const mockStore = getMockStore( { ...initialState } );
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{children}</Provider>
        })

        await act(async() => {
            await result.current.checkAuthToken()
        })

        const { errorMessage, status, user } = result.current;
        expect( { errorMessage, status, user } ).toEqual({
            errorMessage: undefined,
            status: "not-authenticated",
            user: {},
        });
    })

    test('checkAuthToken should authenticate user if there is a token', async() => {

        const { data } = await calendarApi.post( '/auth', testUserCredentials );
        localStorage.setItem( "token", data.token );

        const mockStore = getMockStore( { ...initialState } );
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{children}</Provider>
        })

        await act(async() => {
            await result.current.checkAuthToken()
        })

        const { errorMessage, status, user } = result.current;
        expect( { errorMessage, status, user } ).toEqual({
            errorMessage: undefined,
            status: "authenticated",
            user: { name: "Test-user", uid: "6786b5d6f3fab4fd20297762" },
        });
    })

})