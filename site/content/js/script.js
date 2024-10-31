function _(e) { e.$ = (q) => $(q, e); e.$$ = (q) => $$(q, e); e._$ = (q) => _$(q, e); return e; }
function $(q, e = document) { r = e.querySelector(q); return _(r); }
function $$(q, e = document) { r = [...e.querySelectorAll(q)]; r.map((j) => _(j)); return r; }
function _$(q, e = document) { r = document.createElement(q); e.appendChild(r); return _(r); }

const SVG = {};
for(var e of $$("svg.svg-cache[data-id]")) {
    SVG[e.dataset.id] = e.outerHTML;
}

const body = $("html");

const change_btn = $("#theme");
change_btn.onmousedown = () => {
    if(body.style.colorScheme === "dark") {
        body.style.colorScheme = "light";
        change_btn.title = "Switch to Dark Mode";
        change_btn.innerHTML = SVG.moon;
    } else {
        body.style.colorScheme = "dark";
        change_btn.title = "Switch to Light Mode";
        change_btn.innerHTML = SVG.sun;
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
window.onload = () => {
    masonry();
    column_order = {};
    col_count = 0;
    window.setTimeout(masonry, 50);
}


$("#home").onclick = () => location = "/";
$("#login").onclick = () => location = "/login";

if($("#edit")) {
    $("#edit").onclick = (evt) => {
        location = evt.currentTarget.dataset.href;
    }
}
