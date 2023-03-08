import { BehaviorSubject, Subject } from "rxjs";

const QueueSrv = {
    messages: new Subject(),
    errors: new Subject(),
    logs: new BehaviorSubject(''),
    newMessage: (id, content) => QueueSrv.messages.next({id: id, content: content}),
    newError: (id, error) => QueueSrv.errors.next({id: id, content: error}),
    newLog: (log) => QueueSrv.logs.next(log)
};

export default QueueSrv;

