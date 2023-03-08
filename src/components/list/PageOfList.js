import React from "react";
import * as Icon from "react-bootstrap-icons";

function PageOfList(props) {

    const hasPage = (page, offset) => (page.number+offset) <= page.last && (page.number+offset) > 0;

    const getPage = (page, offset) => ({
       number: page.number+offset > page.last ? -1 :
               page.number+offset < -1 ? 1 : page.number+offset,
       size: page.size,
       last: page.last
    });

    const createPageList = (page) => {
        return [...new Array(6)]
            .map((item, index) => 1 - (3-index))
            .filter(offset => hasPage(page, offset))
            .map(offset => ({number: page.number+offset, size: page.size, last: page.last}) )
            .map(iPage => <div className={'app-data-page-item ' + (iPage.number === page.number?'app-data-page-item-selected':'')} key={'data-page-' + iPage.number}
                              onClick={() => props.getPage(iPage)}>
                <div>{iPage.number}</div>
            </div>);
    };

    return <div className="app-data-page">
            <div className="app-data-page-first"
                 onClick={() => props.getPage({number: 1, size: props.page.size})}>
                <span><Icon.ChevronDoubleLeft/></span><span>First</span>
            </div>

            {hasPage(props.page, -1) &&
                <div className="app-data-page-previous"
                     onClick={() => props.getPage(getPage(props.page, -1))}>
                    <span><Icon.ChevronLeft/></span><span>Previous</span>
                </div>
            }

            {createPageList(props.page)}

            {hasPage(props.page, 1) &&
                <div className="app-data-page-next"
                     onClick={() => props.getPage(getPage(props.page, 1))}>
                    <span>Next</span><span><Icon.ChevronRight/></span>
                </div>
            }

            <div className="app-data-page-last"
                 onClick={() => props.getPage({number: props.page.last, size: props.page.size}) }>
                <span>Last</span><span><Icon.ChevronDoubleRight/></span>
            </div>
        </div>
}

export default PageOfList;
