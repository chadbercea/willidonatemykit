function searchItem() {
    const searchValue = document.getElementById("searchInput").value;

    fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `item_name=${searchValue}`
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("itemName").textContent = data.name || "Error occurred!";
        document.getElementById("itemImage").src = data.gridImageLink;
        document.getElementById("itemImage").alt = data.name;
        document.getElementById("itemShortName").textContent = data.shortName;
        document.getElementById("itemBasePrice").textContent = data.basePrice;
        document.getElementById("itemAvg24hPrice").textContent = data.avg24hPrice;
        document.getElementById("itemChangeLast48h").textContent = data.changeLast48h;
        document.getElementById("itemChangeLast48hPercent").textContent = data.changeLast48hPercent;
        document.getElementById("itemCategoryID").textContent = data.category?.id;

        // Handle sellFor and buyFor arrays
        const sellList = document.getElementById("sellList");
        sellList.innerHTML = '';
        data.sellFor.forEach(sell => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.innerHTML = `<strong>Price:</strong> ${sell.price}, <strong>Currency:</strong> ${sell.currency}, <strong>Price in RUB:</strong> ${sell.priceRUB}, <strong>Source:</strong> ${sell.source}`;
            sellList.appendChild(li);
        });

        const buyList = document.getElementById("buyList");
        buyList.innerHTML = '';
        data.buyFor.forEach(buy => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.innerHTML = `<strong>Price:</strong> ${buy.price}, <strong>Currency:</strong> ${buy.currency}, <strong>Price in RUB:</strong> ${buy.priceRUB}, <strong>Source:</strong> ${buy.source}`;
            buyList.appendChild(li);
        });

        document.getElementById("wikiLink").href = data.wikiLink;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
