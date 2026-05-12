const fs = require('fs');
const path = require('path');

const REGIONS_DIR = './regions';
const TEMPLATE_FILE = './template.html';
const OUTPUT_DIR = './public';
const ASSETS_SRC = './assets';

const template = fs.readFileSync(TEMPLATE_FILE, 'utf8');

// Copy assets directory into public/
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
copyDir(ASSETS_SRC, path.join(OUTPUT_DIR, 'assets'));

function renderLinks(sections) {
  let html = '';
  for (const section of sections) {
    if (section.links.length === 0) continue;
    if (section.title) {
      html += `      <h2 class="section-title">${section.title}</h2>\n`;
    }
    for (const link of section.links) {
      html += `      <a href="${link.url}" class="link-button" target="_blank" rel="noopener noreferrer">${link.title}</a>\n`;
    }
  }
  return html;
}

function renderPage(name, description, linksHtml) {
  return template
    .replace(/{{name}}/g, name)
    .replace(/{{description}}/g, description)
    .replace(/{{links}}/g, linksHtml);
}

// Build each region page
const regions = [];
const files = fs.readdirSync(REGIONS_DIR).filter(f => f.endsWith('.json')).sort();

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(REGIONS_DIR, file), 'utf8'));
  const slug = file.replace('.json', '');
  regions.push({ slug, name: data.profile.name, region: data.region });

  const linksHtml = renderLinks(data.sections || []);
  const html = renderPage(data.profile.name, data.profile.description, linksHtml);

  const outDir = path.join(OUTPUT_DIR, slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html);
  console.log(`✓ Built /${slug}`);
}

// Build index page listing all regions
const regionCardsHtml = regions.map(r =>
  `      <a href="/${r.slug}" class="region-card">\n        <span>${r.name}</span>\n        <span class="arrow">→</span>\n      </a>`
).join('\n');

const indexHtml = renderPage(
  'Elastic Community Links',
  'Connect with the Elastic community in your region.',
  regionCardsHtml
);

fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), indexHtml);
console.log('✓ Built /');
console.log(`\nDone — ${regions.length} region(s) + index`);
