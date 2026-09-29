const MEMBER_KEY_PATTERN = /^[a-zA-Z0-9_-]{1,255}$/;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TokenRequestBody = {
  memberKey?: unknown;
};

type AccessTokenResponse = {
  session_token?: unknown;
};

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: "Cross-origin requests are not allowed." }, { status: 403 });
  }

  const apiKey = process.env.ACCESS_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Travel search is not configured yet." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  let body: TokenRequestBody;
  try {
    body = (await request.json()) as TokenRequestBody;
  } catch {
    return Response.json({ error: "A JSON request body is required." }, { status: 400 });
  }

  const memberKey = body.memberKey;
  if (typeof memberKey !== "string" || !MEMBER_KEY_PATTERN.test(memberKey)) {
    return Response.json({ error: "A valid member key is required." }, { status: 400 });
  }

  const authUrl =
    process.env.ACCESS_AUTH_URL ?? "https://auth.adcrws-stage.com/api/v1/tokens";

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
      cache: "no-store",
    });

    if (!response.ok) {
      const retryAfter = response.headers.get("retry-after");
      return Response.json(
        {
          error:
            response.status === 429
              ? "Travel search is busy. Please try again shortly."
              : "Access could not start a travel session.",
        },
        {
          status: response.status === 429 ? 429 : 502,
          headers: {
            "Cache-Control": "no-store",
            ...(retryAfter ? { "Retry-After": retryAfter } : {}),
          },
        },
      );
    }

    const data = (await response.json()) as AccessTokenResponse;
    if (typeof data.session_token !== "string" || data.session_token.length === 0) {
      return Response.json(
        { error: "Access returned an invalid travel session." },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    return Response.json(
      { session_token: data.session_token },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch {
    return Response.json(
      { error: "Travel search is temporarily unavailable." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
