const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

function randomSlug(length = 6){
  let out = '';
  for(let i = 0; i < length; i++){
    out += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return out;
}

async function makeUniqueSlug(env){
  for(let i = 0; i < 10; i++){
    const slug = randomSlug(6);
    const exists = await env.LINKS_KV.get(`link:${slug}`);
    if(!exists) return slug;
  }
  throw new Error('Tidak bisa membuat slug unik. Coba lagi.');
}

export async function onRequestPost({ request, env }){
  try{
    const body = await request.json();
    const domain = String(body.domain || '').trim().toLowerCase();
    const destination = String(body.destination || '').trim();
    const clickId = String(body.clickId || '').trim();
    const fsub = String(body.fsub || 'OFF').trim();
    const type = String(body.type || 'REDIRECT').trim();
    const title = String(body.title || '').trim();
    const image = String(body.image || '').trim();
    const description = String(body.description || '').trim();

    if(!/^https?:\/\//i.test(destination)){
      return Response.json({error:'URL tujuan harus diawali http:// atau https://'}, {status:400});
    }
    if(!domain){
      return Response.json({error:'Domain belum dipilih.'}, {status:400});
    }

    const domains = JSON.parse(await env.LINKS_KV.get('__domains__') || '[]');
    if(!domains.includes(domain)){
      return Response.json({error:'Domain belum ada di Domain Pool.'}, {status:400});
    }

    const slug = await makeUniqueSlug(env);
    const record = {
      domain,
      slug,
      clickId,
      destination,
      title,
      image,
      description,
      fsub,
      type,
      createdAt: new Date().toISOString()
    };

    await env.LINKS_KV.put(`link:${slug}`, JSON.stringify(record));
    return Response.json({
      ok:true,
      slug,
      url:`https://${domain}/t/${slug}`
    });
  }catch(err){
    return Response.json({error: err.message || 'Gagal membuat link.'}, {status:500});
  }
}
