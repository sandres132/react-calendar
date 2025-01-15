import { renderHook } from "@testing-library/react"
import { useUiStore } from "../../src/hooks"
import { Provider } from "react-redux"
import { uiSlice } from "../../src/store"
import { configureStore } from "@reduxjs/toolkit"
import { act } from "react"

const getMockStore = ( initialState ) => {
    return configureStore({
        reducer: {
            ui: uiSlice.reducer,
        },
        preloadedState: {
            ui: { ...initialState }
        }
    })
}

describe('Tests in useUiStore', () => {

    test('should return default values', () => {

        const mockStore = getMockStore( { isDateModalOpen: false} );
        const { result } = renderHook(() => useUiStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{children}</Provider>
        })

        expect( result.current ).toEqual({
            isDateModalOpen: false,
            closeDateModal: expect.any(Function),
            openDateModal: expect.any(Function),
            toggleDateModal: expect.any(Function),
        })

    });

    test("openDateModal should set isDateModalOpen to true", () => {

        const mockStore = getMockStore( { isDateModalOpen: false} );
        const { result } = renderHook(() => useUiStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{children}</Provider>
        })

        const { openDateModal } = result.current;

        act(() => {
            openDateModal();
        });

        expect( result.current.isDateModalOpen ).toBeTruthy();
    })

    test("closeDateModal should set isDateModalOpen to false", () => {

        const mockStore = getMockStore( { isDateModalOpen: true} );
        const { result } = renderHook(() => useUiStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{children}</Provider>
        })

        const { closeDateModal } = result.current;

        act(() => {
            closeDateModal();
        });

        expect( result.current.isDateModalOpen ).toBeFalsy();
    })

    test("toggleDateModal should change isDateModalOpen state", () => {

        const mockStore = getMockStore( { isDateModalOpen: true} );
        const { result } = renderHook(() => useUiStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{children}</Provider>
        })

        // Otra forma de hacerlo sin crear la constante que viene del result.current
        act(() => {
            result.current.toggleDateModal();
        });

        expect( result.current.isDateModalOpen ).toBeFalsy();
    })
})