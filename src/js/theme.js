const SVG = {};
function cache_svg() {
    for(var e of $$("svg.svg-cache[data-id]"))
        SVG[e.dataset.id] = e.outerHTML;
}

window.addEventListener("click", cache_svg);
window.addEventListener("load", cache_svg);

window.addEventListener("load", () => {
    window.body = $("html");
    window.change_btn = $("#theme");
    change_btn.onmousedown = () => {
        const light = body.style.colorScheme === "light";
        body.style.colorScheme = light ? "dark" : "light";
        change_btn.title = light ? "Switch to Light Mode" : "Switch to Dark Mode";
        change_btn.innerHTML = light ? SVG.sun : SVG.moon;
    }

    const theme_media = window.matchMedia("(prefers-color-scheme: dark)");
    body.style.colorScheme = theme_media.matches ? "dark" : "light";

    theme_media.onChange = (evt) => {
        body.style.colorScheme = evt.matches ? "light" : "dark";
        btn.onmousedown();
    }

    change_btn.onmousedown();
    change_btn.onmousedown();
})
