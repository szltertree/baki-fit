BAKI-FIT: SHADOW & STEEL - paket uji coba (PWA, offline)

ISI: index.html, manifest.webmanifest, sw.js, icon-192.png, icon-512.png
Data latihan tersimpan di browser perangkat (localStorage). Buat cadangan lewat Pengaturan.

A. UJI CEPAT DI PC (Windows/Mac/Linux)
1. Ekstrak zip. Buka terminal di folder ini.
2. Jalankan: python -m http.server 8080
3. Buka http://localhost:8080 di Chrome atau Edge.
4. Pasang sebagai aplikasi: ikon "Install" di kanan address bar. Aplikasi terbuka di jendela sendiri.
5. Uji offline: DevTools > Network > Offline, lalu muat ulang. Aplikasi harus tetap terbuka.

B. UJI DI ANDROID (cara termudah: hosting HTTPS gratis)
1. Unggah folder ini ke Netlify Drop (app.netlify.com/drop) atau GitHub Pages. Anda mendapat alamat https.
2. Buka alamat itu di Chrome Android.
3. Menu titik tiga > "Instal aplikasi" atau "Tambahkan ke layar utama".
4. Buka dari ikon layar utama, lalu matikan data seluler dan Wi-Fi untuk menguji offline.

C. UJI ANDROID DARI PC TANPA HOSTING
1. Aktifkan Opsi Pengembang dan USB debugging di HP, sambungkan lewat USB.
2. Di PC buka chrome://inspect/#devices, aktifkan "Port forwarding": 8080 -> localhost:8080.
3. Jalankan server seperti langkah A, lalu buka http://localhost:8080 di Chrome HP.
Catatan: alamat http://IP-PC:8080 lewat Wi-Fi bisa dipakai untuk mencoba, tapi tidak bisa dipasang sebagai PWA karena bukan HTTPS.

D. APK ASLI (opsional, butuh Node.js dan Android Studio)
1. npm init -y && npm i @capacitor/core @capacitor/cli @capacitor/android
2. npx cap init BAKI-FIT id.bakifit.app --web-dir=www
3. Buat folder www, salin index.html, manifest.webmanifest, icon-*.png ke dalamnya (sw.js tidak wajib).
4. npx cap add android && npx cap sync
5. npx cap open android, lalu Build > Build APK di Android Studio.

CATATAN UJI
- Pengingat hanya berjalan saat aplikasi terbuka.
- Jika memperbarui index.html, naikkan nama cache di sw.js (bakifit-v2) agar pembaruan terpasang.
