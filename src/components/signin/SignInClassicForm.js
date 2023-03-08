import React from "react";
import {Button, Form} from "react-bootstrap";
import QueueSrv from "../../services/QueueService";
import SignInFactory from "../../factories/SignInFactory";
import {useEffect, useReducer, useState} from "react";
import {filter} from "rxjs";
import * as Icon from "react-bootstrap-icons";
import {config} from "../../config"

function SignInClassicForm(props) {

    // const [validationResult, setValidationResult] = useState({});
    const [signInForm, setSignInForm] = useReducer((state, action) => ({...state, ...action}), SignInFactory.emptySignIn());
    const [error, setError] = useState({error: false, message: '', icon: ''});

    const onChange = (formContent) => { QueueSrv.newMessage('signin_form_validation', {...signInForm, ...formContent}); setSignInForm(formContent); };

    useEffect(() => {
        QueueSrv.messages.pipe(filter( message => message.id === 'signin_error'))
            .subscribe(error => {
                if(error.content.code === 'credential') {
                    setError({
                        error: true,
                        message: error.content.message,
                        icon: 'credential'
                    });
                } else if(error.content.code === 'locked') {
                    setError({
                        error: true,
                        message: error.content.message,
                        icon: 'locked'
                    });
                }
            } );

        QueueSrv.messages.pipe(filter(value => value.id === 'signin_validation_result'))
            .subscribe(item => setError(item.content));
    }, []);

    return (config.application.authentication.std.enable &&
        <div>
            <Form onSubmit={() => {return false;} }>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username or email" defaultValue={signInForm.username}
                                  onChange={(event) => onChange({username: event.target.value}) } />
                    <Form.Text className="text-muted">
                        Username or Email
                    </Form.Text>
                    <p className={(error?.username ? 'text-danger':'') + ' app-form-error'}>{error?.username}</p>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter password"
                                  onChange={(event) => onChange({password: event.target.value}) } />
                    <p className={(error?.password ? 'text-danger':'') + ' app-form-error'}>{error?.password}</p>
                </Form.Group>
                <Form.Group>
                    {error.error === true &&
                        <div className="app-modal-error">
                            <div className="app-modal-error-icon">
                                {error.icon === 'locked' && <Icon.Lock />}
                                {error.icon === 'credential' && <Icon.ExclamationOctagon />}
                            </div>
                            <div className="text-danger app-modal-error-message">{error.message}</div>
                        </div>
                    }
                </Form.Group>
                <Form.Group>
                    <Button variant="primary" style={{'width': '100%'}} onClick={() => QueueSrv.newMessage('signin', SignInFactory.cloneSignIn(signInForm))}>Sign in</Button>
                </Form.Group>
            </Form>
        </div>
    );
}

export default SignInClassicForm;
