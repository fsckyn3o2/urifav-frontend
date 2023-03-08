import QueueSrv from "./QueueService";
import {config} from "../config";
import Random from "../components/utils/Random";

class SignInService {

    validateSignInForm(form) {
        const errors = {_validated: true};

        if(undefined === form.username || form.username.length <= 0) {
            errors['username'] = 'Username is required';
            errors._validated = false;
        }

        if(undefined === form.password || form.password.length <= 0) {
            errors['password'] = 'Password is required';
            errors._validated = false;
        }
        QueueSrv.newMessage('signin_validation_result', errors);
        return errors;

    }

    signin(form) {
        if(this.validateSignInForm(form)){
            QueueSrv.messages.next({id: 'signin_error', content: {code: 'credential', message: <><span>Authentication failed!</span><span>Please verify username and password.</span></> }});
        }
    }

    signout() {
        if(config?.application?.authentication?.signout) {
            const url = config?.application?.authentication?.signout?.url;
            if(undefined !== url) {
                window.location = url;
            }
        }
    }

    signinWithGithub() {
        if(config?.application?.authentication?.github) {
            const clientId = config.application.authentication.github.client_id;
            const url = config.application.authentication.github.url;
            if(undefined !== clientId && undefined !== url) {
                window.location = url.replace('{client_id}', clientId).replace('{state}', Random.randomStateStr());
            }
        }
    }

    signinWithGoogle() {

    }

    singoutGithub() {
        this.signout();
    }

    signoutGoogle() {

    }
}

const SignInSrv = new SignInService();

export default SignInSrv;
