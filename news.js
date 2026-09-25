
const WORKER_URL =
    "https://news-api-proxy.rakeshreddybollapally.workers.dev/";

const container = document.getElementById("container");
const loading = document.getElementById("loading");
const searchBox = document.getElementById("searchBox");

console.log("News application initialized.");
console.log("Worker URL:", WORKER_URL);

async function fetchData(search) {
    console.log("-----------------------------------");
    console.log("fetchData() called");
    console.log("Search query:", search);

    if (!search || !search.trim()) {
        console.warn("Empty search query. Request skipped.");
        return;
    }

    container.innerHTML = "";
    loading.style.display = "block";

    try {
        const url = `${WORKER_URL}?q=${encodeURIComponent(search.trim())}`;

        console.log("Request URL:", url);
        console.log("Sending request to Cloudflare Worker...");

        const startTime = performance.now();

        const response = await fetch(url);

        const endTime = performance.now();

        console.log("Response received.");
        console.log("HTTP status:", response.status);
        console.log("Response OK:", response.ok);
        console.log(
            "Request duration:",
            `${(endTime - startTime).toFixed(2)} ms`
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API response error:", errorText);
            throw new Error(`API error: ${response.status}`);
        }

        const jsondata = await response.json();

        console.log("JSON response received:", jsondata);
        console.log("Total articles:", jsondata.totalArticles);
        console.log("Articles returned:", jsondata.articles?.length || 0);

        if (!jsondata.articles || jsondata.articles.length === 0) {
            console.warn("No articles found for:", search);
            showErrorMessage("No results found. Try a different search.");
            return;
        }

        console.log("Rendering news articles...");

        jsondata.articles.forEach((article, index) => {
            console.log(`Rendering article ${index + 1}:`, article.title);

            const card = document.createElement("div");
            card.className = "card";

            const image = document.createElement("img");
            image.className = "img";
            image.alt = article.title || "News image";
            image.loading = "lazy";

            if (article.image) {
                image.src = article.image;
            } else {
                console.warn("No image available:", article.title);
                image.style.display = "none";
            }

            const innerdiv = document.createElement("div");
            innerdiv.style.padding = "15px";

            const heading = document.createElement("h2");
            heading.textContent = article.title || "Untitled news";

            const description = document.createElement("p");
            description.textContent = article.description || "";

            const newslink = document.createElement("a");
            newslink.href = article.url;
            newslink.target = "_blank";
            newslink.rel = "noopener noreferrer";
            newslink.textContent = "Read full article";

            card.appendChild(image);
            card.appendChild(innerdiv);
            innerdiv.appendChild(heading);
            innerdiv.appendChild(description);
            innerdiv.appendChild(newslink);

            container.appendChild(card);
        });

        console.log(
            `Successfully rendered ${jsondata.articles.length} articles.`
        );

    } catch (error) {
        console.error("News fetch failed.");
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Full error:", error);

        showErrorMessage(
            error.message || "Unable to fetch news. Check the browser console."
        );

    } finally {
        loading.style.display = "none";
        console.log("Loading indicator hidden.");
        console.log("fetchData() completed.");
        console.log("-----------------------------------");
    }
}

function showErrorMessage(message) {
    console.warn("Displaying error message:", message);

    const msg = document.createElement("h2");
    msg.textContent = message;
    msg.style.color = "red";
    msg.style.textAlign = "center";

    container.appendChild(msg);
}

searchBox.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        const query = searchBox.value.trim();

        console.log("Enter key pressed.");
        console.log("Search input:", query);

        if (query) {
            fetchData(query);
            searchBox.value = "";
        } else {
            console.warn("Search input is empty.");
        }
    }
});

window.addEventListener("load", () => {
    console.log("Page loaded. Fetching default technology news.");
    fetchData("technology");
});

function logout() {
    console.log("Logout initiated.");

    localStorage.removeItem("authToken");
    window.location.href = "./login.html";
}

function updatePlaceholders() {
    if (searchBox) {
        searchBox.placeholder =
            window.innerWidth <= 768
                ? "Search"
                : "Press Enter to search...";

        console.log(
            "Search placeholder updated:",
            searchBox.placeholder
        );
    }
}

window.addEventListener("load", updatePlaceholders);
window.addEventListener("resize", updatePlaceholders);
