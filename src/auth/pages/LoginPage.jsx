
import { useEffect } from 'react';
import { useAuthStore, useForm } from '../../hooks';
import './loginPage.css';
import Swal from 'sweetalert2';

const loginFormFields = {
    loginEmail: '',
    loginPassword: ''
}

const registerFormFields = {
    registerName: '',
    registerEmail: '',
    registerPassword: '',
    registerPassword2: '',
}

export const LoginPage = () => {

    const { startLogin, startRegister, errorMessage } = useAuthStore();

    const { loginEmail, loginPassword, onInputChange:onInputLoginChange } = useForm( loginFormFields );
    const { registerName, registerEmail, registerPassword, registerPassword2, onInputChange:onInputRegisterChange } = useForm( registerFormFields );

    const onLoginSubmit = (event) => {
        event.preventDefault();
        startLogin({email:loginEmail, password:loginPassword});
        
    }
    
    const onRegisterSubmit = (event) => {
        event.preventDefault();

        if (registerPassword !== registerPassword2) {
            Swal.fire("Error en registro", "Las contraseñas no coinciden", 'error');
            return;
        }

        if ((registerPassword.length || registerPassword2.length ) < 8 ) {
            Swal.fire("Error en registro", "Las contraseñas deben contener 8 o más caracteres", 'error');
            return;
        }

        startRegister({name: registerName, email: registerEmail, password: registerPassword});
        
    }

    useEffect(() => {
      if (errorMessage !== undefined) {
        Swal.fire("Error en el formulario", errorMessage, 'error');
      }
    
    }, [errorMessage])
    
    
  return (
      <div className="container login-container">
          <div className="row">
              <div className="col-md-6 login-form-1">
                  <h3>Ingreso</h3>
                  <form onSubmit={onLoginSubmit}>
                      <div className="form-group mb-2">
                          <input 
                              type="text"
                              className="form-control"
                              placeholder="Correo"
                              name="loginEmail"
                              value={loginEmail}
                              onChange={onInputLoginChange}
                          />
                      </div>
                      <div className="form-group mb-2">
                          <input
                              type="password"
                              className="form-control"
                              placeholder="Contraseña"
                              name="loginPassword"
                              value={loginPassword}
                              onChange={onInputLoginChange}
                          />
                      </div>
                      <div className="d-grid gap-2">
                          <input 
                              type="submit"
                              className="btnSubmit"
                              value="Login" 
                          />
                      </div>
                  </form>
              </div>

              <div className="col-md-6 login-form-2">
                  <h3>Registro</h3>
                  <form onSubmit={onRegisterSubmit}>
                      <div className="form-group mb-2">
                          <input
                              type="text"
                              className="form-control"
                              placeholder="Nombre"
                              name="registerName"
                              value={registerName}
                              onChange={onInputRegisterChange}
                          />
                      </div>
                      <div className="form-group mb-2">
                          <input
                              type="email"
                              className="form-control"
                              placeholder="Correo"
                              name="registerEmail"
                              value={registerEmail}
                              onChange={onInputRegisterChange}
                          />
                      </div>
                      <div className="form-group mb-2">
                          <input
                              type="password"
                              className="form-control"
                              placeholder="Contraseña"
                              name="registerPassword"
                              value={registerPassword}
                              onChange={onInputRegisterChange}
                          />
                      </div>

                      <div className="form-group mb-2">
                          <input
                              type="password"
                              className="form-control"
                              placeholder="Repita la contraseña"
                              name="registerPassword2"
                              value={registerPassword2}
                              onChange={onInputRegisterChange}
                          />
                      </div>

                      <div className="d-grid gap-2">
                          <input 
                              type="submit" 
                              className="btnSubmit" 
                              value="Crear cuenta" />
                      </div>
                  </form>
              </div>
          </div>
      </div>
  )
}