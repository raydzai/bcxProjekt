const API_KEY = "AIzaSyCSvnRkJ1dMIfCP2Xbl7o2RPYJFn2KACBg"; 
const CX = "867a77faf6faf485c"; 

function search() {
    let query = document.getElementById("searchBox").value;
    let url = `https://www.googleapis.com/customsearch/v1?q=${query}&key=${API_KEY}&cx=${CX}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            let resultsDiv = document.getElementById("results");
            resultsDiv.innerHTML = "";

            data.items.forEach(item => {
                let resultItem = document.createElement("div");
                resultItem.innerHTML = `<h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
                                        <p>${item.snippet}</p>`;
                resultsDiv.appendChild(resultItem);
            });
        })
        .catch(error => console.error("Lỗi khi gọi API:", error));
}
