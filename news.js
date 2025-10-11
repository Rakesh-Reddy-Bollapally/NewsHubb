let api_key = "f1727d4336d1555a8dd2ad8b16d221d6"
let url = "https://gnews.io/api/v4/search"

let container = document.getElementById("container")
let loading = document.getElementById('loading');
let searchBox = document.getElementById('searchBox');

let fetchData = async (search) => {
    container.innerHTML = '';
    try {
        loading.style.display = 'block';

        // Encode the original API URL
        const targetURL = `${url}?q=${search}&lang=en&country=in&max=100&apikey=${api_key}`;
        const proxyURL = `https://api.allorigins.win/get?url=${encodeURIComponent(targetURL)}`;

        let response = await fetch(proxyURL);
        if (!response.ok) {
            showErrorMessage("Server problem. Please try again later.");
            loading.style.display = 'none';
            return;
        }

        let proxyData = await response.json();
        let jsondata = JSON.parse(proxyData.contents);

        loading.style.display = 'none';

        if (!jsondata.articles || jsondata.articles.length === 0) {
            showErrorMessage("No results found. Try a different search.");
            return;
        }

        jsondata.articles.forEach(article => {
            let div = document.createElement("div");
            div.style.width = "400px";
            div.style.height = "auto";
            div.style.border = "1px solid black";
            div.style.borderRadius = "5px";
            div.style.padding = "20px 0 0 0";
            div.className = "card";

            let innerdiv = document.createElement("div");
            innerdiv.style.padding = "15px";

            let heading = document.createElement("h1");
            heading.innerText = article.title;
            heading.style.fontSize = "20px";
            heading.style.fontWeight = "600";
            heading.style.fontFamily = "Winky Rough";
            heading.style.marginBottom = "20px";

            let image = document.createElement("img");
            image.setAttribute("src", article.image || '');
            image.style.width = "400px";
            image.style.height = "250px";
            image.style.marginBottom = "20px";
            image.style.borderRadius = "5px";
            image.className = "img";

            let newslink = document.createElement("a");
            newslink.setAttribute("href", article.url);
            newslink.setAttribute("target", "_blank");
            newslink.innerText = article.url;
            newslink.style.textDecoration = "none";
            newslink.style.color = "rgb(27, 27, 116)";
            newslink.style.fontFamily = "Winky Rough";
            newslink.style.fontWeight = "500";

            container.appendChild(div);
            div.appendChild(image);
            div.appendChild(innerdiv);
            innerdiv.appendChild(heading);
            innerdiv.appendChild(newslink);
        });

    } catch (error) {
        console.log(error);
        loading.style.display = 'none';
        showErrorMessage("Network error. Please try again.");
    }
}


searchBox.addEventListener('keypress', async function (event) {
    if (event.key === 'Enter') {
        let query = searchBox.value.trim();
        if (query) {
            fetchData(query);
            searchBox.value = "";
        }
    }
})

window.onload = function () {
    fetchData("technology")
}

function logout() {
    // Remove the stored token
    localStorage.removeItem('authToken'); // or sessionStorage.removeItem('authToken')
    window.location.href = "./login.html";
}

function showErrorMessage(message) {
    let msg = document.createElement("h2")
    msg.innerText = message;
    document.body.append(msg)
    msg.style.fontFamily = "Winky Rough";
    msg.style.fontWeight = "600"
    msg.style.color = "red"
    msg.style.fontSize = "40px";
    msg.style.textAlign = "center"
    container.appendChild(msg)
}

function updatePlaceholders() {
    let Input = document.querySelector('input[placeholder="Press Enter to search..."]');
    // console.log(Input)


    if (window.innerWidth <= 768) {
        if (Input) Input.placeholder = "Search";
    } else {
        if (Input) Input.placeholder = "Press Enter to search...";
    }
}

window.addEventListener("load", updatePlaceholders);
window.addEventListener("resize", updatePlaceholders);



