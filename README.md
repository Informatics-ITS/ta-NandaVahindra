# 🏁 Tugas Akhir (TA) - Final Project

**Nama Mahasiswa**: Made Nanda Wija Vahindra  
**NRP**: 5025211160  
**Judul TA**: Pengembangan Dashboard untuk Event Monitoring Berbasis Web 
dengan Google Sheets API Menggunakan React.js dan Express.js   
**Dosen Pembimbing**: Dr. Sarwosri, S.Kom., M.T.  

---

## 📺 Demo Aplikasi  

[![Demo Aplikasi](https://github.com/user-attachments/assets/be140c94-b658-4e51-bfb9-eb5730f0374d)](https://www.youtube.com/watch?v=KGVjLKzuH78)  
*Klik gambar di atas untuk menonton demo*

---

## 🛠 Panduan Instalasi & Menjalankan Software  

Proyek ini terdiri dari dua bagian utama:

- **Frontend**: React + Vite, dengan otentikasi Firebase  
- **Backend**: Express.js, terhubung ke Google Sheets API

---

### 🔧 Prasyarat Umum

- Node.js v18+
- Akun dan kredensial Firebase
- Google Sheets API + kredensial JSON
- Git

---

## 📦 Instalasi dan Konfigurasi

### 1. Clone Repository

```bash
git clone https://github.com/Informatics-ITS/ta-NandaVahindra.git
cd ta-NandaVahindra
```

---

## 🚀 FRONTEND

Terletak di folder `frontend/`

### 📂 Langkah-langkah

1. Masuk ke folder frontend:
   ```bash
   cd frontend
   ```

2. Install dependensi:
   ```bash
   npm install
   ```

3. Buat file `.env` berdasarkan `.env.example`, lalu isi kredensial Firebase Anda:

   ```env
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

4. Jalankan aplikasi:
   ```bash
   npm run dev
   ```

5. Buka browser di:  
   `http://localhost:5173`

---

## 🔙 BACKEND

Terletak di folder `backend/`

### 📂 Langkah-langkah

1. Masuk ke folder backend:
   ```bash
   cd backend
   ```

2. Install dependensi:
   ```bash
   npm install
   ```

3. Buat file `.env` berdasarkan `.env.example` dan isi:

   ```env
   GOOGLE_SERVICE_ACCOUNT_CREDENTIALS=./path/to/credentials.json
   SHEET_ID=...
   SHEET_NAME=...
   ```

4. Jalankan server:
   ```bash
   node server.js
   ```

5. Server akan berjalan di:  
   `http://localhost:8080`

---

## 📚 Dokumentasi Tambahan

- [Dokumentasi API](docs/api-docs.md)
- [Diagram Arsitektur](docs/System%20Architecture.md)
- [Struktur Data Input](docs/DataInputDMPPN.xlsx)


---

## ⁉️ Pertanyaan?

Hubungi:
- Penulis: 5025211160@student.its.ac.id
- Pembimbing Utama: sarwosri@if.its.ac.id
