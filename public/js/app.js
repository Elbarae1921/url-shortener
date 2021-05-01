function submitButtonClick() {
    let url = document.getElementById("url").value.trim();

    if (url == "") {
        return;
    }

    // TODO: change
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
    }

    fetch("shorten", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "url": url
        })
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById("title").innerText = data.shortUrl;
            document.getElementById("title").classList.add("copy-title");
        });
}

function copyTitle() {
    const el = document.createElement('textarea');
    el.value = document.getElementById("title").innerText;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}