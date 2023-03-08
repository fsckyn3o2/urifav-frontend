import React, {useEffect, useReducer, useState} from 'react';
import {Button, Modal} from "react-bootstrap";
import CategoryForm from "./CategoryForm";
import QueueSrv from "../../services/QueueService";
import {filter} from "rxjs";
import CategoryFactory from "../../factories/CategoryFactory";

function CategoryFormModal(props) {

    const [validationResult, setValidationResult] = useState({});
    const [categForm, setCategForm] = useReducer((state, action) => ({...state, ...action}), CategoryFactory.emptyCategory());

    const handleClose = () => QueueSrv.newMessage('toggleCreateCategModal', false);

    const handleFormSave = () => QueueSrv.newMessage(props.formSaveAction, CategoryFactory.cloneCategory(categForm));

    useEffect(() => {
        QueueSrv.errors.pipe(filter(value => value.id === 'categ_creation_error' || value.id === 'categ_edition_error'))
            .subscribe(item => {
                if (item.id === 'category_edition_error' && item.content.response.status === 412) {
                    setValidationResult({...validationResult, backendError: 'Save action cannot be applied a refresh is required.', _validated: false})
                } else {
                    setValidationResult({...validationResult, backendError: item.content.notificationText, _validated: false})
                }
            });

        QueueSrv.messages.pipe(filter(value => value.id === 'categ_creation_done' || value.id === 'categ_edition_done'))
            .subscribe(() => handleClose());

        QueueSrv.messages.pipe(filter( message => message.id === 'categ_form_validation_result'))
            .subscribe(error => setValidationResult(error.content) );
    }, []);

    useEffect(() => {
        setCategForm(CategoryFactory.cloneCategory(props));
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
                <CategoryForm name={props.name} url={props.url} uuid={props.uuid} description={props.description} path={props.path}
                              shared={props.shared} share_token={props.share_token} parent_uuid={props.parent_uuid}
                              creation_date={props.creation_date} update_date={props.update_date} parent_name={props.parent_name}
                              onChange={ (formContent) => { QueueSrv.newMessage('categ_form_validation', {...categForm, ...formContent}); setCategForm(formContent); }  }
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

export default CategoryFormModal;
