import QueueSrv from "../services/QueueService";
import SignInSrv from "../services/SignInService";

function SignInAction() {
    QueueSrv.messages.subscribe(({id, content}) => {
        // eslint-disable-next-line default-case
        switch(id) {
            case 'signin':
                switch(content) {
                    default:
                        SignInSrv.signin(content);
                        break;
                    case 'github':
                        SignInSrv.signinWithGithub();
                        break;
                    case 'google':
                        SignInSrv.signinWithGoogle();
                        break;
                }
                break;
            case 'signout':
                switch(content) {
                    default:
                        SignInSrv.signout();
                        break;
/*                    case 'github':
                        SignInSrv.singoutGithub();
                        break;
                    case 'google':
                        SignInSrv.signoutGoogle();
                        break;
*/
                }
                break;
        }
    });
}

export default SignInAction;
