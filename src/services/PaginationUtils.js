
function pageFromHttpResponse(res) {
    return {
        number: Number.parseInt(res.xhr.getResponseHeader('page-number')),
        size: Number.parseInt(res.xhr.getResponseHeader('page-size')),
        last: Number.parseInt(res.xhr.getResponseHeader('page-last'))
    }
}

function validatePage(page) {
    return !((page.number < 1 && page.number !== -1) || page.size <= 0 || page.size > 1000);
}

const PaginationUtils = {fromHttpResponse: pageFromHttpResponse, validatePage: validatePage};
export default PaginationUtils;
