import { createServer } from "node:http";
import { createReadStream, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { timingSafeEqual } from "node:crypto";

const root = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(root, "data");
mkdirSync(dataDir, { recursive: true });
const databasePath = process.env.DATABASE_PATH || resolve(dataDir, "aroushtech.sqlite");
mkdirSync(dirname(databasePath), { recursive: true });
const db = new DatabaseSync(databasePath);
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    listed_price INTEGER,
    offer_price INTEGER
  );
  CREATE TABLE IF NOT EXISTS enquiries (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    interest TEXT NOT NULL,
    course TEXT NOT NULL DEFAULT '',
    message TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id INTEGER PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS enquiries_created_at_idx ON enquiries(created_at);
`);

const courses = [
  ["ccna", "CCNA", "Networking", "Foundational networking: routing, switching, and basic network security.", 25000, 19999],
  ["ccna-devnet", "CCNA DevNet", "Networking", "Combine networking knowledge with software development, automation, and APIs.", 25000, 19999],
  ["ccnp-enterprise", "CCNP Enterprise", "Networking", "Advanced enterprise infrastructure, routing, and wireless networking.", 55000, 45000],
  ["ccnp-security", "CCNP Security", "Cybersecurity", "Security protocols, firewalls, VPNs, and enterprise network protection.", 55000, 45000],
  ["cisco-ise", "ISE (Identity Services Engine)", "Networking", "Secure network access with Cisco ISE policy enforcement and identity management.", 25000, 15000],
  ["ansible-terraform", "Ansible & Terraform", "Cloud & DevOps", "Automate IT configuration and infrastructure provisioning.", 25000, 19999],
  ["checkpoint-firewall", "Checkpoint Firewall", "Cybersecurity", "Hands-on configuration and management of Check Point firewalls.", 25000, 19999],
  ["fortinet-certified-engineer", "Fortinet Certified Engineer", "Cybersecurity", "FortiGate setup, security policies, VPNs, and unified threat management.", 25000, 19999],
  ["palo-alto-firewall", "Palo Alto Firewall Certified Engineer", "Cybersecurity", "Firewall deployment, configuration, and threat prevention with Palo Alto devices.", 25000, 21000],
  ["ceh", "CEH (Certified Ethical Hacker)", "Cybersecurity", "Learn how to find, assess, and help fix system vulnerabilities.", 35000, 25000],
  ["cybersys", "CyberSys", "Cybersecurity", "Cybersecurity tools, threats, and defense mechanisms.", 25000, 19999],
  ["linux-basic-cyber", "Linux + Basic Cyber Security", "Cybersecurity", "Linux fundamentals paired with essential cybersecurity practices.", 25000, 19999],
  ["linux-advanced-cyber", "Linux + Advanced Cyber Security", "Cybersecurity", "Linux system security, hardening, and advanced threat mitigation.", 45000, 35000],
  ["pentest", "Pentest (Penetration Testing)", "Cybersecurity", "Simulate cyber attacks to identify and remediate security weaknesses.", 25000, 19999],
  ["web-app-pen-tester", "Web App Pen Tester", "Cybersecurity", "Identify and test common vulnerabilities in web applications.", 25000, 19999],
  ["aws-solutions-architect", "AWS Solutions Architect Associate", "Cloud & DevOps", "Design and deploy scalable systems on AWS cloud infrastructure.", 20000, 15000],
  ["ai-ml", "AI & ML", "AI & Machine Learning", "Explore artificial intelligence and machine learning concepts and tools.", 65000, 45000],
  ["agentic-ai-langgraph", "Agentic AI with LangGraph & LangChain", "AI & Machine Learning", "Build intelligent agents and AI workflows with LangGraph and LangChain.", 45000, 35000],
  ["agentic-ai-huggingface", "Agentic AI with LangChain & Hugging Face", "AI & Machine Learning", "Build AI agents with LangChain and Hugging Face for NLP applications.", 45000, 35000],
  ["ccnp-data-center", "CCNP Data Center", "Networking", "Specialized training for complex data center networks and infrastructure.", 65000, 55000]
];
const courseCount = db.prepare("SELECT COUNT(*) AS count FROM courses").get().count;
if (!courseCount) {
  const insert = db.prepare("INSERT INTO courses (slug, name, category, description, listed_price, offer_price) VALUES (?, ?, ?, ?, ?, ?)");
  db.exec("BEGIN IMMEDIATE");
  try {
    for (const course of courses) insert.run(...course);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

const mime = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon"
};
const limits = new Map();
function send(res, status, payload) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  res.end(JSON.stringify(payload));
}
function allowRequest(req) {
  const forwarded = req.headers["x-forwarded-for"];
  const address = (typeof forwarded === "string" ? forwarded.split(",")[0].trim() : req.socket.remoteAddress) || "unknown";
  const now = Date.now();
  if (limits.size > 5000) {
    for (const [key, value] of limits) if (value.until < now) limits.delete(key);
  }
  const item = limits.get(address);
  if (!item || item.until < now) {
    limits.set(address, { count: 1, until: now + 60_000 });
    return true;
  }
  item.count += 1;
  return item.count <= 12;
}
async function readJson(req) {
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 20_000) throw new Error("Request is too large.");
  }
  try { return JSON.parse(raw || "{}"); } catch { throw new Error("Enter a valid request."); }
}
const clean = (value, max = 5000) => String(value ?? "").trim().slice(0, max);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  if (req.method === "GET" && url.pathname === "/api/health") return send(res, 200, { ok: true });
  if (req.method === "GET" && url.pathname === "/api/courses") {
    const list = db.prepare("SELECT slug, name, category, description, listed_price AS listedPrice, offer_price AS offerPrice FROM courses ORDER BY id").all();
    return send(res, 200, list);
  }
  if (req.method === "GET" && url.pathname === "/api/admin/enquiries") {
    const token = process.env.ADMIN_TOKEN || "";
    const supplied = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
    const expectedBytes = Buffer.from(token);
    const suppliedBytes = Buffer.from(supplied);
    if (expectedBytes.length < 32) return send(res, 503, { error: "Admin access is not configured." });
    if (expectedBytes.length !== suppliedBytes.length || !timingSafeEqual(expectedBytes, suppliedBytes)) return send(res, 401, { error: "Unauthorized." });
    const limit = Math.trunc(Math.max(1, Math.min(200, Number(url.searchParams.get("limit")) || 50)));
    const rows = db.prepare("SELECT id, name, email, company, phone, interest, course, message, created_at AS createdAt FROM enquiries ORDER BY id DESC LIMIT ?").all(limit);
    const subscriptions = db.prepare("SELECT email, created_at AS createdAt FROM newsletter_subscriptions ORDER BY id DESC LIMIT ?").all(limit);
    return send(res, 200, { enquiries: rows, subscribers: subscriptions });
  }
  if (req.method === "POST" && url.pathname === "/api/enquiries") {
    if (!allowRequest(req)) return send(res, 429, { error: "Please wait a minute before sending another request." });
    try {
      const body = await readJson(req);
      const name = clean(body.name, 120), email = clean(body.email, 254).toLowerCase();
      const interest = clean(body.interest || body.challenge || "Course enquiry", 120);
      const company = clean(body.company, 160), phone = clean(body.phone, 40);
      const course = clean(body.course, 160), message = clean(body.message, 5000);
      if (!name || !emailPattern.test(email) || !interest) return send(res, 400, { error: "Enter your name, a valid email, and an area of interest." });
      const result = db.prepare("INSERT INTO enquiries (name, email, company, phone, interest, course, message) VALUES (?, ?, ?, ?, ?, ?, ?)").run(name, email, company, phone, interest, course, message);
      return send(res, 201, { ok: true, id: Number(result.lastInsertRowid), message: "Thanks. Your enquiry has been received." });
    } catch (error) { return send(res, 400, { error: error.message || "Unable to save your enquiry." }); }
  }
  if (req.method === "POST" && url.pathname === "/api/newsletter") {
    if (!allowRequest(req)) return send(res, 429, { error: "Please wait a minute before trying again." });
    try {
      const body = await readJson(req);
      const email = clean(body.email, 254).toLowerCase();
      if (!emailPattern.test(email)) return send(res, 400, { error: "Enter a valid email address." });
      db.prepare("INSERT INTO newsletter_subscriptions (email) VALUES (?) ON CONFLICT(email) DO NOTHING").run(email);
      return send(res, 201, { ok: true, message: "You’re on the list. Thanks for subscribing." });
    } catch (error) { return send(res, 400, { error: error.message || "Unable to save your subscription." }); }
  }
  if (url.pathname.startsWith("/api/")) return send(res, 404, { error: "API route not found." });

  let pathname;
  try { pathname = decodeURIComponent(url.pathname); } catch { pathname = "/"; }
  if (pathname === "/") pathname = "/index.html";
  if (/^\/(?:data|\.git|\.env)(?:\/|$)/.test(pathname)) return send(res, 404, { error: "Page not found." });
  if (!new Set([".html", ".css", ".js", ".svg", ".png", ".jpg", ".jpeg", ".webp", ".ico", ".xml", ".txt"]).has(extname(pathname).toLowerCase())) return send(res, 404, { error: "Page not found." });
  const file = resolve(root, `.${pathname}`);
  if (file !== root && !file.startsWith(root + sep)) return send(res, 403, { error: "Forbidden." });
  if (!existsSync(file) || !statSync(file).isFile()) return send(res, 404, { error: "Page not found." });
  res.writeHead(200, { "content-type": mime[extname(file).toLowerCase()] || "application/octet-stream", "x-content-type-options": "nosniff" });
  createReadStream(file).pipe(res);
});

const port = Number(process.env.PORT || 3000);
server.listen(port, "0.0.0.0", () => console.log(`AroushTech is running on http://localhost:${port}`));
process.on("SIGINT", () => { db.close(); server.close(() => process.exit(0)); });
process.on("SIGTERM", () => { db.close(); server.close(() => process.exit(0)); });
