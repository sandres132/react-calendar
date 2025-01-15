import { render, screen } from "@testing-library/react";
import { useAuthStore } from "../../src/hooks/useAuthStore";
import { AppRouter } from "../../src/router/AppRouter";
import { MemoryRouter } from "react-router-dom";
import { CalendarPage } from "../../src/calendar/pages/CalendarPage";

jest.mock("../../src/hooks/useAuthStore")
const mockCheckAuthToken = jest.fn();
jest.mock("../../src/calendar/pages/CalendarPage", () => ({
    CalendarPage: () => <h1>Calendar Page</h1>
}))

describe('Tests in <AppRouter/>', () => {

    beforeEach(() => jest.clearAllMocks());

    test('should render loading screen and call checkAuthToken', () => {

        useAuthStore.mockReturnValue({
            status: "checking",
            checkAuthToken: mockCheckAuthToken,
        })

        render(<AppRouter />);

        expect( screen.getByText("Cargando...") ).toBeTruthy();
        expect( mockCheckAuthToken ).toHaveBeenCalled();

    })

    test('should render login if status not-authenticated', () => {

        useAuthStore.mockReturnValue({
            status: "not-authenticated",
            checkAuthToken: mockCheckAuthToken,
        })

        render(
            <MemoryRouter initialEntries={['/calendar']}>
                <AppRouter />
            </MemoryRouter>
        );

        expect( screen.getByText("Ingreso")).toBeTruthy();
    })

    test('should render calendar if is authenticated', () => {

        useAuthStore.mockReturnValue({
            status: "authenticated",
            checkAuthToken: mockCheckAuthToken,
        })

        render(
            <MemoryRouter>
                <AppRouter />
            </MemoryRouter>
        );

        expect( screen.getByText("Calendar Page")).toBeTruthy();

    })
})