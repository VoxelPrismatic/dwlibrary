function _(e) { e.$ = (q) => $(q, e); e.$$ = (q) => $$(q, e); e._$ = (q) => _$(q, e); return e; }
function $(q, e = document) { r = e.querySelector(q); return _(r); }
function $$(q, e = document) { r = [...e.querySelectorAll(q)]; r.map((j) => _(j)); return r; }
function _$(q, e = document) { r = document.createElement(q); e.appendChild(r); return _(r); }

const sun = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.64338 5.18899L7.56701 6.10541C7.52707 6.58478 7.50709 6.82447 7.40373 7.01167C7.31261 7.1767 7.1767 7.31261 7.01167 7.40373C6.82447 7.50709 6.58477 7.52707 6.10541 7.56701L5.18898 7.64338C4.16259 7.72892 3.6494 7.77168 3.39642 8.00615C3.17627 8.21018 3.05941 8.50232 3.07812 8.8019C3.09961 9.14615 3.44174 9.53105 4.126 10.3008L4.69153 10.9371C5.02586 11.3132 5.19302 11.5012 5.2565 11.7135C5.31243 11.9004 5.31243 12.0997 5.2565 12.2866C5.19302 12.4988 5.02586 12.6869 4.69153 13.063L4.126 13.6992C3.44174 14.469 3.09961 14.8539 3.07812 15.1982C3.05941 15.4978 3.17627 15.7899 3.39642 15.9939C3.6494 16.2284 4.16259 16.2712 5.18899 16.3567L6.10541 16.4331C6.58478 16.473 6.82446 16.493 7.01167 16.5964C7.1767 16.6875 7.31261 16.8234 7.40373 16.9884C7.50709 17.1756 7.52707 17.4153 7.56701 17.8947L7.64338 18.8111C7.72892 19.8375 7.77168 20.3507 8.00615 20.6037C8.21018 20.8238 8.50232 20.9407 8.8019 20.922C9.14615 20.9005 9.53105 20.5583 10.3008 19.8741L10.9371 19.3085C11.3132 18.9742 11.5012 18.8071 11.7135 18.7436C11.9004 18.6876 12.0997 18.6876 12.2866 18.7436C12.4988 18.8071 12.6869 18.9742 13.063 19.3085L13.6992 19.8741C14.469 20.5583 14.8539 20.9005 15.1982 20.922C15.4978 20.9407 15.7899 20.8238 15.9939 20.6037C16.2284 20.3507 16.2712 19.8375 16.3567 18.8111L16.4331 17.8947C16.473 17.4153 16.493 17.1756 16.5964 16.9884C16.6875 16.8234 16.8234 16.6875 16.9884 16.5964C17.1756 16.493 17.4153 16.473 17.8947 16.4331L18.8111 16.3567C19.8375 16.2712 20.3507 16.2284 20.6037 15.9939C20.8238 15.7899 20.9407 15.4978 20.922 15.1982C20.9005 14.8539 20.5583 14.469 19.8741 13.6992L19.3085 13.063C18.9742 12.6869 18.8071 12.4988 18.7436 12.2866C18.6876 12.0997 18.6876 11.9004 18.7436 11.7135C18.8071 11.5012 18.9742 11.3132 19.3085 10.9371L19.8741 10.3008C20.5583 9.53105 20.9005 9.14615 20.922 8.8019C20.9407 8.50232 20.8238 8.21018 20.6037 8.00615C20.3507 7.77168 19.8375 7.72892 18.8111 7.64338L17.8947 7.56701C17.4153 7.52707 17.1756 7.50709 16.9884 7.40373C16.8234 7.31261 16.6875 7.1767 16.5964 7.01167C16.493 6.82446 16.473 6.58478 16.4331 6.10541L16.3567 5.18898C16.2712 4.16259 16.2284 3.6494 15.9939 3.39642C15.7899 3.17627 15.4978 3.05941 15.1982 3.07812C14.8539 3.09961 14.469 3.44174 13.6992 4.126L13.063 4.69153C12.6869 5.02586 12.4988 5.19302 12.2866 5.2565C12.0997 5.31243 11.9004 5.31243 11.7135 5.2565C11.5012 5.19302 11.3132 5.02586 10.9371 4.69153L10.3008 4.126C9.53105 3.44174 9.14615 3.09961 8.8019 3.07812C8.50232 3.05941 8.21018 3.17627 8.00615 3.39642C7.77168 3.6494 7.72892 4.16259 7.64338 5.18899Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const moon = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.32031 11.6835C3.32031 16.6541 7.34975 20.6835 12.3203 20.6835C16.1075 20.6835 19.3483 18.3443 20.6768 15.032C19.6402 15.4486 18.5059 15.6834 17.3203 15.6834C12.3497 15.6834 8.32031 11.654 8.32031 6.68342C8.32031 5.50338 8.55165 4.36259 8.96453 3.32996C5.65605 4.66028 3.32031 7.89912 3.32031 11.6835Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const body = $("html");

const change_btn = $("body")._$("button");
change_btn.id = "theme";
change_btn.onmousedown = () => {
    if(body.style.colorScheme === "dark") {
        body.style.colorScheme = "light";
        change_btn.innerHTML = moon;
    } else {
        body.style.colorScheme = "dark";
        change_btn.innerHTML = sun;
    }
}

const theme_media = window.matchMedia("(prefers-color-scheme: dark)");
body.style.colorScheme = theme_media.matches ? "dark" : "light";
theme_media.onchange = (evt) => {
    body.style.colorScheme = evt.matches ? "light" : "dark";
    btn.onmousedown();
};

change_btn.onmousedown();
change_btn.onmousedown();

const min_col_width = 368;
let col_count = 0;
let column_order = {};

function masonry(listing) {
    if(!listing)
        return $$("div.masonry").forEach(masonry);

    const new_col_count = Math.max(1, Math.floor(listing.clientWidth / min_col_width));
    if (new_col_count == col_count)
        return;

    col_count = new_col_count;
    let index = 0;

    let columns = Array(col_count).fill(0).map(() => {
        return {
            "height": 0,
            "elem": document.createElement("div"),
            "index": index++
        }
    });

    if(!column_order[col_count]) {
        column_order[col_count] = Array(col_count).fill(0).map(() => []);
        var index_no = listing.$$(".post[data-index]").length;
        for(var post of listing.$$(".post:not([data-index])"))
            post.dataset.index = index_no++;

        const posts = Array.from(listing.$$(".post")).sort((a, b) => a.dataset.index - b.dataset.index);
        for(var post of posts) {
            let min_height = Math.min(...columns.map(c => c.height));
            let column = columns.find(c => c.height == min_height);
            column.height += post.clientHeight;
            column_order[col_count][column.index].push(post);
        }
    }

    for(var i = 0; i < col_count; i++)
        for(var post of column_order[col_count][i])
            columns[i].elem.appendChild(post);

    for(var column of listing.$$(".column"))
        column.remove();

    for(var column of columns) {
        column.elem.classList.add("column");
        column.elem.style.width = `${100 / col_count}%`;
        listing.appendChild(column.elem);
    }
}

window.onresize = () => masonry();
window.onload = () => masonry();
