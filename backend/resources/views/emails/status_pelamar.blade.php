<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pemberitahuan Status Lamaran - Klinik Bersama Plus</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #334155; line-height: 1.6;">

  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 10px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); padding: 32px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
                KLINIK <span style="color: #fda4af;">BERSAMA PLUS</span>
              </h1>
              <p style="margin: 6px 0 0; color: #e0f2fe; font-size: 13px; font-weight: 500;">
                Pelayanan Kesehatan Prima, Profesional & Terpercaya
              </p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px;">
              <p style="margin: 0 0 16px; font-size: 16px; font-weight: 700; color: #0f172a;">
                Yth. Sdr/i {{ $pelamar->nama }},
              </p>

              @if($status === 'diterima')
                <!-- Status Diterima -->
                <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 16px; padding: 22px; margin-bottom: 24px; text-align: center;">
                  <span style="display: inline-block; background-color: #059669; color: #ffffff; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 4px 14px; border-radius: 20px; margin-bottom: 10px;">
                    ✓ DITERIMA
                  </span>
                  <h2 style="margin: 4px 0 8px; color: #065f46; font-size: 20px; font-weight: 800;">
                    Selamat! Anda Dinyatakan Lolos Seleksi
                  </h2>
                  <p style="margin: 0; color: #047857; font-size: 14px;">
                    Posisi: <strong style="color: #064e3b;">{{ $pelamar->posisi }}</strong>
                  </p>
                </div>

                <p style="font-size: 14px; color: #475569; margin: 0 0 16px; line-height: 1.7;">
                  Terima kasih atas partisipasi Anda dalam proses rekrutmen di <strong>Klinik Bersama Plus</strong>. Berdasarkan evaluasi berkas CV, kualifikasi, dan kriteria yang telah kami tetapkan, kami dengan bangga menginformasikan bahwa lamaran Anda dinyatakan <strong>DITERIMA</strong>.
                </p>

                @if(!empty($catatan))
                  <div style="background-color: #f8fafc; border-left: 4px solid #0284c7; padding: 14px 16px; border-radius: 8px; margin-bottom: 20px;">
                    <strong style="color: #0369a1; font-size: 13px; display: block; margin-bottom: 4px;">Catatan / Instruksi dari Tim HRD:</strong>
                    <p style="margin: 0; font-size: 13px; color: #334155; white-space: pre-line;">{{ $catatan }}</p>
                  </div>
                @endif

                <div style="background-color: #f8fafc; border-radius: 12px; padding: 18px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
                  <strong style="color: #0f172a; font-size: 13px; display: block; margin-bottom: 8px;">Langkah Selanjutnya:</strong>
                  <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #475569; line-height: 1.8;">
                    <li>Tim HRD kami akan menghubungi Anda melalui WhatsApp di nomor <strong>{{ $pelamar->no_telepon }}</strong> untuk konfirmasi dan penjelasan detail teknis.</li>
                    <li>Mohon siapkan dokumen asli (Ijazah, Transkrip Nilai, STR/SIP aktif bagi tenaga medis, KTP, dan sertifikat pendukung).</li>
                    <li>Status lamaran resmi Anda juga telah diperbarui di akun website Klinik Bersama Plus.</li>
                  </ul>
                </div>

              @elseif($status === 'ditolak')
                <!-- Status Ditolak -->
                <div style="background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 16px; padding: 22px; margin-bottom: 24px; text-align: center;">
                  <span style="display: inline-block; background-color: #e11d48; color: #ffffff; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 4px 14px; border-radius: 20px; margin-bottom: 10px;">
                    HASIL SELEKSI
                  </span>
                  <h2 style="margin: 4px 0 8px; color: #9f1239; font-size: 20px; font-weight: 800;">
                    Informasi Status Lamaran Kerja
                  </h2>
                  <p style="margin: 0; color: #be123c; font-size: 14px;">
                    Posisi: <strong style="color: #881337;">{{ $pelamar->posisi }}</strong>
                  </p>
                </div>

                <p style="font-size: 14px; color: #475569; margin: 0 0 16px; line-height: 1.7;">
                  Terima kasih banyak atas waktu, dedikasi, dan minat yang Anda tunjukkan untuk bergabung bersama <strong>Klinik Bersama Plus</strong> pada posisi <strong>{{ $pelamar->posisi }}</strong>.
                </p>

                <p style="font-size: 14px; color: #475569; margin: 0 0 16px; line-height: 1.7;">
                  Kami telah meninjau setiap berkas dengan sangat teliti. Namun, sehubungan dengan keterbatasan kuota posisi dan kecocokan spesifik profil kebutuhan saat ini, kami ingin menginformasikan bahwa untuk saat ini kami belum dapat memproses lamaran Anda ke tahap berikutnya.
                </p>

                @if(!empty($catatan))
                  <div style="background-color: #f8fafc; border-left: 4px solid #64748b; padding: 14px 16px; border-radius: 8px; margin-bottom: 20px;">
                    <strong style="color: #475569; font-size: 13px; display: block; margin-bottom: 4px;">Pesan Tambahan dari Tim HRD:</strong>
                    <p style="margin: 0; font-size: 13px; color: #334155; white-space: pre-line;">{{ $catatan }}</p>
                  </div>
                @endif

                <p style="font-size: 14px; color: #475569; margin: 0 0 20px; line-height: 1.7;">
                  Berkas dan kualifikasi Anda akan tetap tersimpan dalam bank data talenta kami. Apabila di kemudian hari terdapat peluang karir yang sesuai dengan kompetensi Anda, kami akan dengan senang hati menghubungi Anda kembali. Kami mendoakan yang terbaik bagi perjalanan karir profesional Anda.
                </p>

              @else
                <!-- Status Lainnya (Review / Menunggu) -->
                <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 16px; padding: 22px; margin-bottom: 24px; text-align: center;">
                  <h2 style="margin: 4px 0 8px; color: #0369a1; font-size: 20px; font-weight: 800;">
                    Status Lamaran: {{ ucfirst($status) }}
                  </h2>
                  <p style="margin: 0; color: #0284c7; font-size: 14px;">
                    Posisi: <strong>{{ $pelamar->posisi }}</strong>
                  </p>
                </div>
                <p style="font-size: 14px; color: #475569; margin: 0 0 16px; line-height: 1.7;">
                  Berkas lamaran Anda saat ini berstatus <strong>{{ ucfirst($status) }}</strong> dan sedang dalam proses oleh tim rekrutmen Klinik Bersama Plus.
                </p>
              @endif

              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0 10px;">
                <a href="http://localhost:5173/riwayat" style="display: inline-block; background-color: #0284c7; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 12px 28px; border-radius: 12px; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25);">
                  Lihat Status di Akun Website
                </a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 32px; text-align: center; font-size: 12px; color: #64748b;">
              <p style="margin: 0 0 4px; font-weight: 700; color: #334155;">
                Tim HRD & Rekrutmen — Klinik Bersama Plus
              </p>
              <p style="margin: 0 0 6px;">
                Email ini dikirimkan otomatis sehubungan dengan pengajuan lamaran kerja Anda di website resmi Klinik Bersama Plus.
              </p>
              <p style="margin: 0; color: #94a3b8;">
                © {{ date('Y') }} Klinik Bersama Plus. Hak Cipta Dilindungi.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
