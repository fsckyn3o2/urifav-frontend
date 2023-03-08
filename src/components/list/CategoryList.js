import React, {useEffect, useReducer, useState} from "react";
import CategorySrv from "../../services/CategoryService";
import CopyText from "../utils/CopyText";
import QueueSrv from "../../services/QueueService";
import * as Icon from "react-bootstrap-icons";
import PageOfList from "./PageOfList";

function CategoryList() {

    const [search, setSearch] = useReducer((state, action) => {
        QueueSrv.newMessage('categ_search', {...state.search, ...action.search, ...{page: {size: 10}}});
        return {...state, ...action};
    }, {form: {text: ''}, search: {name: '', url: ''}});

    const [tableContent, setTableContent] = useState([]);
    const [currentPage, setCurrentPage] = useState(CategorySrv.currentPage.getValue());

    const mapCateg = (list) => {
        if (list.length > 0) {
            return (list)
                .map(
                    (categ, i) => <tr key={'categ-i-' + i}>
                        <td className={'add-data-action'}>
                            <div>
                                <div className="app-data-action"
                                   onClick={ () => { QueueSrv.newMessage('toggleEditCategModal', {show: true, form: categ}); } }>
                                    <Icon.Pencil /> <span>Edit</span>
                                </div>
                            </div>
                        </td>
                        <td className={'app-data-id'}>
                            {categ.uuid !== undefined &&
                                <>
                                    <span className={'app-data-id-tooltip'}> <CopyText text={categ.uuid}
                                                                                       displayText={true}/> </span>
                                    {categ.uuid.substring(categ.uuid.length - 12)}
                                </>
                            }
                        </td>
                        <td>{categ.parent_name}</td>
                        <td>{categ.name}</td>
                        <td>{categ.path}</td>
                        <td style={{'width': '60px'}}>
                            <input type="checkbox" checked={categ.shared} name="shared" style={{'width': 30}} readOnly />
                        </td>
                        <td className={'app-data-id'}>
                            {categ.share_token !== undefined &&
                                <>
                                    <span className={'app-data-id-tooltip'}> <CopyText text={categ.share_token} displayText={true}/> </span>
                                    {categ.share_token.substring(categ.share_token.length-12)}
                                </>
                            }
                        </td>
                        <td>
                            {categ.description}
                        </td>
                        <td>9999</td>
                    </tr>
                );
        } else {
            return [<tr key={'noData'}><td colSpan={9}>No data</td></tr>];
        }
    };

    useEffect(() => {
        CategorySrv.categories.subscribe((list) => setTableContent(mapCateg(list)) );
        CategorySrv.currentPage.subscribe(page => setCurrentPage(page));
    }, []);

    return (
        <>
            <div className="mb-3 row">
                <label className="col-xs-3 col-sm-auto col-form-label">Full text search :</label>
                <div className="col-7 col-xs-auto">
                    <input id="category-filtering-search" className="form-control" type="text"
                           value={search.form.text}
                           onChange={ (event) =>
                               setSearch({
                                   search: {name: event.target.value, path: event.target.value, description: event.target.value},
                                   form: {text: event.target.value}
                               }) }  />
                </div>
            </div>

            <table className="table table-striped table-ordered app-data">
                <thead>
                    <tr>
                        <th scope="col">Action</th>
                        <th scope="col">#</th>
                        <th scope="col">Parent</th>
                        <th scope="col">Name</th>
                        <th scope="col">Path</th>
                        <th scope="col" className={'w-1'}>Shared</th>
                        <th scope="col">External link</th>
                        <th scope="col">Description</th>
                        <th scope="col">Links</th>
                    </tr>
                </thead>
                <tbody>
                   {tableContent}
                </tbody>
                <tfoot className="app-data-foot-actions">
                    <tr>
                        <td colSpan="7">
                            <PageOfList page={currentPage} getPage={CategorySrv.pageOfCategory.bind(CategorySrv)}/>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </>
    );
}

export default CategoryList;
