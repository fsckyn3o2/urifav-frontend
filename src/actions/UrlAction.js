import QueueSrv from "../services/QueueService";
import UrlSrv from "../services/UrlService";

function UrlAction() {
    QueueSrv.messages.subscribe(({id, content}) => {
        // eslint-disable-next-line default-case
        switch(id) {
            case 'url_form_validation':
                UrlSrv.validateForm(content);
                break;
            case 'url_creation':
                UrlSrv.createUrl(content);
                break;
            case 'url_edition':
                UrlSrv.updateUrl(content);
                break;
            case 'url_edition_done':
                QueueSrv.newMessage('notification', {status: 'succeed', text: "Url successfully updated with name '" + content.name + "'"});
                UrlSrv.pageOfUrl();
                break;
            case 'url_creation_done':
                QueueSrv.newMessage('notification', {status: 'succeed', text: "Url successfully created with name '" + content.name + "'"});
                UrlSrv.pageOfUrl();
                break;
            case 'url_list':
            case 'url_get':
                UrlSrv.pageOfUrl();
                break;
            case 'url_search':
                UrlSrv.searchUrl(content);
                break;
        }
    });
}

export default UrlAction;
