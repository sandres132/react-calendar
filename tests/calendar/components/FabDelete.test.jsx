import { fireEvent, render, screen } from "@testing-library/react"
import { FabDelete } from "../../../src/calendar/components/FabDelete"
import { useCalendarStore } from "../../../src/hooks/useCalendarStore"
import { Provider } from "react-redux";
import { store } from "../../../src/store";
import { useAuthStore } from "../../../src/hooks/useAuthStore";
import { useUiStore } from "../../../src/hooks/useUiStore";
import { testUserCredentials } from "../../fixtures/testUser";

jest.mock('../../../src/hooks/useCalendarStore');
jest.mock('../../../src/hooks/useUiStore');
jest.mock('../../../src/hooks/useAuthStore');

describe('Tests in <FabDelete/>', () => {

    const mockStartDeletingEvent = jest.fn();
    window.scrollTo = jest.fn();

    beforeEach(() => jest.clearAllMocks());

    test('should render the componet correctly', () => {

        useCalendarStore.mockReturnValue({
            hasEventSelected: false,
            activeEvent: {
                "title": "Primera nota ",
                "notes": "probando los colores",
                "start": "2025-01-14T01:46:19.031Z",
                "end": "2025-01-14T03:46:19.031Z",
                "user": {
                    "_id": "6768678",
                    "name": "Luffytaro"
                },
                "id": "123123"
            },
        });

        useAuthStore.mockReturnValue({
            user: testUserCredentials,
        })

        useUiStore.mockReturnValue({
            isDateModalOpen: false,
        })

        render(
            <Provider store={ store }>
                <FabDelete />
            </Provider>
        );
        
        const btn = screen.getByLabelText("btn-delete")
        expect( btn.classList ).toContain( "btn" );
        expect( btn.classList ).toContain( "btn-danger" );
        expect( btn.classList ).toContain( "fab-danger" );
        expect( btn.style.display ).toBe( "none" );
        
    })
    
    test('should show the button if an event is active, isDateModalOpen is false and isMyEvent is true', () => {

        useCalendarStore.mockReturnValue({
            hasEventSelected: true,
            activeEvent: {
                "title": "Primera nota ",
                "notes": "probando los colores",
                "start": "2025-01-14T01:46:19.031Z",
                "end": "2025-01-14T03:46:19.031Z",
                "user": {
                    "_id": "6786b5d6f3fab4fd20297762",
                    "name": "Test-user"
                },
                "id": "123123"
            },
        });

        useAuthStore.mockReturnValue({
            user: testUserCredentials,
        })

        useUiStore.mockReturnValue({
            isDateModalOpen: false,
        })

        render(
            <Provider store={ store }>
                <FabDelete />
            </Provider>
        );
        
        const btn = screen.getByLabelText("btn-delete")
        expect( btn.style.display ).toBe( "" );
        
    })
    
    test('should call startDeletingEvent if an event is active, isDateModalOpen is false and isMyEvent is true', () => {

        useCalendarStore.mockReturnValue({
            activeEvent: {
                "title": "Primera nota ",
                "notes": "probando los colores",
                "start": "2025-01-14T01:46:19.031Z",
                "end": "2025-01-14T03:46:19.031Z",
                "user": {
                    "_id": "6786b5d6f3fab4fd20297762",
                    "name": "Test-user"
                },
                "id": "123123"
            },
            hasEventSelected: true,
            startDeletingEvent: mockStartDeletingEvent
        });

        useAuthStore.mockReturnValue({
            user: testUserCredentials,
        })

        useUiStore.mockReturnValue({
            isDateModalOpen: false,
        })

        render(
            <Provider store={ store }>
                <FabDelete />
            </Provider>
        );
        
        const btn = screen.getByLabelText("btn-delete")
        fireEvent.click(btn);

        const btnConfirm = screen.getByLabelText("borrar");
        fireEvent.click(btnConfirm)

        // TODO: averiguar porque al confirmar el boton de borrar del sweetalert no llama a la funcion startDeletingEvent

        expect( mockStartDeletingEvent ).toHaveBeenCalledWith();
        
    })
})