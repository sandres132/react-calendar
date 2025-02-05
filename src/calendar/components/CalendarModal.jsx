import { useEffect, useMemo, useState } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker';
import Modal from 'react-modal'
import Swal from 'sweetalert2';

import { addHours, differenceInSeconds } from 'date-fns';

import "sweetalert2/dist/sweetalert2.min.css";
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale';
import { useUiStore } from '../../hooks/useUiStore';
import { useAuthStore, useCalendarStore } from '../../hooks';
import { getEnvVariables } from '../../helpers';

registerLocale('es', es);

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
};

if( getEnvVariables().VITE_MODE !== "test" ) {
    Modal.setAppElement('#root');
}

export const CalendarModal = () => {

    const { isDateModalOpen, closeDateModal } = useUiStore();
    const { activeEvent, startSavingEvent } = useCalendarStore();
    const { user } = useAuthStore();
    
    let isMyEvent = false;
    
    if(activeEvent !== null) {
        const value = ( user.uid === activeEvent.user._id ) || ( user.uid === activeEvent.user.uid );
        isMyEvent = !value;
    }
    

    const [formSubmitted, setFormSubmitted] = useState(false);
    const today = new Date().getTime();

    const [formValues, setFormValues] = useState({
        title: '',
        notes: '',
        start: new Date(),
        end: addHours(new Date(), 2),
    });

    const titleClass = useMemo(() => {
        if( !formSubmitted ) return '';
        return ( formValues.title.length >= 2)
            ? ''
            : 'is-invalid'
            //  Swal.fire('Titulo Requerido', 'El titulo no puede ser menor a dos caracteres o estar vacio', 'error')
    }, [ formValues.title, formSubmitted ]);

    useEffect(() => {
      if ( activeEvent !== null ){
        setFormValues({ ...activeEvent });
      }
    
    }, [ activeEvent ])
    

    const onInputChanged = ({target}) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value
        })
    }

    const onDateChange = ( event, changing ) => {
        setFormValues({
            ...formValues,
            [changing]: event
        })
    }

    const onCloseModal = () => {
        closeDateModal();
    }

    const onSubmit = async(event) => {
        event.preventDefault();
        setFormSubmitted(true);

        const difference = differenceInSeconds(formValues.end, formValues.start);

        if( isNaN(difference) || difference <= 0 ) {
            Swal.fire('Fechas Incorrectas', 'Revisar las fechas ingresadas', 'error')
            return;
        }

        if (formValues.title.length <= 0) return;

        await startSavingEvent( formValues );
        closeDateModal();
        setFormSubmitted(false);
    }

  return (
    <Modal
        isOpen={isDateModalOpen}
        onRequestClose={onCloseModal}
        style={customStyles}
        className='modal'
        overlayClassName='modal-fondo'
        closeTimeoutMS={200}
    >
        <h1> Evento </h1>
        <hr />
        <form className="container" onSubmit={onSubmit}>

            <div className="form-group mb-2">
                <label className='p-2'>Fecha y hora inicio</label>
                <DatePicker
                    minDate={ today }
                    selected={formValues.start}
                    className= 'form-control'
                    onChange={(event) => onDateChange(event, 'start')}
                    dateFormat='Pp'
                    showTimeSelect
                    locale='es'
                    timeCaption='Hora'
                    disabled={isMyEvent}
                />
            </div>

            <div className="form-group mb-2">
                <label className='p-2'>Fecha y hora fin</label>
                <DatePicker
                    minDate={ formValues.start }
                    selected={formValues.end}
                    className='form-control'
                    onChange={(event) => onDateChange(event, 'end')}
                    dateFormat='Pp'
                    showTimeSelect
                    locale='es'
                    timeCaption='Hora'
                    disabled={isMyEvent}
                />
            </div>

            <hr />
            <div className="form-group mb-2">
                <label>Titulo y notas</label>
                <input 
                    type="text" 
                    className={`form-control ${titleClass}`}
                    placeholder="Título del evento"
                    name="title"
                    autoComplete="off"
                    value={formValues.title}
                    onChange={onInputChanged}
                    disabled={isMyEvent}
                />
                <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
            </div>

            <div className="form-group mb-2">
                <textarea 
                    type="text" 
                    className="form-control"
                    placeholder="Notas"
                    rows="5"
                    name="notes"
                    value={formValues.notes}
                    onChange={onInputChanged}
                    disabled={isMyEvent}
                ></textarea>
                <small id="emailHelp" className="form-text text-muted">Información adicional</small>
            </div>

            <button
                type="submit"
                className="btn btn-outline-primary btn-block"
                style={{
                    display: !isMyEvent ? '' : 'none'
                }}
            >
                <i className="far fa-save"></i>
                <span> Guardar</span>
            </button>

        </form>

    </Modal>
  )
}
