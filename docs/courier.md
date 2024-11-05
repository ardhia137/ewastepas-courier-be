# Courier API Documentation

## Endpoint: Registrasi
- POST: `/api/auth/registration`
- Request Body:
```json
{
  "email" : "jamjam@gmail.com",
  "password" : "12345678",
  "confirm_password" : "12345678"
}
```
- Response:
```json
{
    "message": "Registration successful.",
    "data": {
        "id_user": 10,
        "Nama": null,
        "Email": "jamjam@gmail.com",
        "Password": "$2b$10$B.SEk1SjZX9e4tdOTcq/XuuczAjER5GNaIqnjX5Zoh74csk6vRS76",
        "No_Telp": null,
        "Tgl_Lahir": null,
        "Alamat": null,
        "NIK": null,
        "No_Rek": null,
        "KTP_URL": null,
        "KK_URL": null,
        "Foto": null,
        "Total_Point": null,
        "Berat_Sampah": null,
        "Roles": "kurir",
        "Status": "Tertunda",
        "is_verified": false,
        "Created_at": "2024-10-25T12:11:04.000Z",
        "Updated_at": "2024-10-25T12:11:04.000Z"
    }
}
```
## Endpoint: Kirim OTP/Kirim ulang OTP
- POST: `/api/auth/send-otp`
- Request Body:
```json
{
  "email" : "jamjam@gmail.com"
}
```
- Response:
```json
{
    "message": "OTP send to your email"
}
```

## Endpoint: Verifikasi OTP
- POST: `/api/auth/verify-otp`
- Request Body:
```json (registration)
{
    "email" : "jamjam@gmail.com",
    "otp" : "816662",
    "type" : "registration"
}
```
- Response:
```json
{
  "message": "User has been verified."
}
```
- Request Body:
```json (forgot_password)
{
    "email" : "jamjam@gmail.com",
    "otp" : "816662",
    "type" : "forgot_password"
}
```
- Response:
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1yaXpraWhhaWthbDI5NEBnbWFpbC5jb20iLCJpYXQiOjE3MzAwNTE1NjIsImV4cCI6MTczMDA1MjE2Mn0.Ba8-DWYWyVZsQRqwSHFZaQvxYDpVEdUs5lCBeB_SeEk"
}
```

## Endpoint: Lupa kata sandi
- PATCH: `/api/auth/forgot-password`
- Request Headers:
```json
{
  "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1yaXpraWhhaWthbDI5NEBnbWFpbC5jb20iLCJpYXQiOjE3MzAwNTE1NjIsImV4cCI6MTczMDA1MjE2Mn0.Ba8-DWYWyVZsQRqwSHFZaQvxYDpVEdUs5lCBeB_SeEk"
}
```
- Request Body:
```json
{
    "new_password": "12345678",
    "confirm_new_password" : "12345678"
}
```
- Response:
```json
{
    "message": "Change password succesfully."
}
```

## Endpoint: Login
- POST: `/api/auth/login`
- Request Body:
```json
{
  "email" : "asukayang@gmail.com",
  "password" : "12345678",
}
```
- Response:
```json
{
   "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im1hc2EgaWQgcGFrZSB0aXBlIGRhdGEgc3RyaW5nIiwiZW1haWwiOiJtcml6a2loYWlrYWwyOTRAZ21haWwuY29tIiwicm9sZSI6bnVsbCwiaWF0IjoxNzI5ODQzOTU1LCJleHAiOjE3Mjk4NjU1NTV9.Mvdpfi01-k2u6gvJp0LsB1VeG2HjoUn-VMIhpDV43Ow",
    "user": {
        "id": 1,
        "email": "asukayang@gmail.com",
        "role": "kurir"
    }
}
```
## Endpoint: Data user login
- GET: `/api/users`
- Request Headers:
```json
{
  "authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im1hc2EgaWQgcGFrZSB0aXBlIGRhdGEgc3RyaW5nIiwiZW1haWwiOiJtcml6a2loYWlrYWwyOTRAZ21haWwuY29tIiwicm9sZSI6bnVsbCwiaWF0IjoxNzI5ODQzOTU1LCJleHAiOjE3Mjk4NjU1NTV9.Mvdpfi01-k2u6gvJp0LsB1VeG2HjoUn-VMIhpDV43Ow"
}
```
- Response:
```json
{
    "user": {
        "id_user": 10,
        "Nama": "Rizki",
        "Email": "mrizhs294@gmail.com",
        "Password": "$2b$10$lAuYW99ZfLfoTfAUcN6Rc.FW9HkcQ7WIc6ZvNCp7qxNyx027Qj5He",
        "No_Telp": "08345678",
        "Tgl_Lahir": "2024-10-24T00:00:00.000Z",
        "Alamat": "Bandung",
        "NIK": "1234578",
        "No_Rek": "0987654321",
        "KTP_URL": "uploads/images/1729860931607-160855621.png",
        "KK_URL": "uploads/images/1729860931611-319170024.png",
        "Foto": "uploads/images/1729860931605-310423796.png",
        "Total_Point": null,
        "Berat_Sampah": null,
        "Roles": "kurir",
        "Status": "Tertunda",
        "is_verified": true,
        "Created_at": "2024-10-25T12:11:04.000Z",
        "Updated_at": "2024-10-25T19:55:31.000Z"
    }
}
```

## Endpoint: Lengkapi data user
- PATCH: `/api/users/:id`
- Request Headers:
```json
{
  "authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im1hc2EgaWQgcGFrZSB0aXBlIGRhdGEgc3RyaW5nIiwiZW1haWwiOiJtcml6a2loYWlrYWwyOTRAZ21haWwuY29tIiwicm9sZSI6bnVsbCwiaWF0IjoxNzI5ODQzOTU1LCJleHAiOjE3Mjk4NjU1NTV9.Mvdpfi01-k2u6gvJp0LsB1VeG2HjoUn-VMIhpDV43Ow"
}
```
- Request Body:

| Field          | Type           | Description                               |
|----------------|----------------|-------------------------------------------|
| `name`         | `string`       | Nama lengkap pengguna                     |
| `address`      | `string`       | Alamat lengkap pengguna                   |
| `nik`          | `string`       | Nomor Induk Kependudukan (NIK)           |
| `date_of_birth`| `string`       | Tanggal lahir dalam format `YYYY-MM-DD`   |
| `phone_number` | `string`       | Nomor telepon pengguna                    |
| `account_number`| `string`      | Nomor rekening pengguna                   |
| `profile_picture` | `file`      | Foto profil pengguna dalam format gambar  |
| `ktp`          | `file`         | Foto atau scan KTP dalam format gambar    |
| `kk`           | `file`         | Foto atau scan Kartu Keluarga (KK)        |

- Response:
```json
{
    "message": "Data successfully updated",
    "data": {
        "count": 1
    }
}
```

## Endpoint: Ubah kata sandi
- PATCH: `/api/users/change-password`
- Request Headers:
```json
{
  "authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im1hc2EgaWQgcGFrZSB0aXBlIGRhdGEgc3RyaW5nIiwiZW1haWwiOiJtcml6a2loYWlrYWwyOTRAZ21haWwuY29tIiwicm9sZSI6bnVsbCwiaWF0IjoxNzI5ODQzOTU1LCJleHAiOjE3Mjk4NjU1NTV9.Mvdpfi01-k2u6gvJp0LsB1VeG2HjoUn-VMIhpDV43Ow"
}
```
- Request Body:
```json
{
    "old_password" : "87654321",
    "new_password" : "12345678",
    "confirm_new_password" : "12345678"
}
```
- Response:
```json
{
  "message": "Change password successfully."
}
```


## Endpoint: Melihat Jenis dan Kategori Sampah Elektronik
- GET: `/api/sampah/jenis`
- Response:
```json
{
  "data": [
    {
      "id": 1,
      "nama": "Televisi",
      "kategori": "Peralatan Rumah Tangga"
    },
    {
      "id": 2,
      "nama": "Kulkas",
      "kategori": "Peralatan Rumah Tangga"
    }
  ]
}
```

## Endpoint: Melihat Permintaan Penjemputan Sampah Elektronik
- GET: `/api/penjemputan/permintaan`
- Response:
```json
{
  "data": [
    {
      "id": 101,
      "alamat": "Jl. Raya No. 1",
      "jenis_sampah": "Televisi",
      "status": "Menunggu",
      "tanggal": "2024-10-20"
    },
    {
      "id": 102,
      "alamat": "Jl. Merdeka No. 5",
      "jenis_sampah": "Kulkas",
      "status": "Diterima",
      "tanggal": "2024-10-19"
    }
  ]
}
```

## Endpoint: Menerima Permintaan Penjemputan Sampah Elektronik
- POST: `/api/penjemputan/terima`
- Request Body:
```json
{
  "permintaan_id": 101
}
```
Response:
```json
{
  "message": "Permintaan penjemputan berhasil diterima.",
  "permintaan_id": 101
}
```

## Endpoint: Melihat Lokasi Drop Box Terdekat
- GET: `/api/dropbox/terdekat`
- Response:
```json
{
  "data": [
    {
      "id": 1,
      "alamat": "Drop Box 1",
      "jarak": "500m"
    },
    {
      "id": 2,
      "alamat": "Drop Box 2",
      "jarak": "1km"
    }
  ]
} 
```

## Endpoint: Melihat Total Sampah Elektronik yang Sudah Dijemput
- GET: `/api/sampah/total`
- Response: 
```json
{
  "total_sampah": 50,
  "jenis": "Televisi"
}
```

## Endpoint: Melihat History Penjemputan Sampah Elektronik
- GET: `/api/penjemputan/history`
- Response:
```json
{
  "data": [
    {
      "id": 1,
      "alamat": "Jl. Raya No. 1",
      "jenis_sampah": "Televisi",
      "tanggal": "2024-10-20",
      "status": "Selesai"
    },
    {
      "id": 2,
      "alamat": "Jl. Merdeka No. 5",
      "jenis_sampah": "Kulkas",
      "tanggal": "2024-10-19",
      "status": "Selesai"
    }
  ]
}
```