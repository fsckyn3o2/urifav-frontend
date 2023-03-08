import React from "react";
import * as Icon from "react-bootstrap-icons";
import QueueSrv from "../../services/QueueService";
import {config} from "../../config";

function SignInGitHubForm(props) {

    return (config.application.authentication.github.enable &&
        <div className="thirdpart-link" onClick={() => QueueSrv.messages.next({id: 'signin', content: 'github'})}>
            <span className="thirdpart-link-icon"><Icon.Github /></span>
            <span className="thirdpart-link-descr">Sign in with GitHub</span>
        </div>
    );
}

export default SignInGitHubForm;
