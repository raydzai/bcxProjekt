let i = 1;

function handleKeyPress(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Không cho xuống dòng trong `textarea`
        redirectToSearch(); // Gọi hàm xử lý tìm kiếm
    }
}

function adjustHeight(el) {
    el.style.height = "20px"; // Reset height để tính lại kích thước thực  
    if (el.scrollHeight > el.clientHeight) {
        el.style.height = el.scrollHeight - 20 + "px"; // Mở rộng khi nội dung vượt quá kích thước hiện tại
    }
}



function redirectToSearch() {
    let query = document.getElementById("searchBox").value;
    if (query.trim() !== "") {
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
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
            redirectToSearch(); // Chuyển hướng đến trang tìm kiếm ngay sau khi chọn gợi ý
        };
        suggestionBox.appendChild(li);
    });
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


document.addEventListener("click", function (event) {
    let suggestionBox = document.getElementById("suggestion-box");
    if (!suggestionBox.contains(event.target) && event.target !== document.getElementById("searchBox")) {
        suggestionBox.innerHTML = ""; // Xóa danh sách gợi ý khi click ra ngoài
    }
});

