
const api_key = "61cd4d9b932740eabd416ca9d3397557";
const url = "https://gnews.io/api/v4/search";

const container = document.getElementById("container");
const loading = document.getElementById("loading");
const searchBox = document.getElementById("searchBox");

async function fetchData(search) {
    if (!search || !search.trim()) return;

    container.innerHTML = "";
    loading.style.display = "block";

    try {
        const params = new URLSearchParams({
            q: search.trim(),
            lang: "en",
            country: "in",
            max: "10",
            apikey: api_key
        });

        const response = await fetch(`${url}?${params}`);

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error("API quota exceeded. Check your GNews usage.");
            }

            if (response.status === 401) {
                throw new Error("Invalid API key. Check your GNews dashboard.");
            }

            if (response.status === 429) {
                throw new Error("Too many requests. Please wait and try again.");
            }

            throw new Error(`API error: ${response.status}`);
        }

        const jsondata = await response.json();

        if (!jsondata.articles || jsondata.articles.length === 0) {
            showErrorMessage("No results found. Try a different search.");
            return;
        }

        jsondata.articles.forEach(article => {
            const card = document.createElement("div");
            card.className = "card";

            const image = document.createElement("img");
            image.className = "img";
            image.src = article.image || "";
            image.alt = article.title || "News image";
            image.loading = "lazy";

            if (!article.image) {
                image.style.display = "none";
            }

            const innerdiv = document.createElement("div");
            innerdiv.style.padding = "15px";

            const heading = document.createElement("h2");
            heading.textContent = article.title || "Untitled news";

            const newslink = document.createElement("a");
            newslink.href = article.url;
            newslink.target = "_blank";
            newslink.rel = "noopener noreferrer";
            newslink.textContent = "Read full article";

            card.appendChild(image);
            card.appendChild(innerdiv);
            innerdiv.appendChild(heading);
            innerdiv.appendChild(newslink);

            container.appendChild(card);
        });

    } catch (error) {
    console.error("Fetch error:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);

    showErrorMessage(
        "Unable to fetch news. Check the browser console."
    );
}
    } finally {
        loading.style.display = "none";
    }
}

function showErrorMessage(message) {
    const msg = document.createElement("h2");
    msg.textContent = message;
    msg.style.color = "red";
    msg.style.textAlign = "center";
    container.appendChild(msg);
}

searchBox.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        const query = searchBox.value.trim();

        if (query) {
            fetchData(query);
            searchBox.value = "";
        }
    }
});

window.addEventListener("load", () => {
    fetchData("technology");
});

function logout() {
    localStorage.removeItem("authToken");
    window.location.href = "./login.html";
}

function updatePlaceholders() {
    if (searchBox) {
        searchBox.placeholder =
            window.innerWidth <= 768
                ? "Search"
                : "Press Enter to search...";
    }
}

window.addEventListener("load", updatePlaceholders);
window.addEventListener("resize", updatePlaceholders);
