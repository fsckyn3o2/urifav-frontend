
const UrlFactory = {
    createUrl: (uuid = undefined, name = undefined, url = undefined,
                shared = undefined, share_token = undefined,
                category_uuid = undefined, category_name = undefined,
                creation_date = undefined, update_date = undefined) => ({
        "uuid": uuid,
        "name": name,
        "url": url,
        "shared": shared,
        "share_token": share_token,
        "category_uuid": category_uuid,
        "category_name": category_name,
        "creation_date": creation_date,
        "update_date": update_date,
    }),
    emptyUrl: () => UrlFactory.createUrl(),
    cloneUrl: (url) => UrlFactory.createUrl(
        url.uuid, url.name, url.url, url.shared, url.share_token,
        url.category_uuid, url.category_name,
        url.creation_date, url.update_date
    )
};

export default UrlFactory;
