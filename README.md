# Becak Rush - Yogyakarta Malioboro Edition 🛺

**Becak Rush** adalah game arcade *endless runner* bernuansa khas jalanan Malioboro, Yogyakarta. Kendalikan becak tradisional, jemput calon penumpang (`P`), nikmati camilan oleh-oleh Bakpia Pathok (`B`) untuk memulihkan nyawa, dan hindari rintangan jalan yang melaju kencang!

---

## 🎮 Kontrol Permainan (Controls)

| Aksi / Gerakan | Keyboard | Layar Sentuh / Pointer |
| :--- | :--- | :--- |
| **Belok Kiri** | Panah Kiri (`←`) atau Tombol `A` | Ketuk / Seret di sisi **kiri** layar |
| **Belok Kanan** | Panah Kanan (`→`) atau Tombol `D` | Ketuk / Seret di sisi **kanan** layar |
| **Mulai / Restart** | Tombol `Space` atau `Enter` | Ketuk layar |
| **Jeda (Pause)** | Tombol `P` atau `Escape` | — |

---

## 🚦 Elemen & Item Permainan

- 🛺 **Becak Tradisional**: Kendaraan utama berwarna hijau khas Jogja yang melaju dinamis menyusuri aspal Malioboro.
- 🧑‍🤝‍🧑 **Penumpang (`P`)**: Kumpulkan penumpang untuk menambah skor (`+10` poin).
- 🥮 **Bakpia Pathok (`B`)**: Oleh-oleh khas Jogja yang memulihkan `+1` nyawa becak serta memberi bonus poin (`+5` poin).
- 🚧 **Rintangan & Blokade (`X`)**: Hambatan jalan berwarna merah yang harus dihindari. Setiap tabrakan mengurangi nyawa (`-1`) dan memberi waktu perlindungan (*invulnerability*) sesaat.
- 🏁 **Dodge Score**: Berhasil menghindari rintangan hingga lewat batas bawah layar memberikan poin tambahan (`+1` poin).

---

## 📈 Sistem Level & Kesulitan

Game ini dilengkapi sistem progresif level (`Level 1` hingga `Level 8`):
- Setiap level berdurasi **18 detik**.
- Semakin tinggi level, kecepatan rintangan dan frekuensi kemunculan rintangan semakin menantang.
- Skor tertinggi (*High Score*) disimpan secara otomatis menggunakan `localStorage`.

---

## 🛠️ Struktur Proyek (Project Structure)

Dibangun menggunakan arsitektur modular HTML5 Canvas dan JavaScript murni (*ES Modules*) tanpa framework atau dependensi eksternal:

- `index.html`: Wadah halaman game utama dengan canvas responsif dan dukungan aksesibilitas screen reader.
- `src/config.js`: Konfigurasi konstanta fisik, dimensi canvas (640x1280), kecepatan, dan palet warna estetik.
- `src/random.js`: PRNG deterministik (*Mulberry32*) untuk konsistensi permainan dan pengujian scene.
- `src/input.js`: Manajemen input terpadu untuk keyboard, mouse, dan multi-touch/pointer.
- `src/world.js`: Simulasi fisika independen frame-rate, object pooling, collision detection (AABB), dan level progression.
- `src/render.js`: Renderer grafis 2D Canvas bertema landmark Jogja dan Malioboro.
- `src/shots.js`: Sistem autopilot untuk staging screenshot otomatis.
- `src/main.js`: Main loop dengan *fixed-timestep accumulator* (60 FPS) dan *state machine* layar game (Title, Play, Paused, Game Over).

---

## 🚀 Memulai & Menjalankan

Buka `index.html` melalui static file server lokal (seperti Live Server, Python HTTP server, atau Node.js static server) untuk menikmati petualangan seru di Malioboro!
