const MEMBER_KEY_PATTERN = /^[a-zA-Z0-9_-]{1,255}$/;

// Netlify Function: travel-token (ported 1:1 from app/api/travel-token/route.ts per PROPER verdict A).
// Runs server-to-server so the Access staging auth URL and key never touch the browser.

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "method not allowed" }) };
  }

  const apiKey = process.env.ACCESS_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 503,
      headers,
      body: JSON.stringify({ error: "Travel search is not configured yet." }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "A JSON request body is required." }) };
  }

  const memberKey = body.memberKey;
  if (typeof memberKey !== "string" || memberKey.length === 0 || memberKey.length > 255 || !MEMBER_KEY_PATTERN.test(memberKey)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "A valid member key is required." }) };
  }

  const authUrl = process.env.ACCESS_AUTH_URL || "https://auth.adcrws-stage.com/api/v1/tokens";

  try {
    const response = await fetch(authUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        member_key: memberKey,
        scope: "travel",
      }),
    });

    if (!response.ok) {
      const retryAfter = response.headers.get("retry-after");
      const bodyOut = {
        error:
          response.status === 429
            ? "Travel search is busy. Please try again shortly."
            : "Access could not start a travel session.",
      };
      return {
        statusCode: response.status === 429 ? 429 : 502,
        headers: {
          "Cache-Control": "no-store",
          ...(retryAfter ? { "Retry-After": retryAfter } : {}),
          ...headers,
        },
        body: JSON.stringify(bodyOut),
      };
    }

    const data = await response.json();
    if (typeof data.session_token !== "string" || data.session_token.length === 0) {
      return { statusCode: 502, headers, body: JSON.stringify({ error: "Access returned an invalid travel session." }) };
    }

    return {
      statusCode: 200,
      headers: { "Cache-Control": "no-store, max-age=0", "Content-Type": "application/json" },
      body: JSON.stringify({ session_token: data.session_token }),
    };
  } catch {
    return { statusCode: 502, headers, body: JSON.stringify({ error: "Travel search is temporarily unavailable." }) };
  }
};