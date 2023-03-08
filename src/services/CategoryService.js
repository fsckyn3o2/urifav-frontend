import {ajax} from "rxjs/ajax";
import QueueSrv from "./QueueService";
import {BehaviorSubject, catchError, map, Observable, of} from "rxjs";
import PaginationUtils from "./PaginationUtils";

class CategoryService {

    categories = new BehaviorSubject([]);
    currentPage = new BehaviorSubject({});

    validateSearchForm(form) {
        const errors = {_validated: true};

        if(undefined === form.name && undefined === form.path && undefined === form.description) {
            errors['name'] = 'Search of url required \'name\' or \'paht\' or \'description\' field';
            errors._validated = false;
        }

        QueueSrv.newMessage('category_search_validation_result', errors);
        return errors;
    }

    validateForm(form) {
        return new Observable(subscriber => {
            const errors = {'_validated': true};
            if (form.name === undefined || form.name.length < 4) {
                errors['name'] = 'Name is required and minimum length is 4';
                errors._validated = false;
            }

            if (form.path === undefined) {
                errors['path'] = 'Path is required';
                errors._validated = false;
            }

            // Search parent category with uuid or name :
            ( form.parent_uuid !== undefined && form.parent_uuid !== null ?
                this.selectAllCategoryMatch({uuid: form.parent_uuid}) :
              form.parent_name !== undefined && form.parent_name !== null && form.parent_name !== '' ?
                this.selectAllCategoryMatch({name: form.parent_name}) :
                of([undefined])
            ).subscribe(res => {
                if (res.length !== 1) {
                    errors['parent_uuid'] = 'Parent category not found';
                    errors._validated = false;
                }
                subscriber.next(errors);
                subscriber.complete();
            });
        });
    }

    createCategory(form) {
        this.validateForm(form).subscribe(errors => {
            if (errors._validated === true) {
                ajax.post('/api/category', form, {'Content-Type': 'application/json'})
                    .subscribe({
                        next: res => QueueSrv.newMessage('categ_creation_done', res.response),
                        error: error => QueueSrv.newError('categ_creation_error', error)
                    });
            }
        });
    }

    updateCategory(form) {
        this.validateForm(form).subscribe(errors => {
            if (errors._validated === true) {
                ajax.put('/api/category', form, {'Content-Type': 'application/json'})
                    .subscribe({
                        next: res => QueueSrv.newMessage('categ_edition_done', res.response),
                        error: error => QueueSrv.newError('categ_edition_error', error)
                    });
            }
        })
    }

    pageOfCategory(page) {
        const headers = {'Content-Type': 'application/json', ...(page !== undefined && PaginationUtils.validatePage(page) ? {'page-number': page?.number, 'page-size': page?.size} : {})};
        ajax.get('/api/category', headers)
            .subscribe({
                next: res => {
                    this.categories.next(res.response);
                    this.currentPage.next(PaginationUtils.fromHttpResponse(res));
                    QueueSrv.newMessage('categ_list_page_done', this.categories.value);
                },
                error: error => QueueSrv.errors.next(
                    {id: 'categ_page_error' + new Date().toISOString(), content: {...error, notificationText: 'Category page not found'}}
                )
            });
    }

    selectAllCategoryMatch(selection) {
        return ajax.post('/api/category/select', selection, {'Content-Type': 'application/json'})
            .pipe(
                catchError((error) => QueueSrv.newError('categ_select_error', error)),
                map(res => res.response)
            );
    }

    searchByName(text, pageSize = 10) {
        return ajax.post('api/category/search', {name: text}, {'Content-Type': 'application/json', 'page-size': pageSize})
            .pipe(map(res => res.response));
    }

    searchCategory(parameters, pageSize = 10) {
       if(this.validateSearchForm(parameters)._validated === true) {
           ajax.post('api/category/search', parameters, {'Content-Type': 'application/json', 'page-size': pageSize})
               .subscribe({
                   next: res => {
                       this.categories.next(res.response);
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

}

const CategorySrv = new CategoryService();

export default CategorySrv;
