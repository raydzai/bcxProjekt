const apiKey = "AIzaSyA5rq2Rw7uqqbGuP7-uLHIKPt_Ec-bbobg";
const cx = "867a77faf6faf485c";

const searchBox = document.getElementById("searchBox");
const searchForm = document.getElementById("searchForm");
const resultsContainer = document.getElementById("results");
const searchTabs = document.querySelectorAll(".search-tab");

let currentQuery = "";
let currentPage = 1;
let searchType = "web"; // Mặc định là tìm kiếm web
const resultsPerPage = 10;

function fetchResults(query, page = 1, type = "web") {
    if (!query.trim()) return;

    // Update the document title based on the search query
    document.title = `${query} - bcx. Search`;

    resultsContainer.innerHTML = "<p>Đang tìm kiếm...</p>";
    document.getElementById("pagination")?.remove();

    let searchTypeParam = "";
    if (type === "image") searchTypeParam = "&searchType=image";
    if (type === "video") searchTypeParam = "&fileType=mp4&hq=video";

    let startIndex = (page - 1) * resultsPerPage + 1;
    let url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&start=${startIndex}${searchTypeParam}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            resultsContainer.innerHTML = "";
            if (!data.items || data.items.length === 0) {
                resultsContainer.innerHTML = "<p>Không tìm thấy kết quả.</p>";
                return;
            }

            data.items.forEach(item => {
                let result = document.createElement("div");
                result.classList.add("result-item");

                if (type === "image") {
                    result.innerHTML = `<a href="${item.link}" target="_blank"><img src="${item.link}" alt="${item.title}" style="max-width:100%;"></a>`;
                } else if (type === "video") {
                    result.innerHTML = `<a href="${item.link}" target="_blank"><p>${item.title}</p></a>`;
                } else {
                    let thumbnail = item.pagemap?.cse_thumbnail ? item.pagemap.cse_thumbnail[0].src : "";
                    result.innerHTML = `
                        <div class="result-preview">
                            ${thumbnail ? `<img src="${thumbnail}" class="preview-img" alt="Preview">` : ""}
                            <div class="result-text">
                                <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
                                <p>${item.snippet}</p>
                                <small>${item.displayLink}</small>
                            </div>
                        </div>
                    `;
                }
                
                resultsContainer.appendChild(result);
            });

            setupPagination(data.queries);
        })
        .catch(error => {
            console.error("Lỗi:", error);
            resultsContainer.innerHTML = "<p>Đã xảy ra lỗi khi tìm kiếm.</p>";
        });
}

function setupPagination(queries) {
    // Remove existing pagination if it exists
    const existingPagination = document.getElementById("pagination");
    if (existingPagination) {
        existingPagination.remove();
    }

    if (!queries.nextPage && !queries.previousPage) return;

    let paginationContainer = document.createElement("div");
    paginationContainer.id = "pagination";

    let pageNumbers = document.createElement("div");
    pageNumbers.classList.add("page-numbers");

    for (let i = 1; i <= 10; i++) {
        let pageLink = document.createElement("span");
        pageLink.innerText = i;
        pageLink.classList.add("page-link");
        if (i === currentPage) pageLink.classList.add("active");

        pageLink.addEventListener("click", () => changePage(i));
        pageNumbers.appendChild(pageLink);
    }

    paginationContainer.appendChild(pageNumbers);
    resultsContainer.after(paginationContainer);
}

function changePage(page) {
    currentPage = page;
    fetchResults(currentQuery, currentPage, searchType);
}

// Function to handle URL changes
function handleUrlChange() {
    const urlParams = new URLSearchParams(window.location.search);
    const newQuery = urlParams.get("q");
    if (newQuery) {
        searchBox.value = newQuery;
        currentQuery = newQuery;
        currentPage = 1;
        fetchResults(newQuery, currentPage, searchType);
        addPoint(); // Call addPoint() when the URL changes
    }
}

// Add event listener for popstate event
window.addEventListener("popstate", handleUrlChange);

// Initial URL handling
handleUrlChange();

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let newQuery = searchBox.value.trim();
    if (newQuery) {
        currentQuery = newQuery;
        currentPage = 1;
        window.history.pushState({}, "", `?q=${encodeURIComponent(newQuery)}`);
        fetchResults(newQuery, currentPage, searchType);
        addPoint(); // Call addPoint() when a new search is performed
    }
});

searchTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        document.querySelector(".search-tab.active").classList.remove("active");
        tab.classList.add("active");
        searchType = tab.getAttribute("data-type");
        currentPage = 1;
        fetchResults(currentQuery, currentPage, searchType);
    });
});

const urlParams = new URLSearchParams(window.location.search);
const initialQuery = urlParams.get("q");
if (initialQuery) {
    searchBox.value = initialQuery;
    currentQuery = initialQuery;
    fetchResults(initialQuery, currentPage, searchType);
}

function handleEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        searchForm.dispatchEvent(new Event("submit"));
    }
}

function handleInput() {
    let query = document.getElementById("searchBox").value.trim();
    let suggestionsContainer = document.getElementById("suggestion-box");

    if (query === "") {
        suggestionsContainer.innerHTML = "";
        return;
    }

    let url = `http://localhost:3000/suggest?q=${encodeURIComponent(query)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            let suggestions = data[1];
            showSuggestions(suggestions);
        })
        .catch(error => console.error("Lỗi khi lấy gợi ý:", error));
}

function showSuggestions(suggestions) {
    let suggestionBox = document.getElementById("suggestion-box");
    suggestionBox.innerHTML = ""; // Xóa gợi ý cũ

    suggestions.forEach(suggestion => {
        let li = document.createElement("li");
        li.textContent = suggestion;
        li.onclick = () => {
            document.getElementById("searchBox").value = suggestion;
            suggestionBox.innerHTML = ""; // Ẩn gợi ý khi chọn
            searchForm.dispatchEvent(new Event("submit")); // Chuyển hướng đến trang tìm kiếm ngay sau khi chọn gợi ý
        };
        suggestionBox.appendChild(li);
    });
}

document.addEventListener("click", function (event) {
    let suggestionBox = document.getElementById("suggestion-box");
    if (!suggestionBox.contains(event.target) && event.target !== document.getElementById("searchBox")) {
        suggestionBox.innerHTML = ""; // Xóa danh sách gợi ý khi click ra ngoài
    }
});

let points = localStorage.getItem("searchPoints") || 0;
document.getElementById("points").textContent = points;

function addPoint() {
    let pointElement = document.getElementById("pointDisplay");
    let floatingPoint = document.getElementById("floatingPoint");

    let currentPoints = parseInt(pointElement.innerText);
    pointElement.innerText = currentPoints + 1;

    // Hiển thị +1 ngay bên dưới số điểm
    floatingPoint.innerText = "+1";
    floatingPoint.style.opacity = "1";
    floatingPoint.style.transform = "translate(-50%, -20px)";

    // Xóa hiệu ứng bay lên sau 0.6s
    setTimeout(() => {
        floatingPoint.style.opacity = "0";
        floatingPoint.style.transform = "translate(-50%, 0)";
    }, 600);

    // Hiệu ứng phóng to số điểm chính
    pointElement.classList.add("animated-point");
    setTimeout(() => {
        pointElement.classList.remove("animated-point");
    }, 300);
}

let point = localStorage.getItem("searchPoints") || 0;
let trees = localStorage.getItem("plantedTrees") || 0;

document.getElementById("pointDisplay").textContent = point;
document.getElementById("treeCount").textContent = trees;
updateConvertButton();

function addPoint() {
    let pointElement = document.getElementById("pointDisplay");
    let floatingPoint = document.getElementById("floatingPoint");

    let currentPoints = parseInt(pointElement.innerText);
    currentPoints++;
    pointElement.innerText = currentPoints;
    localStorage.setItem("searchPoints", currentPoints);

    floatingPoint.innerText = "+1";
    floatingPoint.style.opacity = "1";
    floatingPoint.style.transform = "translate(-50%, -20px)";

    setTimeout(() => {
        floatingPoint.style.opacity = "0";
        floatingPoint.style.transform = "translate(-50%, 0)";
    }, 600);

    pointElement.classList.add("animated-point");
    setTimeout(() => {
        pointElement.classList.remove("animated-point");
    }, 300);

    updateConvertButton();
}

function convertPoints() {
    let pointElement = document.getElementById("pointDisplay");
    let treeElement = document.getElementById("treeCount");
    let currentPoints = parseInt(pointElement.innerText);
    let currentTrees = parseInt(treeElement.innerText);

    if (currentPoints >= 10) {
        currentPoints -= 10;
        currentTrees += 1;

        pointElement.innerText = currentPoints;
        treeElement.innerText = currentTrees;

        localStorage.setItem("searchPoints", currentPoints);
        localStorage.setItem("plantedTrees", currentTrees);

        updateConvertButton();
    }
}

function updateConvertButton() {
    let convertButton = document.getElementById("convertButton");
    let currentPoints = parseInt(document.getElementById("pointDisplay").innerText);

    if (currentPoints >= 10) {
        convertButton.disabled = false;
    } else {
        convertButton.disabled = true;
    }
}
