import { loginWithEmailAndPassword, logoutFirebase, registerUserWithEmailPassword, singInWithGoogle } from "../../firebase/providers";
import { checkingCredentials, login, logout } from "./authSlice"
//Acciones asíncronas
// La función a continuación se llama thunk y nos permite realizar una lógica asíncrona.
// con la función `dispatch` como primer argumento. asíncrono
// Entonces se puede ejecutar el código y se pueden enviar otras acciones

export const checkingAuthentication = ( email, password ) => {
    return async( dispatch ) => {
        dispatch( checkingCredentials() );
    }
}

//inicio de una tarea asíncrona
export const startGoogleSignIn = ( email, password ) => {
    return async( dispatch ) => {
        dispatch( checkingCredentials() );

        //resultado de registrarse con Google
        const result = await singInWithGoogle();
        const { uid, displayName, photoURL } = result;

        if ( !result.default ) return dispatch( logout( result.errorMessage) )

        dispatch( login({ uid, email, displayName, photoURL }) );
    }
}

export const startRegisterUserWithEmailPassword= ( { email, password, displayName } ) => {
    return async( dispatch ) => {
        dispatch( checkingCredentials() );
        const result = await registerUserWithEmailPassword( { email, password, displayName } )
        const {uid, photoURL} = result;

        if ( !result.default ) return dispatch( logout( { errorMessage: result.errorMessage } ) )

        dispatch( login( { uid, email, displayName, photoURL } ) );
    }
}

export const startLoginWithEmailPassword = ( { email, password } ) => {
    return async( dispatch ) => {
        let isAdmin = false;
        dispatch( checkingCredentials() );
        const result =await loginWithEmailAndPassword( { email, password } );
        const { uid, displayName, photoURL } = result;

        if( !result.default ) return dispatch( logout ( { errorMessage: result.errorMessage } ) )
        if (email === "admin@gmail.com") isAdmin = true;
        dispatch( login( { uid, email, displayName, photoURL, isAdmin } ) )
    }
}

export const startLogout = () => {
    return async( dispatch ) => {

        await logoutFirebase();

        dispatch( logout() );
    }
}