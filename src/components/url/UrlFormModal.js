import React, {useEffect, useReducer, useState} from 'react';
import {Button, Modal} from "react-bootstrap";
import UrlForm from "./UrlForm";
import QueueSrv from "../../services/QueueService";
import {filter} from "rxjs";
import UrlFactory from "../../factories/UrlFactory";

function UrlFormModal(props) {

    const [validationResult, setValidationResult] = useState({});
    const [urlForm, setUrlForm] = useReducer((state, action) => ({...state, ...action}), UrlFactory.emptyUrl());

    const handleClose = () => QueueSrv.newMessage('toggleCreateUrlModal', false);

    const handleFormSave = () => QueueSrv.newMessage(props.formSaveAction, UrlFactory.cloneUrl(urlForm));

    useEffect(() => {
        QueueSrv.errors.pipe(filter(value => value.id === 'url_creation_error' || value.id === 'url_edition_error'))
            .subscribe(item => {
                if (item.id === 'url_edition_error' && item.content.response.status === 412) {
                    setValidationResult({...validationResult, backendError: 'Save action cannot be applied a refresh is required.', _validated: false})
                } else {
                    setValidationResult({...validationResult, backendError: item.content.notificationText, _validated: false})
                }
            });

        QueueSrv.messages.pipe(filter(value => value.id === 'url_creation_done' || value.id === 'url_edition_done'))
            .subscribe(() => handleClose());

        QueueSrv.messages.pipe(filter( message => message.id === 'url_form_validation_result'))
            .subscribe(error => setValidationResult(error.content) );
    }, []);

    useEffect(() => {
        setUrlForm(UrlFactory.cloneUrl(props));
    }, [props]);

    return (
        <Modal
            show={props?.show}
            onHide={handleClose}
            centered
            dialogClassName="modal-90w"
            keyboard={true}
        >
            <Modal.Header closeButton>
                <Modal.Title>{props.modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <UrlForm  name={props.name} url={props.url} uuid={props.uuid} shared={props.shared}
                          share_token={props.share_token}
                          category_uuid={props.category_uuid} category_name={props.category_name}
                          creation_date={props.creation_date} update_date={props.update_date}
                          onChange={ (formContent) => { QueueSrv.newMessage('url_form_validation', {...urlForm, ...formContent}); setUrlForm(formContent); }  }
                          errors={validationResult} />

                {validationResult._validated === false && validationResult.backendError !== undefined &&
                    <div className="app-modal-error">
                        <span className="text-danger">{validationResult.backendError}</span>
                    </div>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={handleFormSave}>Save</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UrlFormModal;
