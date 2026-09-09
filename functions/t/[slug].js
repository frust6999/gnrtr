export async function onRequest({params,env,request}) {
  const slug=params.slug;
  const raw=await env.LINKS_KV.get("link:"+slug,{type:"json"});
  if(!raw) return new Response("Link tidak ditemukan.",{status:404,headers:{"content-type":"text/plain;charset=UTF-8"}});
  const esc=s=>String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const destination=esc(raw.destination), title=esc(raw.title||""), image=esc(raw.image||""), desc=esc(raw.description||"");
  const here=esc(new URL(request.url).href);
  const html=`<!doctype html><html><head><meta charset="utf-8">
<meta property="og:type" content="website"><meta property="og:url" content="${here}">
<meta property="og:title" content="${title}"><meta property="og:description" content="${desc}">${image?`<meta property="og:image" content="${image}">`:""}
<meta name="twitter:card" content="${image?"summary_large_image":"summary"}"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${desc}">${image?`<meta name="twitter:image" content="${image}">`:""}
<meta http-equiv="refresh" content="0;url=${destination}"><title>${title}</title></head>
<body><script>location.replace(${JSON.stringify(raw.destination)})</script><a href="${destination}">Continue</a></body></html>`;
  return new Response(html,{headers:{"content-type":"text/html;charset=UTF-8","cache-control":"no-store"}});
}
