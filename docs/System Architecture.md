# 🧭 System Architecture

Dokumen ini menjelaskan arsitektur sistem dari proyek Tugas Akhir yang terdiri dari dua komponen utama: **Frontend (React + Firebase)** dan **Backend (Express + Google Sheets API)**.

---

## 🏗️ Komponen Utama

### 1. Frontend (Client-side)
- Framework: React + Vite
- Auth: Firebase Authentication
- Output: SPA (Single Page Application) yang berjalan di browser

### 2. Backend (Server-side)
- Framework: Express.js (Node.js)
- Fungsi utama:
  - Handle request dari frontend
  - Validasi & routing data
  - Interaksi dengan Google Sheets

### 3. Database (Cloud-based)
- Google Sheets berfungsi sebagai _source of truth_ (pengganti database tradisional seperti MySQL)

---

## 🔄 Alur Sistem

![Alt Text](system%20architectur.drawio.png)


Penjelasan Alur:

1. User membuka frontend React di browser.

2. Firebase Authentication menangani proses login dan otorisasi.

3. Setelah login, request dikirim ke backend Express.

4. Backend berinteraksi dengan Google Sheets API menggunakan kredensial dari file JSON.

5. Backend melakukan Read ke spreadsheet melalui Google Sheets API sesuai permintaan user.