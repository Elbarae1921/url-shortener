function submitButtonClick() {
    let url = document.getElementById("url").value.trim();

    if (url == "") {
        return;
    }

    if (!validURL(url)) {
        document.getElementById("url").style.borderColor = "red";
        document.getElementById("button").style.borderColor = "red";
        return;
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
            document.getElementById("url").style.borderColor = "#303030";
        document.getElementById("button").style.borderColor = "#303030";
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

function validURL(str) {
    let url = new RegExp("^(https?:\/\/)([a-zA-Z0-9-_~?]+\.)?[a-zA-Z0-9-_~?]+\.[a-zA-Z0-9-_~?]+.*$"); // https://www.google.de/sads
    let url2 = new RegExp("^(https?:\/\/)([a-zA-Z0-9-_~?]+:)[0-9]+.*$"); // google:3432/jah
    let url3 = new RegExp("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}[0-9]{1,3}\.[0-9]{1,3}(:[0-9]+)?.*$"); // 1.2.3.4:2443/sjdgajhs

    return url.test(str) || url2.test(str) || url3.test(str);
}
