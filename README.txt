BAKI-FIT APK - dibangun otomatis oleh GitHub (tanpa Android Studio)

1. Buat repositori BARU di GitHub, misalnya baki-fit-apk (Public).
2. Unggah isi folder ini ke repositori: package.json, capacitor.config.json, .gitignore, folder www (berisi index.html).
3. Buat file workflow: di GitHub klik Add file > Create new file. Pada kolom nama ketik:
   .github/workflows/build-apk.yml
   Salin seluruh isi build-apk.yml.txt ke dalamnya, lalu Commit changes.
   (Jika folder .github ikut terunggah dari zip, langkah ini tidak perlu.)
4. Buka tab Actions. Tunggu proses "Build APK" selesai (sekitar 5-10 menit), tanda centang hijau.
   Jika belum jalan, pilih Build APK > Run workflow.
5. Buka tab Code > Releases di sisi kanan. Unduh app-debug.apk dari rilis terbaru.
6. Buka file APK di HP, izinkan instalasi dari sumber tidak dikenal bila diminta.
7. Buka BAKI-FIT > Dashboard > Pengaturan > atur jam pengingat > Simpan pengingat > izinkan notifikasi.

Pembaruan: ganti www/index.html di GitHub dan commit. Build baru dan rilis baru muncul otomatis; pasang APK baru di atas yang lama (data tetap aman).
Jika Actions gagal (tanda silang merah), buka langkah yang gagal dan kirim pesan error-nya.
