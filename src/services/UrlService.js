import QueueSrv from "./QueueService";
import { ajax } from 'rxjs/ajax';
import {BehaviorSubject} from "rxjs";
import PaginationUtils from "./PaginationUtils";
import CategorySrv from "./CategoryService";

class UrlService {

    urls = new BehaviorSubject([]);
    currentPage = new BehaviorSubject({});

    validateForm(form) {
        const errors = {_validated: true};
        if (form.name === undefined || form.name.length < 4) {
            errors['name'] = 'Name is required and minimum length is 4';
            errors._validated = false;
        }

        if (form.url === undefined || false === (form.url.startsWith('http://') || form.url.startsWith('https://') || form.url.startsWith('file://')) ) {
            errors['url'] = 'Url is required and begins with \'http\', \'https\' or \'file\' schema';
            errors._validated = false;
        }

        if (form.category_uuid === undefined) {
            errors['category_uuid'] = 'Category is required';
            errors._validated = false;
        }

        QueueSrv.newMessage('url_form_validation_result', errors);
        return errors;
    }

    validateSearchForm(form) {
        const errors = {_validated: true};

        if(undefined === form.name && undefined === form.category_uuid) {
            errors['name'] = 'Search of url required \'name\' or \'category\' field';
            errors._validated = false;
        }

        QueueSrv.newMessage('url_search_validation_result', errors);
        return errors;
    }

    createUrl(form) {
        const validationForm = this.validateForm(form);
        if (validationForm._validated === true) {
            ajax.post('/api/url', form, {'Content-Type': 'application/json'})
                .subscribe({
                    next: res => QueueSrv.newMessage('url_creation_done', res.response),
                    error: error => QueueSrv.newError('url_edition_error',
                        {...error, notificationText: 'An error occurred during url creation of \'' + error.response.data.name }
                    )
                });
        }
    }

    updateUrl(form) {
        const validationForm = this.validateForm(form);
        if (validationForm._validated === true) {
            ajax.put('/api/url', form, {'Content-Type': 'application/json'})
                .subscribe({
                    next: res => QueueSrv.newMessage('url_edition_done', res.response),
                    error: error => QueueSrv.newError('url_edition_error',
                        {...error, notificationText: 'An error occurred during url edition of \'' + error.response.data.name + '\' with uuid \'' + error.response.data.uuid + '\''}
                    )
                });
        }
    }

    pageOfUrl(page) {
        const headers = {'Content-Type': 'application/json', ...(page !== undefined && PaginationUtils.validatePage(page) ? {'page-number': page?.number, 'page-size': page?.size} : {})};
        ajax.get('/api/url', headers)
            .subscribe({
                next: res => {
                    this.urls.next(res.response);
                    this.currentPage.next(PaginationUtils.fromHttpResponse(res));
                    QueueSrv.newMessage('url_list_page_done', this.urls.value);
                },
                error: error => QueueSrv.errors.next(
                    {id: 'url_page_error' + new Date().toISOString(), content: {...error, notificationText: 'Url page not found'}}
                )
            });
    }

    searchUrl(parameters) {
        if(this.validateSearchForm(parameters)._validated === true) {
            ajax.post('api/url/search', parameters, {'Content-Type': 'application/json'})
                .subscribe({
                    next: res => {
                        this.urls.next(res.response);
                        this.currentPage.next(PaginationUtils.fromHttpResponse(res));
                    },
                    error: error => QueueSrv.errors.next(
                        {
                            id: 'url_search_error',
                            content: {...error, notificationText: 'An error occurred during generation of url list'}
                        }
                    )
                });
        }
    }

    getUrl(uuid) {
        ajax.get('/api/url/' + uuid, {'content-type': 'application/json'})
            .subscribe({
                next: res => {
                    this.urls.next(this.urls.getValue().map(item => item.uuid === res.response.uuid ? res.response : item));
                    QueueSrv.newMessage('url_get_done', res.response);
                },
                error: error => QueueSrv.newError('url_get_error', {...error, notificationText: 'Url not found' })
            });
    }
}

const UrlSrv = new UrlService();
export default UrlSrv;
