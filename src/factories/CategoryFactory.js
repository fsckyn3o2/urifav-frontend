
const CategoryFactory = {
    createCategory: (uuid = undefined, parent_uuid = undefined,
                    name = undefined, parent_name = undefined,
                    description = undefined, path = undefined, children = undefined,
                    shared = undefined, share_token = undefined,
                    update_date = undefined, creation_date = undefined) => ({
        "uuid": uuid,
        "parent_uuid": parent_uuid,
        "parent_name": parent_name,
        "name": name,
        "description": description,
        "path": path,
        "children": children,
        "shared": shared,
        "share_token": share_token,
        "creation_date": creation_date,
        "update_date": update_date
    }),
    emptyCategory: () => CategoryFactory.createCategory(),
    cloneCategory: (category) => CategoryFactory.createCategory(
        category.uuid, category.parent_uuid, category.name, category.parent_name, category.description,
        category.path, category.children, category.shared, category.share_token,
        category.update_date, category.creation_date)
}

export default CategoryFactory;
