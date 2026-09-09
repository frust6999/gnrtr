function cleanSlug(s){return String(s||"").trim().replace(/^\/+/,"").replace(/\/+$/,"").replace(/[^a-zA-Z0-9_-]/g,"-").slice(0,80)}
function validUrl(s){try{const u=new URL(s);return ["http:","https:"].includes(u.protocol)}catch{return false}}
export async function onRequestPost({request,env}) {
  const p=await request.json().catch(()=>({}));
  const domain=String(p.domain||"").trim().toLowerCase().replace(/^https?:\/\//,"").replace(/\/.*$/,"");
  const destination=String(p.destination||"").trim();
  const slug=cleanSlug(p.slug);
  if(!domain || !destination || !slug) return Response.json({error:"Domain, URL tujuan, dan Click ID wajib diisi."},{status:400});
  if(!validUrl(destination)) return Response.json({error:"URL tujuan harus http/https."},{status:400});
  const domains=await env.LINKS_KV.get("__domains__",{type:"json"}) || [];
  if(!domains.includes(domain)) return Response.json({error:"Domain belum ada di Domain Pool."},{status:400});
  const key="link:"+slug;
  const exists=await env.LINKS_KV.get(key);
  if(exists) return Response.json({error:"Slug sudah digunakan. Pilih slug lain."},{status:409});
  const data={destination,title:String(p.title||"").slice(0,200),image:String(p.image||"").slice(0,1000),description:String(p.description||"").slice(0,500),fsub:p.fsub||"OFF",type:p.type||"REDIRECT",createdAt:new Date().toISOString()};
  await env.LINKS_KV.put(key,JSON.stringify(data));
  return Response.json({link:"https://"+domain+"/t/"+encodeURIComponent(slug),data});
}
