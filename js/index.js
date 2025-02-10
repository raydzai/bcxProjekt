function handleKeyPress(event) {
    if (event.keyCode === 13) {
        redirectToSearch();
    }
}

function adjustHeight(element) {
    element.style.height = "auto"; // Đặt lại auto để tính đúng chiều cao nội dung
    let newHeight = element.scrollHeight; // Lấy chiều cao thực sự của nội dung
    let minHeight = 40; // Chiều cao tối thiểu (tùy chỉnh theo thiết kế)
    
    // Chỉ tăng chiều cao khi nội dung thực sự cần
    element.style.height = Math.max(newHeight, minHeight) + "px";
}


function handleKeyPress(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Không cho xuống dòng trong `textarea`
        redirectToSearch(); // Gọi hàm xử lý tìm kiếm
    }
}

function redirectToSearch() {
    let query = document.getElementById("searchBox").value;
    if (query.trim() !== "") {
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
}

