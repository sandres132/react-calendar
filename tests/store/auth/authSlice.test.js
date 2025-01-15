import { authSlice, clearErrorMessage, onLogin, onLogout } from "../../../src/store/auth/authSlice";
import { authenticatedState, initialState } from "../../fixtures/authStates";
import { testUserCredentials } from "../../fixtures/testUser";

describe('Tests in authSlice', () => {

    test("should return initial state", () => {

        expect( authSlice.getInitialState() ).toEqual( initialState )
    });

    test("should login", () => {
        
        const state = authSlice.reducer( initialState, onLogin(testUserCredentials) );
        expect( state ).toEqual({
            status: "authenticated",
            user: testUserCredentials,
            errorMessage: undefined
        })
    })

    test("should logout without payload", () => {
        
        const state = authSlice.reducer( authenticatedState, onLogout() );
        expect( state ).toEqual({
            status: "not-authenticated",
            user: {},
            errorMessage: undefined
        });
    });

    test("should logout with payload", () => {
        
        const msg = "error de prueba";
        const state = authSlice.reducer( authenticatedState, onLogout(msg) );
        expect( state ).toEqual({
            status: "not-authenticated",
            user: {},
            errorMessage: msg
        });
    });

    test('should clear error message', () => {

        const msg = "error de prueba";
        const state = authSlice.reducer( initialState, onLogout(msg))
        const newState = authSlice.reducer( state, clearErrorMessage())

        expect( newState.errorMessage ).toBe(undefined)

    })
})