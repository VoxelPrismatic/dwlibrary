function masonry(listing) {
    if(!listing)
        return $$("div.masonry").forEach(masonry);

    if(!listing.dataset.width)
        listing.dataset.width = 368;

    const col_count = Math.max(1, Math.floor(listing.clientWidth / listing.dataset.width));
    console.log("Column Count:", col_count);
    let index = 0;
    let columns = Array(col_count).fill(0).map(() => {
        return {
            "height": 0,
            "elem": document.createElement("div"),
            "index": index++,
        }
    });

    var index_no = listing.$$(".post[data-index]").length;
    for(var post of listing.$$(".post:not([data-index])"))
        post.dataset.index = index_no++;

    const posts = Array.from(listing.$$(".post")).sort((a, b) => a.dataset.index - b.dataset.index);
    for(var post of posts) {
        const min_height = Math.min(...columns.map((c) => c.height));
        const column = columns.find((c) => c.height === min_height);
        column.height += post.clientHeight;
        column.elem.appendChild(post);
    }

    for(var column of listing.$$(".column"))
        column.remove();

    for(var column of columns) {
        column.elem.classList.add("column");
        // column.elem.style.width = `${100 / col_count}%`;
        listing.appendChild(column.elem)
    }
}

window.addEventListener("resize", () => masonry());
window.addEventListener("load", () => { masonry(); window.setTimeout(masonry, 50) });

