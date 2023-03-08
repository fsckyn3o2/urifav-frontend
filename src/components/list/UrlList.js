import React, {useEffect, useReducer, useState} from "react";
import UrlSrv from "../../services/UrlService";
import CopyText from "../utils/CopyText";
import categoryService from "../../services/CategoryService";
import * as Icon from "react-bootstrap-icons";
import QueueSrv from "../../services/QueueService";
import PageOfList from "./PageOfList";

function UrlList() {

    const [search, setSearch] = useReducer((state, action) => {
        QueueSrv.newMessage('url_search', {...state.search, ...action.search});
        return {...state, ...action};
    }, {form: {text: ''}, search: {name: '', url: ''}});

    const [tableContent, setTableContent] = useState([]);
    const [currentPage, setCurrentPage] = useState(UrlSrv.currentPage.getValue());

    const mapUrl = (list) => {
        if (list.length > 0) {
            return (list)
                .map(
                    (url, i) => <tr key={'url-i-' + i}>
                        <td className={'add-data-action'}>
                            <div>
                                <div className="app-data-action"
                                   onClick={ () => { QueueSrv.newMessage('toggleEditUrlModal', {show: true, form: url}); } }>
                                    <Icon.Pencil /> <span>Edit</span>
                                </div>
                            </div>
                            <div>

                            </div>
                            <div>

                            </div>
                        </td>
                        <td className={'app-data-id'}>
                            {url.uuid !== undefined &&
                                <>
                                    <span className={'app-data-id-tooltip'}> <CopyText text={url?.uuid} displayText={true}/> </span>
                                    {url.uuid.substring(url.uuid.length-12)}
                                </>
                            }
                        </td>
                        <td>{url?.name}</td>
                        <td>
                            { url.url !== undefined && <a href={url.url}>{url.url}</a> }
                        </td>
                        <td style={{'width': '60px'}}>
                            <input type="checkbox" checked={url?.shared} name="shared" style={{'width': 30}} readOnly />
                        </td>
                        <td className={'app-data-id'}>
                            {url.share_token !== undefined &&
                                <>
                                    <span className={'app-data-id-tooltip'}> <CopyText text={url.share_token}
                                                                                       displayText={true}/> </span>
                                    {url.share_token.substring(url.share_token.length - 12)}
                                </>
                            }
                        </td>
                        <td>
                            {url.category_name? url.category_name : url.category_uuid}
                        </td>
                    </tr>
                );
        } else {
            return [<tr key={'noData'}><td colSpan={7}>No data</td></tr>];
        }
    }

    useEffect(() => {
        UrlSrv.urls.subscribe(list => setTableContent(mapUrl(list)) );
        UrlSrv.currentPage.subscribe(page => setCurrentPage(page));
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
                                   search: {name: event.target.value, url: event.target.value},
                                   form: {text: event.target.value}
                               }) } />
                </div>
            </div>

            <table className="table table-striped app-data">
                <thead>
                <tr>
                    <th scope="col">Action</th>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Url</th>
                    <th scope="col">Shared</th>
                    <th scope="col">Public token</th>
                    <th scope="col">Category</th>
                </tr>
                </thead>
                <tbody>
                {tableContent}
                </tbody>
                <tfoot className="app-data-foot-actions">
                    <tr>
                        <td colSpan="7">
                            <PageOfList page={currentPage} getPage={UrlSrv.pageOfUrl.bind(UrlSrv)}/>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </>
    );
}

export default UrlList;
