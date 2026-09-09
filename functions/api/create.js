export async function onRequestPost({request,env}){
  try{
    const b=await request.json();
    const slug=String(b.slug||'').trim().replace(/[^a-zA-Z0-9_-]/g,'');
    const destination=String(b.destination||'').trim();
    if(!slug)return Response.json({error:'Slug wajib diisi'},{status:400});
    if(!/^https?:\/\//i.test(destination))return Response.json({error:'URL tujuan tidak valid'},{status:400});
    if(await env.FB_SLUGS.get(slug))return Response.json({error:'Slug sudah digunakan'},{status:409});

    await env.FB_SLUGS.put(slug,JSON.stringify({
      destination,
      title:String(b.title||''),
      image:String(b.image||''),
      description:String(b.description||'')
    }));
    return Response.json({url:new URL('/t/'+slug,request.url).toString()});
  }catch(e){
    return Response.json({error:'Data tidak valid'},{status:400});
  }
}
