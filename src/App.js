import React, {Suspense, useEffect, useReducer} from 'react';
import './App.css';
import {Col, Container, Row} from 'react-bootstrap';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import Loading from "./components/Loading";
import Menu from './components/Menu';

import SignInFormModal from "./components/signin/SignInFormModal";
import UrlFormModal from "./components/url/UrlFormModal";
import CategoryFormModal from "./components/category/CategoryFormModal";
import CategoryList from "./components/list/CategoryList";
import Notification from "./components/Notification";
import UrlList from "./components/list/UrlList";

import QueueSrv from "./services/QueueService";

import UrlAction from "./actions/UrlAction";
import CategoryAction from "./actions/CategoryAction";
import SignInAction from "./actions/SignInAction";
import {filter} from "rxjs";
import ModalAction from "./components/ModalAction";

function AppInit() {
    UrlAction();
    CategoryAction();
    SignInAction();
    QueueSrv.newMessage('categ_list', undefined);
    QueueSrv.newMessage('url_list', undefined);
}

AppInit();

function App() {

    const [signInModal, setSignInModal] = useReducer(ModalAction, {show:false});
    const [createUrlModal, setCreateUrlModal] = useReducer(ModalAction, {show:false});
    const [editUrlModal, setEditUrlModal] = useReducer(ModalAction, {show:false});
    const [createCategoryModal, setCreateCategoryModal] = useReducer(ModalAction, {show:false});
    const [editCategoryModal, setEditCategoryModal] = useReducer(ModalAction, {show:false});

    useEffect(() => {
        QueueSrv.messages.pipe(filter(value => value.id === 'toggleCreateUrlModal'))
            .subscribe(toggle => {
                setEditUrlModal({show: false});
                setCreateCategoryModal({show: false});
                setEditCategoryModal({show: false});
                setCreateUrlModal({show: toggle.content});
            });

        QueueSrv.messages.pipe(filter(value => value.id === 'toggleEditUrlModal'))
            .subscribe(toggle => {
                setCreateUrlModal({show: false});
                setCreateCategoryModal({show: false});
                setEditCategoryModal({show: false});
                setEditUrlModal({show: toggle.content.show, ...toggle.content.form});
            });

        QueueSrv.messages.pipe(filter(value => value.id === 'toggleCreateCategModal'))
            .subscribe(toggle => {
                setEditUrlModal({show: false});
                setEditCategoryModal({show: false});
                setCreateUrlModal({show: false});
                setCreateCategoryModal({show: toggle.content});
            });

        QueueSrv.messages.pipe(filter(value => value.id === 'toggleEditCategModal'))
            .subscribe(toggle => {
                setCreateUrlModal({show: false});
                setEditUrlModal({show: false});
                setCreateCategoryModal({show: false});
                setEditCategoryModal({show: toggle.content.show, ...toggle.content.form});
            });

        QueueSrv.messages.pipe(filter(value => value.id === ('categ_edition_done' || 'url_edition_done')))
            .subscribe(res => {
                if(res.uuid === editCategoryModal.uuid) {
                    setEditCategoryModal({show: false});
                }
                if(res.uuid === editUrlModal.uuid) {
                    setEditUrlModal({show: false});
                }
            });

        QueueSrv.messages.pipe(filter(value => value.id === 'toggleSignInModal'))
            .subscribe(toggle => setSignInModal({show: toggle.content}));

    }, []);

    return (
      <BrowserRouter>
        <Container>
          <Notification />
          <Row>
            <Col>
                <Menu />
            </Col>
          </Row>
          <Row>
            <Col className="App">
                <Suspense fallback={<Loading />}>
                    <SignInFormModal show={signInModal.show} />
                    <UrlFormModal show={createUrlModal.show}
                                  modalTitle='Create Url'
                                  formSaveAction='url_creation'
                    />
                    <UrlFormModal show={editUrlModal.show}
                                  modalTitle='Edit Url'
                                  formSaveAction='url_edition'
                                  uuid={editUrlModal.uuid}
                                  name={editUrlModal.name}
                                  url={editUrlModal.url}
                                  shared={editUrlModal.shared}
                                  share_token={editUrlModal.share_token}
                                  category_uuid={editUrlModal.category_uuid}
                                  category_name={editUrlModal.category_name}
                                  creation_date={editUrlModal.creation_date}
                                  update_date={editUrlModal.update_date}
                    />
                    <CategoryFormModal show={createCategoryModal.show}
                                       modalTitle='Create Category'
                                       formSaveAction='categ_creation'
                    />
                    <CategoryFormModal show={editCategoryModal.show}
                                       modalTitle='Edit Category'
                                       formSaveAction='categ_edition'
                                       uuid={editCategoryModal.uuid}
                                       name={editCategoryModal.name}
                                       description={editCategoryModal.description}
                                       path={editCategoryModal.path}
                                       parent_uuid={editCategoryModal.parent_uuid}
                                       parent_name={editCategoryModal.parent_name}
                                       shared={editCategoryModal.shared}
                                       share_token={editCategoryModal.share_token}
                                       category_uuid={editCategoryModal.category_uuid}
                                       creation_date={editCategoryModal.creation_date}
                                       update_date={editCategoryModal.update_date}
                    />
                    <Routes>
                        <Route exact path ="/url" element={<UrlList />} />
                        <Route exact path ="/category" element={<CategoryList />} />
                    </Routes>
                </Suspense>
            </Col>
          </Row>
        </Container>
      </BrowserRouter>
    );
}

export default App;
