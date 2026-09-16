/**
 * Generates one of the images described in scripts/image-prompts.mjs.
 *
 *   node scripts/generate-image.mjs social-specimen
 *   node scripts/generate-image.mjs --all
 *
 * Requires OPENAI_API_KEY in the environment. The key is read once and never
 * printed, logged, or written to disk --- if this script ever starts echoing
 * its own configuration, that is a bug.
 *
 * Generated files are written into src/assets/images/ and committed, because
 * the built site needs them and a marker cloning the repo cannot run this
 * script. The prompt that produced each one stays in image-prompts.mjs, so the
 * image and its provenance are reviewed together.
 */
import { Buffer } from "node:buffer";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { JOBS, JOB_IDS } from "./image-prompts.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ENDPOINT = "https://api.openai.com/v1/images/generations";
const MODEL = "gpt-image-1";

function usage(message) {
  console.error(message);
  console.error(`\nusage: node scripts/generate-image.mjs <id|--all>`);
  console.error(`ids:   ${JOB_IDS.join(", ")}`);
  process.exit(1);
}

/** Calls the image API and returns the raw PNG bytes. */
async function generate(job, apiKey) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      prompt: job.prompt,
      size: job.size,
      quality: job.quality,
      n: 1,
    }),
  });

  if (!response.ok) {
    /* Report the API's own message --- the status alone does not distinguish a
       rejected prompt from an expired key --- but never the request, which
       carries the Authorization header. */
    const detail = await response.text();
    throw new Error(`image API ${response.status}: ${detail.slice(0, 600)}`);
  }

  const payload = await response.json();
  const b64 = payload?.data?.[0]?.b64_json;
  if (!b64) throw new Error("image API returned no image data");
  return Buffer.from(b64, "base64");
}

/**
 * Crops about the centre to the target aspect ratio, then resizes to the exact
 * target size. Used where the needed ratio is not one the model offers.
 */
async function cropToSize(png, { width, height }) {
  const image = sharp(png);
  const meta = await image.metadata();
  const targetRatio = width / height;
  const bandHeight = Math.round(meta.width / targetRatio);
  if (bandHeight > meta.height) {
    throw new Error(
      `cannot crop ${meta.width}x${meta.height} to ${width}x${height}: ` +
        `needs ${bandHeight}px of height`,
    );
  }
  return image
    .extract({
      left: 0,
      top: Math.round((meta.height - bandHeight) / 2),
      width: meta.width,
      height: bandHeight,
    })
    .resize(width, height)
    .png()
    .toBuffer();
}

async function run(id, apiKey) {
  const job = JOBS[id];
  if (!job) usage(`unknown image id "${id}"`);

  console.log(`${id}: requesting ${job.size} from ${MODEL}…`);
  let png = await generate(job, apiKey);

  if (job.crop) {
    console.log(`${id}: cropping to ${job.crop.width}x${job.crop.height}`);
    png = await cropToSize(png, job.crop);
  }

  const out = resolve(ROOT, job.out);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, png);
  const { width, height } = await sharp(png).metadata();
  console.log(`${id}: wrote ${job.out} (${width}x${height}, ${(png.length / 1024).toFixed(0)} KB)`);
}

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) usage("OPENAI_API_KEY is not set in the environment");

const [arg] = process.argv.slice(2);
if (!arg) usage("no image id given");

const ids = arg === "--all" ? JOB_IDS : [arg];
for (const id of ids) await run(id, apiKey);
