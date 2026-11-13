/** 转换 sitemap（不修改入参，返回新对象） */
export function transformSitemap(site, options) {
    const { profile, accessDefault, loadLayout } = options;
    const fillPublic = accessDefault === 'public';
    const next = { ...site };
    const rawLayouts = isRecord(site.layouts) ? site.layouts : {};
    const layouts = {};
    for (const [name, def] of Object.entries(rawLayouts)) {
        layouts[name] =
            typeof def === 'string' && profile.inlineStringLayouts ? loadLayout(def) : def;
    }
    next.layouts = layouts;
    const rawPages = Array.isArray(site.pages) ? site.pages : [];
    next.pages = rawPages.map((page) => {
        const nextPage = { ...page };
        if (profile.forceInlinePages) {
            delete nextPage.lazy;
        }
        if (fillPublic && isAccessUndeclared(nextPage)) {
            nextPage.public = true;
        }
        return nextPage;
    });
    const rawMenus = Array.isArray(site.menus) ? site.menus : [];
    const transformMenu = (menu) => {
        const nextMenu = { ...menu };
        if (profile.stripMenuPaths) {
            delete nextMenu.path;
        }
        if (fillPublic && isAccessUndeclared(nextMenu)) {
            nextMenu.public = true;
        }
        if (Array.isArray(nextMenu.children)) {
            nextMenu.children = nextMenu.children.map((child) => isRecord(child) ? transformMenu(child) : child);
        }
        return nextMenu;
    };
    next.menus = rawMenus.map((menu) => (isRecord(menu) ? transformMenu(menu) : menu));
    return {
        site: next,
        layoutCount: Object.keys(layouts).length,
        pageCount: rawPages.length,
        menuCount: rawMenus.length,
    };
}
function isRecord(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}
/** 条目未显式声明访问属性（既无 public 也无 permission）时才允许填充缺省值 */
function isAccessUndeclared(entry) {
    return entry.public === undefined && entry.permission === undefined;
}
