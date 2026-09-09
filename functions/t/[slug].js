export async function onRequest({request,env,params}){
  const slug=String(params.slug||'');
  const raw=await env.FB_SLUGS.get(slug);
  if(!raw)return new Response('Slug tidak ditemukan',{status:404});

  let data;
  try{data=JSON.parse(raw)}catch(e){return new Response('Data rusak',{status:500})}

  const safe=v=>String(v||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const url=new URL(request.url).toString();

  const html=`<!doctype html>
<html><head>
<meta charset="utf-8">
<meta property="og:type" content="website">
<meta property="og:url" content="${safe(url)}">
<meta property="og:title" content="${safe(data.title||'Link')}">
<meta property="og:description" content="${safe(data.description||'')}">
${data.image?`<meta property="og:image" content="${safe(data.image)}">`:''}
<meta name="twitter:card" content="summary_large_image">
<title>${safe(data.title||'Link')}</title>
<meta http-equiv="refresh" content="0;url=${safe(data.destination)}">
<script>location.replace(${JSON.stringify(data.destination)})</script>
</head><body>Redirecting...</body></html>`;

  return new Response(html,{headers:{'content-type':'text/html;charset=UTF-8','cache-control':'no-cache'}});
}
