import { readFile } from "node:fs/promises";
import {
  pathOrder,
  pathData,
  lessonGuides,
  studioMissions,
  workspaceBlueprints,
  codeStarters,
  hints,
  placementQuiz,
  changelog,
  siteUrl,
  authorName,
  authorUrl,
  lessonSlug,
  slugify,
  lessonUrl,
  pathUrl
} from "./curriculum.js";

const [html, css, js, runner, sw, curriculum] = await Promise.all([
  readFile("index.html", "utf8"),
  readFile("styles.css", "utf8"),
  readFile("app.js", "utf8"),
  readFile("lab-runner.htm", "utf8"),
  readFile("sw.js", "utf8"),
  readFile("curriculum.js", "utf8")
]);

const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
const duplicateIds = [...html.matchAll(/\sid="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((id, index, all) => all.indexOf(id) !== index);
const localTargets = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
const missingTargets = localTargets.filter((target) => !ids.has(target));
const required = [
  "<main",
  "<nav",
  "<h1",
  "skip-link",
  "prefers-reduced-motion",
  "showModal",
  "sandbox=\"allow-scripts\"",
  "lesson-dialog",
  "openLesson",
  "knowledge-check",
  "completeActiveLesson",
  "studio-workspace",
  "renderStudioWorkspace",
  "Submit studio artifact",
  "workspacesKey",
  "data-quiz-groups",
  "data-studio",
  "placement-dialog",
  "changelog-dialog",
  "about-dialog",
  "certificate-dialog",
  "data-import-backup",
  "data-open-about",
  "learnwebRun",
  "learnwebHeartbeat",
  "offline.html",
  "SKIP_WAITING",
  "update-banner-dismiss",
  "search-count",
  "code-editor-panel",
  "workspace-code-panel",
  "--focus-ring",
  "data-release-label",
  "releaseLabel",
  "globalThis.scheduler",
  "about.html"
];
const corpus = `${html}\n${css}\n${js}\n${runner}\n${sw}\n${curriculum}`;
const missingRequired = required.filter((token) => !corpus.includes(token));
const forbidden = ["onclick=", "allow-modals"];
const forbiddenFound = forbidden.filter((token) => corpus.toLowerCase().includes(token));

// ————— generated static output integrity —————

const generatedFileNames = [
  "public/learn/index.html",
  ...pathOrder.flatMap((pathId) => [
    `public/learn/${pathId}/index.html`,
    ...pathData[pathId].modules.map((_, index) => `public/learn/${pathId}/${lessonSlug(pathId, index)}/index.html`)
  ])
];
const generatedEntries = await Promise.all(generatedFileNames.map(async (file) => [file, await readFile(file, "utf8")]));
const generatedPages = new Map(generatedEntries);
const generatedErrors = [];

function generatedJsonLd(file) {
  const markup = generatedPages.get(file);
  const scripts = [...markup.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (scripts.length !== 1) {
    generatedErrors.push(`${file}: expected exactly one JSON-LD script`);
    return null;
  }
  try {
    return JSON.parse(scripts[0][1]);
  } catch (error) {
    generatedErrors.push(`${file}: invalid JSON-LD (${error.message})`);
    return null;
  }
}

function hasTwitterMetadata(file) {
  const markup = generatedPages.get(file);
  for (const name of ["twitter:title", "twitter:description", "twitter:image"]) {
    if (!markup.includes(`<meta name="${name}" content="`)) generatedErrors.push(`${file}: missing ${name}`);
  }
}

const expectedProvider = { "@type": "Person", name: authorName, url: authorUrl };
const hubFile = "public/learn/index.html";
const hubJsonLd = generatedJsonLd(hubFile);
hasTwitterMetadata(hubFile);
const hubGraph = Array.isArray(hubJsonLd?.["@graph"]) ? hubJsonLd["@graph"] : [];
const hubItemList = hubGraph.find((item) => item?.["@type"] === "ItemList");
if (!hubItemList) {
  generatedErrors.push(`${hubFile}: missing Course ItemList JSON-LD`);
} else {
  const listItems = hubItemList.itemListElement;
  if (!Array.isArray(listItems) || listItems.length !== pathOrder.length) {
    generatedErrors.push(`${hubFile}: Course ItemList must contain ${pathOrder.length} paths`);
  } else {
    const seenUrls = new Set();
    listItems.forEach((listItem, index) => {
      const pathId = pathOrder[index];
      const expectedUrl = `${siteUrl}${pathUrl(pathId)}`;
      const course = listItem?.item;
      if (listItem?.["@type"] !== "ListItem" || listItem.position !== index + 1) {
        generatedErrors.push(`${hubFile}: path ${index + 1} must have its 1-based ListItem position`);
      }
      if (listItem?.url !== expectedUrl || course?.url !== expectedUrl || seenUrls.has(course?.url)) {
        generatedErrors.push(`${hubFile}: path ${pathId} must have a unique canonical course URL`);
      }
      seenUrls.add(course?.url);
      if (course?.["@type"] !== "Course" || course.name !== pathData[pathId].title || course.description !== pathData[pathId].description) {
        generatedErrors.push(`${hubFile}: path ${pathId} Course name/description is incomplete`);
      }
      if (JSON.stringify(course?.provider) !== JSON.stringify(expectedProvider)) {
        generatedErrors.push(`${hubFile}: path ${pathId} provider identity is inconsistent`);
      }
    });
  }
}

pathOrder.forEach((pathId) => {
  const pathFile = `public/learn/${pathId}/index.html`;
  const pathJsonLd = generatedJsonLd(pathFile);
  hasTwitterMetadata(pathFile);
  if (pathJsonLd?.["@type"] !== "Course" || pathJsonLd.url !== `${siteUrl}${pathUrl(pathId)}` || JSON.stringify(pathJsonLd.provider) !== JSON.stringify(expectedProvider)) {
    generatedErrors.push(`${pathFile}: path page must keep Course JSON-LD with the canonical provider`);
  }
  pathData[pathId].modules.forEach((_, index) => {
    const lessonFile = `public/learn/${pathId}/${lessonSlug(pathId, index)}/index.html`;
    const lessonMarkup = generatedPages.get(lessonFile);
    const lessonJsonLd = generatedJsonLd(lessonFile);
    hasTwitterMetadata(lessonFile);
    if (lessonJsonLd?.["@type"] !== "LearningResource" || lessonJsonLd.url !== `${siteUrl}${lessonUrl(pathId, index)}`) {
      generatedErrors.push(`${lessonFile}: lesson page must keep LearningResource JSON-LD`);
    }
    if (!lessonMarkup.includes('class="static-early-cta"') || !lessonMarkup.includes("Open interactive studio")) {
      generatedErrors.push(`${lessonFile}: missing early interactive studio CTA`);
    }
  });
});

// ————— curriculum data integrity —————

const errors = [];
const isString = (value) => typeof value === "string";
const isArray = (value) => Array.isArray(value);

// CONTENT-006: the two questions in each lesson must test distinct ideas.
const STOPWORDS = new Set("a an and are as at be but by for from has have if in is it its of on or that the their then they this to was were when which will with you your".split(" "));
function questionTokens(text) {
  return new Set(text.toLocaleLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((word) => word.length > 2 && !STOPWORDS.has(word)));
}
function jaccard(a, b) {
  const union = new Set([...a, ...b]);
  if (!union.size) return 0;
  let overlap = 0;
  for (const token of a) if (b.has(token)) overlap += 1;
  return overlap / union.size;
}

function checkPath(pathId, index) {
  const path = pathData[pathId];
  const guideList = lessonGuides[pathId];
  const missions = studioMissions[pathId];

  if (!isArray(path?.modules) || path.modules.length !== 6) {
    errors.push(`${pathId}: modules must be exactly 6`);
  }
  if (path.symbol && !isString(path.symbol)) errors.push(`${pathId}: symbol missing`);
  if (path.accent && !/^#[0-9a-f]{6}$/i.test(path.accent)) errors.push(`${pathId}: accent must be a hex color`);
  if (!isArray(guideList) || guideList.length !== 6) {
    errors.push(`${pathId}: lessonGuides must be exactly 6`);
    return;
  }
  if (!isArray(missions) || missions.length !== 6) {
    errors.push(`${pathId}: studioMissions must be exactly 6`);
  }

  const hintList = hints[pathId] || [];
  const slugs = new Set();

  guideList.forEach((guide, lessonIndex) => {
    const label = `${pathId}-${lessonIndex + 1}`;
    const slug = lessonSlug(pathId, lessonIndex);
    if (slugs.has(slug)) errors.push(`${label}: duplicate slug "${slug}"`);
    slugs.add(slug);
    const slugByTitle = lessonSlug(pathId, lessonIndex);
    if (slugByTitle !== slugify(pathData[pathId].modules[lessonIndex][0])) {
      errors.push(`${label}: title renamed without updating the immutable slug map (expected "${slugify(pathData[pathId].modules[lessonIndex][0])}")`);
    }

    const starter = codeStarters[pathId]?.[lessonIndex];
    const lenses = workspaceBlueprints[pathId]?.lenses?.[lessonIndex];
    if (starter && lenses) errors.push(`${label}: has both a code starter and record lenses`);
    if (!starter && !lenses) errors.push(`${label}: missing workspace definition`);

    if (!isArray(guide.objectives) || guide.objectives.length !== 3 || !guide.objectives.every(isString)) {
      errors.push(`${label}: objectives must be 3 strings`);
    }
    if (!isArray(guide.understand) || guide.understand.length !== 2 || !isString(guide.understand[0]) || !isArray(guide.understand[1]) || guide.understand[1].length < 2) {
      errors.push(`${label}: understand must be [title, paragraphs]`);
    }
    if (!isString(guide.principle)) errors.push(`${label}: principle missing`);
    if (!isArray(guide.apply) || guide.apply.length !== 2 || !isString(guide.apply[0]) || !isArray(guide.apply[1]) || guide.apply[1].length < 2) {
      errors.push(`${label}: apply must be [title, paragraphs]`);
    }
    if (!isArray(guide.steps) || guide.steps.length < 4 || !guide.steps.every(isString)) {
      errors.push(`${label}: steps must be at least 4 strings`);
    }
    if (!isArray(guide.quiz) || guide.quiz.length !== 2) {
      errors.push(`${label}: quiz must contain exactly 2 questions`);
    } else {
      guide.quiz.forEach((question, qIndex) => {
        if (!isArray(question) || question.length !== 4 || !isString(question[0]) || !isArray(question[1]) || question[1].length !== 3 || !isString(question[3])) {
          errors.push(`${label} q${qIndex + 1}: must be [question, 3 options, correctIndex, explanation]`);
          return;
        }
        if (!Number.isInteger(question[2]) || question[2] < 0 || question[2] > 2) {
          errors.push(`${label} q${qIndex + 1}: correctIndex out of range`);
        }
      });
      const [first, second] = guide.quiz;
      if (isArray(first) && isArray(second)) {
        const similarity = jaccard(questionTokens(first[0]), questionTokens(second[0]));
        if (similarity >= 0.62) {
          errors.push(`${label}: quiz questions are near-duplicates (similarity ${similarity.toFixed(2)}); rewrite one to test distinct understanding`);
        }
      }
    }

    if (starter) {
      if (!isString(starter.html) || !isString(starter.css) || !isString(starter.js)) {
        errors.push(`${label}: code starter missing html/css/js`);
      } else if (!hintList[lessonIndex]) {
        errors.push(`${label}: code lesson is missing a hint`);
      }
    } else {
      if (!isArray(lenses) || lenses.length !== 6 || !lenses.every(isString)) {
        errors.push(`${label}: blueprint lenses must be 6 strings`);
      }
    }
  });
}

pathOrder.forEach((pathId, index) => {
  if (!pathData[pathId]) errors.push(`pathOrder[${index}]: "${pathId}" not in pathData`);
  if (Object.keys(pathData).length !== pathOrder.length) errors.push("pathData and pathOrder disagree");
  checkPath(pathId, index);
});

if (!isArray(placementQuiz) || placementQuiz.length !== 4) {
  errors.push("placementQuiz must contain 4 questions");
} else {
  placementQuiz.forEach((item, index) => {
    if (!isString(item.question) || !isArray(item.options) || item.options.length !== 6) {
      errors.push(`placementQuiz[${index}]: needs a question and 6 options`);
      return;
    }
    item.options.forEach(([label, pathId]) => {
      if (!isString(label) || !pathData[pathId]) errors.push(`placementQuiz[${index}]: invalid option "${pathId}"`);
    });
  });
}

if (!isArray(changelog) || changelog.length < 1) {
  errors.push("changelog must contain at least one entry");
} else {
  changelog.forEach((entry, index) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.date) || !isString(entry.title) || !isString(entry.body)) {
      errors.push(`changelog[${index}]: needs date, title, body`);
    }
  });
}

const lessonCount = Object.values(pathData).reduce((sum, path) => sum + path.modules.length, 0);

if (duplicateIds.length || missingTargets.length || missingRequired.length || forbiddenFound.length || generatedErrors.length || errors.length) {
  console.error({ duplicateIds, missingTargets, missingRequired, forbiddenFound, generatedErrors, curriculumErrors: errors });
  process.exit(1);
}

console.log(`Checks passed: ${ids.size} unique IDs, ${localTargets.length} local links, ${lessonCount} lessons across ${pathOrder.length} paths, generated Course ItemList, Twitter metadata, early studio CTAs, ${changelog.length} changelog entries, accessibility primitives present.`);
