import React, {useEffect} from 'react';
import './SignIn.css';
import {Modal, Tab, Tabs} from "react-bootstrap";
import QueueSrv from "../../services/QueueService";
import {filter} from "rxjs";
import SignInClassicForm from "./SignInClassicForm";
import SignInGitHubForm from "./SignInGitHubForm";
import SignInGoogleForm from "./SignInGoogleForm";
import {config} from "../../config";

function SignInFormModal(props) {

    const handleClose = () => QueueSrv.newMessage('toggleSignInModal', false);

    useEffect(() => {
        QueueSrv.messages.pipe(filter(value => value.id === 'signin_done'))
            .subscribe(() => handleClose());
    }, []);

    useEffect(() => {
    }, [props]);

    const stdSignTab = (config.application.authentication.std.enable &&
        <Tab eventKey="classic" title="Email">
            <SignInClassicForm />
        </Tab>
    );

    const hasThirdPart = Object.entries(config.application.authentication).filter(([key, value]) => value.enable === true && key !== 'std').length;

    const thirdPartTab = (hasThirdPart &&
        <Tab eventKey="thirdpart" title="ThirdPart">
            <ul className="thirdpart-list">
                <li className="thirdpart-item" tabIndex="0">
                    <SignInGitHubForm />
                </li>
                <li className="thirdpart-item" tabIndex="0">
                    <SignInGoogleForm />
                </li>
            </ul>
        </Tab>
    );

    return (
        <Modal
            show={props?.show}
            onHide={handleClose}
            centered
            dialogClassName="modal-90w"
            keyboard={true}
        >
            <Modal.Header closeButton>
                <Modal.Title>Sign in</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Tabs defaultActiveKey={(config.application.authentication.std.enable === true?'classic':'thirdpart')} id="signInTabs" className="mb-3">
                    {stdSignTab}
                    {thirdPartTab}
                </Tabs>
            </Modal.Body>
        </Modal>
    );
}

export default SignInFormModal;
