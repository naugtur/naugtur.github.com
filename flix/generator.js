const fs = require("fs");
const { parseHTML } = require("linkedom");

const links = require("./links.json");

async function fetchPreviewData(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const { document } = parseHTML(html);

    const previewText = document.querySelector(
      'meta[property="og:title"]'
    )?.content;
    const previewImage = document.querySelector(
      'meta[property="og:image"]'
    )?.content;

    return { previewText, previewImage };
  } catch (error) {
    console.error(`Error fetching the document for ${url}:`, error);
    return {};
  }
}

async function generateHtml() {
  const linkPreviews = await Promise.all(
    links.map(async (link) => {
      const { previewText, previewImage } = await fetchPreviewData(link);
      return `
            <a href="${link}">
            ${
              previewImage
                ? `<img src="${previewImage}" alt="Preview Image">`
                : ""
            }
                <span>${previewText || ""}</span>
            </a>
        `;
    })
  );

  const htmlContent = `
        <!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="height=device-height,
  width=device-width, initial-scale=1.0,
  minimum-scale=1.0">
  <title>naugtur</title>
  <link rel="stylesheet" href="style.css">

</head>

<body>
  <base target="_blank" />
  <h1>Links to things I said in public</h1>
  <div class="container">
    ${linkPreviews.join("")}
  </div>
</body>
</html>
    `;

  fs.writeFileSync("index.html", htmlContent, "utf8");
  console.log("HTML file has been generated: index.html");
}

generateHtml();
