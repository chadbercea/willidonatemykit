function searchItem() {
    let searchTerm = document.getElementById("searchTerm").value;

    fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchTerm: searchTerm }),
    })
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById("cardsContainer");
        container.innerHTML = ''; // clear any existing cards

        const items = data.items;
        if (!items || items.length === 0) {
            container.innerHTML = '<div class="col-12">No items found.</div>';
            return;
        }

        items.forEach((item, index) => {
            const cardCol = document.createElement('div');
            cardCol.className = 'col-12 mb-4';

            const card = document.createElement('div');
            card.className = 'card bg-dark text-white';

            if (item.gridImageLink) {
                const cardImageContainer = document.createElement('div');
                cardImageContainer.className = 'card-img-top text-center p-3'; 

                const cardImage = document.createElement('img');
                cardImage.src = item.gridImageLink;
                cardImage.alt = "Item Image";
                cardImage.className = "img-fluid";

                cardImageContainer.appendChild(cardImage);
                card.appendChild(cardImageContainer);
            }

            const navPills = document.createElement('ul');
            navPills.className = 'nav nav-pills nav-pills-custom mb-2';

            const tabContent = document.createElement('div');
            tabContent.className = 'tab-content pt-2';

            createCategory(card, navPills, tabContent, `info-${index}`, 'Info', [
                { key: 'name', label: 'Name' },
                { key: 'shortName', label: 'ShortName' },
                { key: 'basePrice', label: 'Base Price' }
            ], item);

            createCategory(card, navPills, tabContent, `price-${index}`, 'Price', [
                { key: 'basePrice', label: 'Base Price' },
                { key: 'avg24hPrice', label: 'Avg 24h Price' },
                { key: 'changeLast48h', label: 'Change Last 48h' },
                { key: 'changeLast48hPercent', label: 'Change Last 48h Percent' }
            ], item);

            createCategory(card, navPills, tabContent, `market-${index}`, 'Market', [
                { key: 'sellFor', label: 'Sell For' },
                { key: 'buyFor', label: 'Buy For' },
                { key: 'category', label: 'Category ID', subKey: 'id' }
            ], item);

            card.appendChild(navPills);
            card.appendChild(tabContent);
            cardCol.appendChild(card);
            container.appendChild(cardCol);
        });
    })
    .catch(error => {
        console.error("Error in fetching or processing data:", error);
    });
}

function createCategory(card, navPills, tabContent, uniqueId, title, fields, item) {
    const pill = document.createElement('li');
    pill.className = 'nav-item';
    
    const pillLink = document.createElement('a');
    pillLink.className = 'nav-link';
    pillLink.href = `#${uniqueId}`;
    pillLink.dataset.toggle = 'pill';
    pillLink.textContent = title;
    pill.appendChild(pillLink);

    if (navPills.children.length === 0) {
        pillLink.classList.add('active');
    }

    navPills.appendChild(pill);

    const tabPane = document.createElement('div');
    tabPane.className = 'tab-pane fade p-3';

    if (navPills.children.length === 1) {
        tabPane.classList.add('show', 'active');
    }

    tabPane.id = uniqueId;

    const table = document.createElement('table');
    table.className = 'table table-dark table-striped table-bordered';

    fields.forEach(field => {
        if (item[field.key]) {
            const row = document.createElement('tr');

            const labelCell = document.createElement('td');
            labelCell.textContent = field.label;
            row.appendChild(labelCell);

            const valueCell = document.createElement('td');

            if (field.key === "sellFor" || field.key === "buyFor") {
                let sortedList = item[field.key].sort((a, b) => b.priceRUB - a.priceRUB);
                sortedList.slice(0, 3).forEach(entry => {
                    const div = document.createElement('div');
                    div.innerHTML = entry.source + ': ' + entry.priceRUB + ' ₽';
                    valueCell.appendChild(div);
                });
            } else if (field.subKey) {
                valueCell.textContent = item[field.key][field.subKey];
            } else {
                valueCell.textContent = item[field.key];
            }

            row.appendChild(valueCell);
            table.appendChild(row);
        }
    });

    tabPane.appendChild(table);
    tabContent.appendChild(tabPane);
}
