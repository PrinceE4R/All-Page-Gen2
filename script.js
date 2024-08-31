const searchInput = document.querySelector('.search-bar');
const suggestionsContainer = document.querySelector('.suggestions-container');
let selectedIndex = -1;

document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.querySelector('.search-bar');
    const searchBarShadow = document.querySelector('.search-bar-shadow');

    searchBar.addEventListener('input', function() {
        if (this.validity.valid && this.value.trim() !== '') {
            searchBarShadow.style.height = '50%';
            searchBarShadow.style.top = 'calc(47.5% + 20px)';
        } else {
            searchBarShadow.style.height = '15%';
            searchBarShadow.style.top = 'calc(30% + 20px)';
        }
    });
    document.addEventListener('click', function(event) {
        if (!searchBar.contains(event.target)) {
            searchBarShadow.style.height = '15%';
            searchBarShadow.style.top = 'calc(30% + 20px)';
        }
    });
});



function fetchSuggestions(query) {
    const script = document.createElement('script');
    script.src = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}&callback=handleSuggestions`;
    document.body.appendChild(script);
    document.body.removeChild(script);
}

function handleSuggestions(suggestions) {
    suggestionsContainer.innerHTML = '';
    selectedIndex = -1;
    if (suggestions[1].length > 0) {
        suggestions[1].forEach((suggestion, index) => {
            const div = document.createElement('div');
            div.textContent = suggestion;
            div.className = 'suggestion';
            div.addEventListener('click', () => {
                searchInput.value = suggestion;
                performSearch(); // Now performs the search directly when clicked
            });
            suggestionsContainer.appendChild(div);
        });
        showSuggestions();
    } else {
        hideSuggestions();
    }
}

function showSuggestions() {
    suggestionsContainer.style.display = 'block';
    requestAnimationFrame(() => {
        suggestionsContainer.classList.add('active');
    });
}

function hideSuggestions() {
    suggestionsContainer.classList.remove('active');
    setTimeout(() => {
        suggestionsContainer.style.display = 'none';
    }, 100);
    selectedIndex = -1;
}

function isUrlOrWebsite(input) {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    const commonTLDs = [
        "com", "org", "net", "info", "biz", "xyz", "online", "site", "tech",
        "design", "me", "in", "us", "uk", "ca", "au", "de", "fr", "jp", "cn",
        "ru", "it", "edu", "gov", "mil", "int", "aero", "coop", "museum", "app",
        "blog", "shop", "social", "cloud", "bank", "health", "ai"
    ];

    return urlPattern.test(input) || commonTLDs.some(tld => input.endsWith(`.${tld}`));
}

function performSearch() {
    const query = searchInput.value.trim();

    if (isUrlOrWebsite(query)) {
        let url = query;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        console.log(`Opening URL: ${url}`);
        window.location.href = url; // Directly navigate to the URL
    } else {
        console.log(`Searching for: ${query}`);
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`; // Perform a Google search
    }

    searchInput.value = '';
    hideSuggestions();
}

searchInput.addEventListener('input', function () {
    const query = this.value.trim();
    if (query.length > 0) {
        fetchSuggestions(query);
    } else {
        hideSuggestions();
    }
});

searchInput.addEventListener('keydown', (e) => {
    const suggestions = suggestionsContainer.children;
    if (e.key === 'ArrowDown') {
        selectedIndex = (selectedIndex + 1) % suggestions.length;
        updateSelection();
    } else if (e.key === 'ArrowUp') {
        selectedIndex = (selectedIndex - 1 + suggestions.length) % suggestions.length;
        updateSelection();
    } else if (e.key === 'Enter') {
        if (selectedIndex >= 0) {
            searchInput.value = suggestions[selectedIndex].textContent;
            hideSuggestions();
        }
        performSearch();
        e.preventDefault();
    }
});

function updateSelection() {
    const suggestions = suggestionsContainer.children;
    for (let i = 0; i < suggestions.length; i++) {
        suggestions[i].classList.toggle('selected', i === selectedIndex);
    }
    if (selectedIndex >= 0) {
        suggestions[selectedIndex].scrollIntoView({ block: 'nearest' });
    }
}

document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
        hideSuggestions();
    }
});

function drawDrawer() {
    let drawer = document.querySelector('.triangular-drawer');
    if (drawer.style.transform === "translateX(60%)") {
        drawer.style.transform = "translateX(0%)";
    } else {
        drawer.style.transform = "translateX(60%)";
    }
}

function drawDrawer2() {
    let drawer2 = document.querySelector('.rectangular-drawer');
    if (drawer2.style.transform === "translate(0%, 0%)") {
        drawer2.style.transform = "translate(-85%, 0%)";
    } else {
        drawer2.style.transform = "translate(0%, 0%)";
    }
}

window.addEventListener('message', function(event) {
    const root = document.documentElement;
    // Ensure the message is coming from a trusted source (you can add more checks here)
    if (event.origin !== window.location.origin) return;
    // Check the message data
    if (event.data.checkboxChecked !== undefined) {
        if (event.data.checkboxChecked) {
            // Checkbox is checked (Dark mode)
            root.style.setProperty('--colour1', '#1A1A1A');
            root.style.setProperty('--colour2', '#dedede');
        } else {
            // Checkbox is unchecked (Light mode)
            root.style.setProperty('--colour1', '#dedede');
            root.style.setProperty('--colour2', '#1A1A1A');
        }
    }
});
window.onload = function() {
    var iframe = document.getElementById('bubbleFrame');
    iframe.onload = function() {
        iframe.contentWindow.postMessage({
            colour1: '#dedede',
            colour2: '#1A1A1A'
        }, '*');
    };
};

window.addEventListener('message', function(event) {
    if (event.data && event.data.action === 'navigate') {
      window.location.href = event.data.url;
    }
  });