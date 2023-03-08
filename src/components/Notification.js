import React, {useEffect, useState} from "react";
import {Toast, ToastBody, ToastHeader} from "react-bootstrap";
import QueueSrv from "../services/QueueService";
import {filter} from "rxjs";
import * as Icon from "react-bootstrap-icons";

function Notification() {

    const [show, setShow] = useState(false);
    const [messages, setMessages] = useState([]);

    let timeoutId = null;

    const clearNotification = () => {
        if(timeoutId !== null) clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            setShow(false);
            setMessages([]);
        }, 2000);
    }

    useEffect(() => {
        QueueSrv.messages.pipe(filter(_msgObject => _msgObject.id === 'notification'))
            .subscribe(_msgObject => {
                setShow(true);
                setMessages([...messages, _msgObject.content]);
                clearNotification();
            });

        QueueSrv.errors.subscribe({ next: _msgObject => {
                setShow(true);
                setMessages([...messages, _msgObject.content]);
                clearNotification();
            }
        });
    }, []);

    const messageHtml = (v,k) =>
        <li key={'notification-msg-' + k}>
            <div className="notification-item">
                <Icon.Check2 style={{'display': v?.status ? (v.status === 'succeed' ? 'block' : 'none') : 'none'}}/>
                <Icon.X style={{'display': v?.status ? (v.status === 'failed' ? 'block' : 'none') : 'none'}}/>
                <Icon.WifiOff style={{'display': v?.status ? (v.status > 200 ? 'block' : 'none') : 'none'}}/>
            </div>
            {v?.text || v?.message}
            <span style={{'display': (v?.request?.url ? 'inline' : 'none'), 'fontStyle': 'italic', 'paddingLeft': '1em'}}>{v?.request?.url}</span>
            <span style={{'display': (v?.notificationText? 'inline' : 'none'), 'fontStyle': 'italic', 'paddingLeft': '1em'}}>{v?.notificationText}</span>
        </li>;

    return (<Toast className={'app-notification'} hidden={!show} onClose={() => setShow(false)}>
                <ToastHeader><strong className="me-auto">Notifications</strong></ToastHeader>
                <ToastBody>
                    <ul key={'notification-msg-list'}>
                        {messages.map(messageHtml)}
                    </ul>
                </ToastBody>
            </Toast>);
}

export default Notification;
