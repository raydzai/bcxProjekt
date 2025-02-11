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

