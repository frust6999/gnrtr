const KEY="__domains__";
export async function onRequestGet({env}) {
  const domains = await env.LINKS_KV.get(KEY,{type:"json"}) || [];
  return Response.json({domains});
}
export async function onRequestPost({request,env}) {
  const {domain}=await request.json().catch(()=>({}));
  const clean=String(domain||"").trim().replace(/^https?:\/\//,"").replace(/\/.*$/,"").toLowerCase();
  if(!clean || !clean.includes(".")) return Response.json({error:"Domain tidak valid."},{status:400});
  const domains=await env.LINKS_KV.get(KEY,{type:"json"}) || [];
  if(!domains.includes(clean)) domains.push(clean);
  await env.LINKS_KV.put(KEY,JSON.stringify(domains));
  return Response.json({domains});
}
export async function onRequestDelete({request,env}) {
  const u=new URL(request.url), domain=u.searchParams.get("domain");
  const domains=await env.LINKS_KV.get(KEY,{type:"json"}) || [];
  const next=domains.filter(x=>x!==domain);
  await env.LINKS_KV.put(KEY,JSON.stringify(next));
  return Response.json({domains:next});
}
