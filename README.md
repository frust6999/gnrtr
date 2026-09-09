# LANDAK FB SLUG — Simple Cloudflare Pages

Fungsi:
1. Isi URL tujuan.
2. Isi slug, misalnya `FRST`.
3. Isi judul, gambar, dan deskripsi Facebook.
4. Sistem membuat:
   `https://domain.pages.dev/t/FRST`
5. Saat `/t/FRST` dibuka, Cloudflare Pages Function mengeluarkan Open Graph metadata lalu mengarahkan visitor ke URL tujuan.

## Cloudflare KV

Buat KV namespace, misalnya `FB_SLUGS`.

Pada Cloudflare Pages:
Settings → Functions → KV namespace bindings → Add binding

Variable name:
`FB_SLUGS`

Pilih namespace KV Anda.

## Deploy

Upload folder ke GitHub dan hubungkan ke Cloudflare Pages.

Build command:
`exit 0`

Build output directory:
`.`

## Contoh

URL tujuan:
`https://contoh.com/artikel`

Slug:
`FRST`

Judul:
`Judul Artikel`

Image:
`https://contoh.com/gambar.jpg`

Deskripsi:
`Deskripsi artikel`

Hasil:
`https://domain.pages.dev/t/FRST`

## Catatan Facebook

Gambar sebaiknya URL publik HTTPS. Setelah perubahan metadata, Facebook dapat menyimpan cache preview; gunakan Facebook Sharing Debugger untuk meminta Facebook mengambil metadata terbaru.

Gunakan sistem ini untuk link yang memang Anda kontrol dan sesuai kebijakan platform. Jangan digunakan untuk menyamarkan tujuan link atau menipu pengguna.
