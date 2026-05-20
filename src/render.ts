import type { Profile } from "./profile";

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const renderList = (items: string[]) => items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

export const renderText = (profile: Profile, url: URL) => {
  const tech = profile.tech
    .map((group) => `  ${group.group}: ${group.items.join(", ")}`)
    .join("\n");

  const links = profile.links.map((link) => `  ${link.label}: ${link.href}`).join("\n");

  const projects = profile.projects
    .map(
      (project) =>
        `  ${project.name}\n    ${project.description}\n    Stack: ${project.stack.join(", ")}\n    Link: ${project.href}`
    )
    .join("\n\n");

  return [
    `${profile.name} / ${profile.handle}`,
    `${profile.title} - ${profile.location}`,
    "",
    profile.status,
    "",
    "BIO",
    profile.bio.map((line) => `  ${line}`).join("\n"),
    "",
    "HIGHLIGHTS",
    profile.highlights.map((line) => `  - ${line}`).join("\n"),
    "",
    "TECH",
    tech,
    "",
    "PROJECTS",
    projects,
    "",
    "LINKS",
    links,
    "",
    "CONTACT",
    `  Email: ${profile.contact.email}`,
    `  GitHub: ${profile.contact.github}`,
    "",
    `JSON: ${url.origin}/api/profile`
  ].join("\n");
};

export const renderHtml = (profile: Profile, url: URL) => {
  const commands = [
    ["whoami", `${profile.name} (${profile.handle})`],
    ["cat bio.txt", profile.bio.join("<br>")],
    ["ls tech/", profile.tech.map((group) => group.group.toLowerCase()).join("  ")],
    ["curl /api/profile", "JSON profile endpoint"],
    ["open github", profile.contact.github]
  ];

  const commandRows = commands
    .map(
      ([command, output]) => `
        <div class="command-row">
          <div class="prompt"><span>visitor@portfolio</span><b>~</b>$ ${escapeHtml(command)}</div>
          <div class="output">${output}</div>
        </div>`
    )
    .join("");

  const links = profile.links
    .map(
      (link) => `
        <a class="link-pill" href="${escapeHtml(link.href)}" target="_blank" rel="noreferrer">
          <span>${escapeHtml(link.label)}</span>
          <kbd>${escapeHtml(link.command)}</kbd>
        </a>`
    )
    .join("");

  const tech = profile.tech
    .map(
      (group) => `
        <section class="panel">
          <h2>${escapeHtml(group.group)}</h2>
          <ul class="tags">${group.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </section>`
    )
    .join("");

  const projects = profile.projects
    .map(
      (project) => `
        <article class="project">
          <div>
            <h3>${escapeHtml(project.name)}</h3>
            <p>${escapeHtml(project.description)}</p>
          </div>
          <ul class="tags compact">${project.stack.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          <a href="${escapeHtml(project.href)}" target="_blank" rel="noreferrer">view repo</a>
        </article>`
    )
    .join("");

  const highlights = renderList(profile.highlights);

  const jsonProfile = JSON.stringify(profile);

  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(profile.name)} のターミナル風ポートフォリオ">
  <title>${escapeHtml(profile.name)} | Terminal Portfolio</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #090d12;
      --panel: #101720;
      --panel-2: #0d131b;
      --line: #263340;
      --text: #d9e7ec;
      --muted: #8ea0aa;
      --green: #73f2a6;
      --cyan: #71d7ff;
      --amber: #ffd166;
      --red: #ff6b6b;
      --shadow: 0 24px 80px rgba(0, 0, 0, 0.36);
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      min-height: 100vh;
      background:
        linear-gradient(rgba(113, 215, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(115, 242, 166, 0.03) 1px, transparent 1px),
        radial-gradient(circle at 80% 10%, rgba(113, 215, 255, 0.12), transparent 32rem),
        var(--bg);
      background-size: 32px 32px, 32px 32px, auto, auto;
      color: var(--text);
    }

    a {
      color: inherit;
    }

    .shell {
      width: min(1120px, calc(100% - 32px));
      margin: 32px auto;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(16, 23, 32, 0.94);
      box-shadow: var(--shadow);
      overflow: hidden;
    }

    .titlebar {
      height: 44px;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 16px;
      border-bottom: 1px solid var(--line);
      background: #0c1219;
    }

    .dot {
      width: 12px;
      height: 12px;
      border-radius: 999px;
      display: inline-block;
    }

    .red { background: var(--red); }
    .amber { background: var(--amber); }
    .green { background: var(--green); }

    .path {
      margin-left: 8px;
      color: var(--muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    main {
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(300px, 0.9fr);
      gap: 28px;
      padding: 28px;
    }

    .hero {
      display: grid;
      gap: 22px;
      align-content: start;
    }

    .eyebrow {
      color: var(--green);
      margin: 0;
    }

    h1 {
      margin: 0;
      font-size: clamp(2rem, 7vw, 5.8rem);
      line-height: 0.95;
      letter-spacing: 0;
    }

    .subtitle {
      color: var(--muted);
      font-size: 1.05rem;
      line-height: 1.75;
      max-width: 68ch;
      margin: 0;
    }

    .terminal-output {
      display: grid;
      gap: 16px;
      border-left: 2px solid var(--green);
      padding-left: 18px;
    }

    .prompt {
      color: var(--green);
      line-height: 1.7;
      overflow-wrap: anywhere;
    }

    .prompt span {
      color: var(--cyan);
    }

    .prompt b {
      color: var(--amber);
      font-weight: 600;
    }

    .output {
      color: var(--muted);
      line-height: 1.7;
      margin-top: 3px;
    }

    .links {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .link-pill {
      min-height: 42px;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      border: 1px solid var(--line);
      border-radius: 6px;
      background: var(--panel-2);
      text-decoration: none;
    }

    .link-pill:hover {
      border-color: var(--green);
      color: var(--green);
    }

    kbd {
      color: var(--muted);
      font: inherit;
      font-size: 0.78rem;
      border: 1px solid var(--line);
      border-radius: 4px;
      padding: 3px 6px;
      background: #071019;
    }

    .side {
      display: grid;
      gap: 16px;
      align-content: start;
    }

    .panel,
    .project {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(9, 13, 18, 0.62);
      padding: 16px;
    }

    h2,
    h3 {
      margin: 0 0 12px;
      font-size: 1rem;
      letter-spacing: 0;
      color: var(--cyan);
    }

    .panel ul:not(.tags) {
      margin: 0;
      padding-left: 20px;
      color: var(--muted);
      line-height: 1.7;
    }

    .tags {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .tags li {
      border: 1px solid rgba(115, 242, 166, 0.28);
      border-radius: 5px;
      padding: 6px 8px;
      color: var(--green);
      background: rgba(115, 242, 166, 0.06);
      line-height: 1.2;
    }

    .compact li {
      color: var(--muted);
      border-color: var(--line);
      background: transparent;
    }

    .project {
      display: grid;
      gap: 12px;
    }

    .projects {
      display: grid;
      gap: 14px;
      align-content: start;
    }

    .project-list {
      display: grid;
      gap: 12px;
    }

    .project p {
      margin: 0;
      color: var(--muted);
      line-height: 1.7;
    }

    .project a {
      color: var(--green);
      text-decoration: none;
      width: fit-content;
    }

    .input-line {
      grid-column: 1 / -1;
      display: flex;
      align-items: center;
      gap: 10px;
      border-top: 1px solid var(--line);
      padding-top: 22px;
      min-width: 0;
    }

    .input-line label {
      color: var(--green);
      white-space: nowrap;
    }

    .input-line input {
      width: 100%;
      min-width: 0;
      border: 0;
      outline: 0;
      background: transparent;
      color: var(--text);
      font: inherit;
    }

    .result {
      grid-column: 1 / -1;
      min-height: 28px;
      color: var(--muted);
      line-height: 1.7;
      overflow-wrap: anywhere;
    }

    @media (max-width: 820px) {
      .shell {
        width: min(100% - 20px, 1120px);
        margin: 10px auto;
      }

      main {
        grid-template-columns: 1fr;
        gap: 22px;
        padding: 18px;
      }

      .titlebar {
        padding: 0 12px;
      }

      .input-line {
        align-items: flex-start;
        flex-direction: column;
      }
    }
  </style>
</head>
<body>
  <div class="shell">
    <header class="titlebar" aria-label="terminal window">
      <span class="dot red"></span>
      <span class="dot amber"></span>
      <span class="dot green"></span>
      <span class="path">ssh ${escapeHtml(profile.handle)}@portfolio</span>
    </header>
    <main>
      <section class="hero" aria-labelledby="profile-title">
        <p class="eyebrow">visitor@portfolio:~$ whoami</p>
        <h1 id="profile-title">${escapeHtml(profile.handle)}</h1>
        <p class="subtitle">${escapeHtml(profile.title)} / ${escapeHtml(profile.location)}<br>${escapeHtml(profile.status)}</p>
        <div class="terminal-output">${commandRows}</div>
        <nav class="links" aria-label="profile links">${links}</nav>
      </section>

      <aside class="side">
        <section class="panel">
          <h2>highlights</h2>
          <ul>${highlights}</ul>
        </section>
        ${tech}
      </aside>

      <section class="projects" aria-label="projects">
        <h2>projects</h2>
        <div class="project-list">${projects}</div>
      </section>

      <section class="panel">
        <h2>curl</h2>
        <p class="output">curl ${escapeHtml(url.origin)}</p>
        <p class="output">curl ${escapeHtml(url.origin)}/api/profile</p>
      </section>

      <form class="input-line" id="command-form">
        <label for="command">visitor@portfolio:~$</label>
        <input id="command" name="command" autocomplete="off" spellcheck="false" placeholder="help" aria-label="terminal command">
      </form>
      <div class="result" id="result" aria-live="polite"></div>
    </main>
  </div>

  <script type="application/json" id="profile-data">${escapeHtml(jsonProfile)}</script>
  <script>
    const profile = JSON.parse(document.getElementById("profile-data").textContent);
    const form = document.getElementById("command-form");
    const input = document.getElementById("command");
    const result = document.getElementById("result");

    const commands = {
      help: "commands: help, whoami, bio, tech, projects, links, contact, clear",
      whoami: profile.name + " / " + profile.title,
      bio: profile.bio.join("\\n"),
      tech: profile.tech.map((group) => group.group + ": " + group.items.join(", ")).join("\\n"),
      projects: profile.projects.map((project) => project.name + " - " + project.description).join("\\n"),
      links: profile.links.map((link) => link.label + ": " + link.href).join("\\n"),
      contact: "email: " + profile.contact.email + "\\ngithub: " + profile.contact.github
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const command = input.value.trim().toLowerCase() || "help";
      if (command === "clear") {
        result.textContent = "";
        input.value = "";
        return;
      }
      if (command === "open github") {
        window.open(profile.contact.github, "_blank", "noreferrer");
        result.textContent = profile.contact.github;
        input.value = "";
        return;
      }
      result.textContent = commands[command] || "command not found: " + command;
      input.value = "";
    });
  </script>
</body>
</html>`;
};
