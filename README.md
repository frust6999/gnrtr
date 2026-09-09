# LANDAK LINK ENGINE V2

Versi ini dibuat mengikuti konsep screenshot:
- Multi-domain dropdown / Domain Pool
- Random slug 6 karakter (huruf + angka) setiap generate
- Click ID / tag opsional, disimpan sebagai metadata dan tidak menjadi slug URL
- URL tujuan
- F-SUB dan TYPE
- Judul, image URL, deskripsi untuk Open Graph / Facebook
- Live preview
- Link `/t/SLUG`
- Semua link disimpan di Cloudflare KV

## 1. Buat KV
Cloudflare Dashboard -> Workers & Pages -> KV -> Create namespace.
Contoh nama: `LANDak_LINKS`.

## 2. Binding
Di Pages project:
Settings -> Functions -> KV namespace bindings.
Variable name: `LINKS_KV`
Pilih namespace KV yang dibuat.

Untuk dashboard yang benar-benar terbuka tanpa login, siapa pun yang bisa membuka `/` dapat menambah/menghapus domain dan membuat link. Untuk pemakaian pribadi, tambahkan authentication sebelum dipublikasikan.

## 3. Deploy
Upload isi folder ini ke Cloudflare Pages, atau hubungkan Git.
Build command: `exit 0`
Build output directory: `.`

`wrangler.toml` tidak perlu dipakai oleh Pages jika binding dibuat dari Dashboard; ID di file hanya contoh.

## 4. Custom domain
Setiap domain yang ingin muncul di dropdown harus ditambahkan sebagai Custom Domain ke project Pages yang sama.

Contoh:
- `domain1.com`
- `domain2.com`
- `sub.domain3.com`

Pastikan DNS domain tersebut diarahkan/di-onboard sesuai instruksi Cloudflare Pages.

Setelah domain aktif, tambahkan domain itu di bagian DOMAIN POOL.

## 5. Contoh
Tambahkan `domainanda.com`, lalu buat:
- URL tujuan: `https://example.com/`
- Click ID: `FRST`
- Judul: `Judul Facebook`
- Image URL: URL gambar HTTPS publik
- Deskripsi: `Deskripsi link`

Hasil (contoh):
`https://domainanda.com/t/a7KpQ2`

Slug URL dibuat otomatis 6 karakter dan berbeda setiap generate. Click ID / tag tidak menentukan bagian belakang URL.

Facebook/Meta dapat melakukan caching preview. Jika preview lama, gunakan Sharing Debugger Meta untuk refresh cache.

Catatan: gunakan sistem ini untuk link yang Anda kontrol dan metadata yang tidak menipu pengguna. Jangan digunakan untuk menyamarkan tujuan berbahaya atau phishing.
