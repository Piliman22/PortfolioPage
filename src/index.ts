import { profile } from "./profile";
import { renderHtml, renderText } from "./render";

const CLI_USER_AGENTS = ["curl", "wget", "httpie", "http-client", "powershell"];

const wantsPlainText = (request: Request) => {
  const userAgent = request.headers.get("user-agent")?.toLowerCase() ?? "";
  const accept = request.headers.get("accept")?.toLowerCase() ?? "";

  if (CLI_USER_AGENTS.some((agent) => userAgent.includes(agent))) {
    return true;
  }

  return !accept.includes("text/html");
};

const securityHeaders = {
  "content-security-policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin"
};

export default {
  fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/api/profile") {
      return Response.json(profile, {
        headers: {
          ...securityHeaders,
          "cache-control": "public, max-age=300"
        }
      });
    }

    if (url.pathname !== "/") {
      return new Response("Not found\n", {
        status: 404,
        headers: {
          ...securityHeaders,
          "content-type": "text/plain; charset=utf-8"
        }
      });
    }

    if (wantsPlainText(request)) {
      return new Response(renderText(profile, url), {
        headers: {
          ...securityHeaders,
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "public, max-age=300"
        }
      });
    }

    return new Response(renderHtml(profile, url), {
      headers: {
        ...securityHeaders,
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=300"
      }
    });
  }
} satisfies ExportedHandler;
