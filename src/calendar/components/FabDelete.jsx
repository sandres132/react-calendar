import React from 'react'
import { useCalendarStore, useUiStore } from '../../hooks'
import Swal from 'sweetalert2';

export const FabDelete = () => {

    const { startDeletingEvent, hasEventSelected } = useCalendarStore();
    const { isDateModalOpen } = useUiStore();

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
                Swal.fire('Nota Borrada!', 'La nota ha sido borrada con exito', 'success')
      
            }if (result.isDenied) {
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
                display: (hasEventSelected && !isDateModalOpen) ? '' : 'none'
            }}
        >
            <i className='fas fa-trash-alt'></i>
        </button>
    </>
  )
}
