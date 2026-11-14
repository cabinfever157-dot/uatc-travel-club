import { getStore } from "@netlify/blobs";

const FORM_NAME = "uatc-membership";
const FILE_NAME = "uatc-signups.txt";

export default async function archiveSignup(request) {
  const { payload } = await request.json();
  if (payload?.form_name !== FORM_NAME) return new Response(null, { status: 204 });

  const { id, created_at: submittedAt, data } = payload;
  const firstName = data?.["first-name"];
  const lastName = data?.["last-name"];
  const email = data?.email;
  if ([id, firstName, lastName, email].some((field) => typeof field !== "string" || !field.trim())) {
    return new Response(null, { status: 204 });
  }

  const store = getStore({ name: "uatc-leads", consistency: "strong" });
  const record = JSON.stringify({
    id,
    submittedAt,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim(),
  });
  const recordPrefix = `{"id":${JSON.stringify(id)},`;

  // Conditional writes preserve both signups when two requests arrive together.
  for (let attempt = 0; attempt < 8; attempt++) {
    const previous = await store.getWithMetadata(FILE_NAME);
    const contents = previous?.data ?? "";
    if (contents.split("\n").some((line) => line.startsWith(recordPrefix))) {
      return new Response(null, { status: 204 });
    }

    const condition = previous ? { onlyIfMatch: previous.etag } : { onlyIfNew: true };
    const result = await store.set(FILE_NAME, `${contents}${record}\n`, condition);
    if (result.modified) return new Response(null, { status: 204 });
  }

  throw new Error("The UATC signup archive was busy. The original submission is in Netlify Forms.");
}
