async function uploadImage(elem) {
    cache_svg();
    const label = $("label[data-for='" + elem.id + "']");
    const button = label.$("button");

    label.onclick = () => elem.click();
    button.classList.add("rot");
    button.innerHTML = SVG.loader;

    const file = elem.files[0];
    const data = new FormData();
    data.append("file", file);
    const resp = await fetch("/htmx/upload", {
        method: "POST",
        body: data
    });

    const target = $(elem.dataset.for);
    const src = await resp.text();

    target.src = src;
    target.nextElementSibling.value = src;

    button.classList.remove("rot");
    button.innerHTML = SVG.upload;
}
