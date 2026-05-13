const fs = require('fs');
const path = require('path');

const REGIONS_DIR = path.join(__dirname, '..', 'regions');
const files = fs.readdirSync(REGIONS_DIR).filter(f => f.endsWith('.json'));

let hasError = false;

for (const file of files) {
  const filePath = path.join(REGIONS_DIR, file);
  const raw = fs.readFileSync(filePath, 'utf8');

  // Check valid JSON
  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error(`\n❌ ${file}: Invalid JSON`);
    console.error(`   ${err.message}`);
    console.error(`   Tip: check for missing commas, extra commas, or unclosed brackets.\n`);
    hasError = true;
    continue;
  }

  // Check required fields
  if (!data.profile?.name) {
    console.error(`❌ ${file}: Missing "profile.name"`);
    hasError = true;
  }
  if (!data.profile?.description) {
    console.error(`❌ ${file}: Missing "profile.description"`);
    hasError = true;
  }
  if (!Array.isArray(data.sections)) {
    console.error(`❌ ${file}: "sections" must be an array`);
    hasError = true;
    continue;
  }

  // Check each link has title and url
  data.sections.forEach((section, si) => {
    if (!Array.isArray(section.links)) {
      console.error(`❌ ${file}: section[${si}] is missing a "links" array`);
      hasError = true;
      return;
    }
    section.links.forEach((link, li) => {
      if (!link.title) {
        console.error(`❌ ${file}: section[${si}].links[${li}] is missing a "title"`);
        hasError = true;
      }
      if (!link.url) {
        console.error(`❌ ${file}: section[${si}].links[${li}] is missing a "url"`);
        hasError = true;
      }
    });
  });

  if (!hasError) console.log(`✓ ${file}`);
}

if (hasError) {
  console.error('\nValidation failed. Fix the errors above before merging.');
  process.exit(1);
} else {
  console.log('\nAll region files are valid.');
}
