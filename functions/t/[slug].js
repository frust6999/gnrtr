export async function onRequest({params,env,request}) {
  const slug=params.slug;
  const raw=await env.LINKS_KV.get("link:"+slug,{type:"json"});

  if(!raw) {
    return new Response("Link tidak ditemukan.",{
      status:404,
      headers:{"content-type":"text/plain;charset=UTF-8"}
    });
  }

  const esc=s=>String(s||"")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;");

  const destination=esc(raw.destination);
  const title=esc(raw.title||"");
  const image=esc(raw.image||"");
  const desc=esc(raw.description||"");
  const here=esc(new URL(request.url).href);

  // Default OG image type. Most uploaded generator images are JPEG/PNG.
  let imageType="image/jpeg";
  if (String(raw.image||"").toLowerCase().includes(".png")) imageType="image/png";
  if (String(raw.image||"").toLowerCase().includes(".webp")) imageType="image/webp";

  const html=`<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">

<!-- ================= OG SAFE ================= -->
<meta property="og:type" content="website">
<meta property="og:url" content="${here}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
${image?`<meta property="og:image" content="${image}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="${imageType}">`:""}
<meta property="og:site_name" content="LANDAK LINK ENGINE">

<meta name="twitter:card" content="${image?"summary_large_image":"summary"}">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
${image?`<meta name="twitter:image" content="${image}">`:""}

<meta name="robots" content="index, follow">
<link rel="canonical" href="${here}">

<meta http-equiv="refresh" content="0;url=${destination}">
<title>${title}</title>
</head>
<body>
<script>location.replace(${JSON.stringify(raw.destination)})</script>
<a href="${destination}">Continue</a>
</body>
</html>`;

  return new Response(html,{
    headers:{
      "content-type":"text/html;charset=UTF-8",
      "cache-control":"no-store"
    }
  });
}
