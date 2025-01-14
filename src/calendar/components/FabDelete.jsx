import { useAuthStore, useCalendarStore, useUiStore } from '../../hooks'
import Swal from 'sweetalert2';

export const FabDelete = () => {

    const { startDeletingEvent, hasEventSelected, activeEvent } = useCalendarStore();
    const { isDateModalOpen } = useUiStore();
    const { user } = useAuthStore();

    let isMyEvent = false;
    
    if(activeEvent !== null) {
        isMyEvent = ( user.uid === activeEvent.user._id ) || ( user.uid === activeEvent.user.uid );
    }
    
    const handleDelete = () => {
        Swal.fire({
            title: 'Borrar Nota',
            text: '¿Desea BORRAR la nota?',
            icon: 'question',
            showDenyButton: true,
            confirmButtonText: 'Borrar',
            confirmButtonColor: '#d33',
            denyButtonColor: '#808080',
            denyButtonText: `Cancelar`,
       }).then((result) => {
            if (result.isConfirmed) {
                startDeletingEvent();
            }else if (result.isDenied) {
                Swal.fire('La nota no ha sido borrada', '', 'info')
            }else{
                Swal.fire('La nota no ha sido borrada', '', 'info')
            }
       });
    }

  return (
    <>
        <button
            className='btn btn-danger fab-danger'
            onClick={ handleDelete }
            style={{
                display: (hasEventSelected && !isDateModalOpen && isMyEvent) ? '' : 'none'
            }}
        >
            <i className='fas fa-trash-alt'></i>
        </button>
    </>
  )
}
