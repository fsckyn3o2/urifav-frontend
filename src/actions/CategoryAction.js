import QueueSrv from "../services/QueueService";
import CategorySrv from "../services/CategoryService";

function CategoryAction() {
    QueueSrv.messages.subscribe(({id, content}) => {
        // eslint-disable-next-line default-case
        switch(id) {
            case 'categ_form_validation':
                CategorySrv.validateForm(content).subscribe(errors => QueueSrv.newMessage('categ_form_validation_result', errors));
                break;
            case 'categ_creation':
                CategorySrv.createCategory(content);
                break;
            case 'categ_edition':
                CategorySrv.updateCategory(content);
                break;
            case 'categ_edition_done':
                QueueSrv.newMessage('notification', {status: 'succeed', text: "Category successfully updated with name '" + content.name + "'"});
                CategorySrv.pageOfCategory();
                break;
            case 'categ_creation_done':
                QueueSrv.newMessage('notification', {status: 'succeed', text: "Category successfully created with name '" + content.name + "'"});
                CategorySrv.pageOfCategory();
                break;
            case 'categ_list':
            case 'categ_get':
                CategorySrv.pageOfCategory();
                break;
            case 'categ_search':
                CategorySrv.searchCategory(content, content.page.size);
                break;
        }
    });
}

export default CategoryAction;
