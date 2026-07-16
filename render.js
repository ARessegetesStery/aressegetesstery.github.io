// Renders the arrays from content.js into the DOM. Runs synchronously at the
// end of <body> (not deferred) so there's no flash of missing content for
// JS-enabled visitors. See docs/superpowers/specs/2026-07-15-homepage-static-rebuild-design.md
// §8 for the accepted no-JS tradeoff this implies.

function renderNews() {
  const host = document.getElementById("news-list");
  host.innerHTML = newsItems
    .map(
      (item) => `
        <div class="news-item">
          <span class="item-date">${item.date}</span>
          <span>${item.html}</span>
        </div>`
    )
    .join("");
}

function renderPublications() {
  const host = document.getElementById("pub-list");
  host.innerHTML = publications
    .map((pub) => {
      const links = pub.links
        .map((l) => `<a href="${l.href}" target="_blank" rel="noopener noreferrer">${l.label}</a>`)
        .join("");
      return `
        <div class="pub">
          <div class="pub-image">
            <img src="${pub.image}" alt="${pub.title}" loading="lazy">
          </div>
          <div class="pub-text">
            <div class="pub-title">${pub.title}</div>
            <div class="pub-authors">${pub.authorsHtml}</div>
            <div class="pub-venue">${pub.venue}</div>
            <div class="pub-links">${links}</div>
          </div>
        </div>`;
    })
    .join("");
}

function renderEducation() {
  const host = document.getElementById("edu-list");
  host.innerHTML = education
    .map(
      (item) => `
        <li>
          <span class="item-date">${item.date}</span>
          <span>${item.html}</span>
        </li>`
    )
    .join("");
}

function renderTeaching() {
  const host = document.getElementById("teaching-list");
  host.innerHTML = teaching
    .map(
      (group) => `
        <div class="teaching-role">${group.role}</div>
        <ul>
          ${group.items.map((html) => `<li>${html}</li>`).join("")}
        </ul>`
    )
    .join("");
}

renderNews();
renderPublications();
renderEducation();
renderTeaching();
