import React from "react";
import * as Icon from "react-bootstrap-icons";
import QueueSrv from "../../services/QueueService";
import {config} from "../../config"

function SignInGoogleForm(props) {

    return (config.application.authentication.google.enable &&
        <div className="thirdpart-link" onClick={() => QueueSrv.messages.next({id: 'signin', content: 'google'})}>
            <span className="thirdpart-link-icon"><Icon.Google /></span>
            <span className="thirdpart-link-descr">Sign in with Google</span>
        </div>
    );
}

export default SignInGoogleForm;
