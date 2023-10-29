document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.more-less').forEach(function(link) {
        link.addEventListener('click', function() {
            let cardText = this.previousElementSibling; // Get the .card-text element
            if (cardText.style.webkitLineClamp === "2") {
                cardText.style.webkitLineClamp = "unset";
                cardText.style.maxHeight = "none";
                this.textContent = "Less";
                this.classList.add("btn", "btn-sm", "btn-primary"); // Style as Bootstrap small button
            } else {
                cardText.style.webkitLineClamp = "2";
                cardText.style.maxHeight = "4.4em";
                this.textContent = "More";
                this.classList.add("btn", "btn-sm", "btn-primary"); // Style as Bootstrap small button
            }
        });
    });
});
