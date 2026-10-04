<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Karir;
use App\Models\Pelamar;
use App\Models\Notifikasi;
use App\Models\User;
use App\Mail\StatusPelamarMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class KarirController extends Controller
{
    /* ======================================================
    | 🌍 PUBLIC APIS (Untuk Pengunjung / User)
    ====================================================== */

    // Ambil lowongan aktif untuk halaman publik
    public function publicIndex()
    {
        $vacancies = Karir::where('is_active', true)
            ->orderBy('id', 'desc')
            ->get();

        return response()->json($vacancies);
    }

    // Mengirim lamaran kerja (Upload CV)
    public function apply(Request $request)
    {
        $validated = $request->validate([
            'nama'       => 'required|string|max:255',
            'email'      => 'required|email|max:255',
            'no_telepon' => 'required|string|max:30',
            'posisi'     => 'required|string|max:255',
            'karir_id'   => 'nullable|integer',
            'pesan'      => 'nullable|string',
            'cv'         => 'required|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240', // max 10MB
        ], [
            'nama.required'       => 'Nama lengkap wajib diisi.',
            'email.required'      => 'Email wajib diisi.',
            'no_telepon.required' => 'Nomor WhatsApp / Telepon wajib diisi.',
            'posisi.required'     => 'Posisi lowongan wajib dipilih.',
            'cv.required'         => 'File CV / Resume wajib diunggah.',
            'cv.mimes'            => 'Format CV harus berformat PDF, DOC, DOCX, atau Gambar (JPG/PNG).',
            'cv.max'              => 'Ukuran CV maksimal 10 MB.',
        ]);

        // Simpan file CV ke storage/app/public/cvs
        $file = $request->file('cv');
        $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $file->getClientOriginalName());
        $path = $file->storeAs('cvs', $filename, 'public');

        // Cek relasi user_id (jika login atau cocok email/no_telepon)
        $userId = null;
        if (auth('sanctum')->check()) {
            $userId = auth('sanctum')->id();
        } else {
            $matchedUser = User::where('email', $validated['email'])
                ->orWhere('no_telepon', $validated['no_telepon'])
                ->first();
            if ($matchedUser) {
                $userId = $matchedUser->id;
            }
        }

        $pelamar = Pelamar::create([
            'user_id'    => $userId,
            'karir_id'   => $request->karir_id,
            'posisi'     => $validated['posisi'],
            'nama'       => $validated['nama'],
            'email'      => $validated['email'],
            'no_telepon' => $validated['no_telepon'],
            'pesan'      => $request->pesan,
            'cv_path'    => $path,
            'status'     => 'menunggu',
        ]);

        // Buat notifikasi akun web bahwa lamaran sudah masuk
        Notifikasi::create([
            'user_id'    => $userId,
            'email'      => $validated['email'],
            'no_telepon' => $validated['no_telepon'],
            'judul'      => 'Lamaran Terkirim: ' . $validated['posisi'],
            'pesan'      => 'Berkas lamaran Anda untuk posisi ' . $validated['posisi'] . ' berhasil diterima dan saat ini berstatus Menunggu.',
            'tipe'       => 'karir',
            'status'     => 'menunggu',
            'link'       => '/riwayat?tab=lamaran',
            'data'       => ['pelamar_id' => $pelamar->id, 'posisi' => $validated['posisi']],
            'is_read'    => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Lamaran Anda berhasil dikirim! Tim HRD kami akan segera meninjau berkas Anda.',
            'data'    => $pelamar,
        ], 201);
    }

    /* ======================================================
    | 🔐 ADMIN APIS - MANAJEMEN LOWONGAN KARIR
    ====================================================== */

    public function index()
    {
        $karir = Karir::withCount('pelamars')->orderBy('id', 'desc')->get();
        return response()->json([
            'success' => true,
            'data'    => $karir,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'posisi'      => 'required|string|max:255',
            'lokasi'      => 'required|string|max:255',
            'tipe'        => 'required|string|max:100',
            'deskripsi'   => 'nullable|string',
            'kualifikasi' => 'nullable|string',
            'is_active'   => 'boolean',
        ]);

        $karir = Karir::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Lowongan karir berhasil ditambahkan.',
            'data'    => $karir,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $karir = Karir::findOrFail($id);

        $validated = $request->validate([
            'posisi'      => 'required|string|max:255',
            'lokasi'      => 'required|string|max:255',
            'tipe'        => 'required|string|max:100',
            'deskripsi'   => 'nullable|string',
            'kualifikasi' => 'nullable|string',
            'is_active'   => 'boolean',
        ]);

        $karir->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Lowongan karir berhasil diperbarui.',
            'data'    => $karir,
        ]);
    }

    public function destroy($id)
    {
        $karir = Karir::findOrFail($id);
        $karir->delete();

        return response()->json([
            'success' => true,
            'message' => 'Lowongan karir berhasil dihapus.',
        ]);
    }

    /* ======================================================
    | 🔐 ADMIN APIS - MANAJEMEN PELAMAR KERJA
    ====================================================== */

    public function getPelamars(Request $request)
    {
        $query = Pelamar::with('karir')->orderBy('id', 'desc');

        if ($request->has('status') && !empty($request->status) && $request->status !== 'semua') {
            $query->where('status', $request->status);
        }

        if ($request->has('search') && !empty($request->search)) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('nama', 'like', "%{$s}%")
                  ->orWhere('email', 'like', "%{$s}%")
                  ->orWhere('posisi', 'like', "%{$s}%")
                  ->orWhere('no_telepon', 'like', "%{$s}%");
            });
        }

        $pelamars = $query->get();

        return response()->json([
            'success' => true,
            'data'    => $pelamars,
        ]);
    }

    /**
     * UPDATE STATUS PELAMAR & KIRIM NOTIFIKASI
     * (Email, Nomor Telepon/WhatsApp, dan Akun Web)
     */
    public function updatePelamarStatus(Request $request, $id)
    {
        $pelamar = Pelamar::findOrFail($id);

        $validated = $request->validate([
            'status'        => 'required|in:menunggu,review,diterima,ditolak',
            'catatan'       => 'nullable|string',
            'send_email'    => 'nullable|boolean',
            'send_whatsapp' => 'nullable|boolean',
        ]);

        $status  = $validated['status'];
        $catatan = $request->catatan ?? $pelamar->catatan;

        // Cocokkan user_id jika belum terhubung
        if (!$pelamar->user_id) {
            $user = User::where('email', $pelamar->email)
                ->orWhere('no_telepon', $pelamar->no_telepon)
                ->first();
            if ($user) {
                $pelamar->user_id = $user->id;
            }
        }

        $pelamar->status = $status;
        $pelamar->catatan = $catatan;
        $pelamar->save();

        // ==========================================
        // 1. 📧 NOTIFIKASI EMAIL
        // ==========================================
        $emailSent = false;
        $sendEmail = $request->has('send_email') ? $request->boolean('send_email') : true;

        if ($sendEmail && in_array($status, ['diterima', 'ditolak', 'review'])) {
            try {
                Mail::to($pelamar->email)->send(new StatusPelamarMail($pelamar, $status, $catatan));
                $emailSent = true;
            } catch (\Exception $e) {
                Log::error('Gagal mengirim email status pelamar: ' . $e->getMessage());
            }
        }

        // ==========================================
        // 2. 📱 NOTIFIKASI NOMOR TELEPON (WHATSAPP)
        // ==========================================
        $cleanPhone = preg_replace('/\D/', '', $pelamar->no_telepon);
        if (str_starts_with($cleanPhone, '0')) {
            $cleanPhone = '62' . substr($cleanPhone, 1);
        } elseif (!str_starts_with($cleanPhone, '62')) {
            $cleanPhone = '62' . $cleanPhone;
        }

        $waMessage = $this->buildWhatsAppMessage($pelamar, $status, $catatan);
        $waUrl = 'https://wa.me/' . $cleanPhone . '?text=' . rawurlencode($waMessage);

        // Jika gateway Fonnte diatur pada .env
        $fonnteToken = env('FONNTE_TOKEN');
        if ($fonnteToken && in_array($status, ['diterima', 'ditolak'])) {
            try {
                Http::withHeaders([
                    'Authorization' => $fonnteToken,
                ])->post('https://api.fonnte.com/send', [
                    'target'  => $cleanPhone,
                    'message' => $waMessage,
                ]);
            } catch (\Exception $e) {
                Log::error('Fonnte WhatsApp API error: ' . $e->getMessage());
            }
        }

        // ==========================================
        // 3. 🌐 NOTIFIKASI MASUK KE AKUN WEB
        // ==========================================
        $judulNotif = match($status) {
            'diterima' => '🎉 Selamat! Lamaran DITERIMA (' . $pelamar->posisi . ')',
            'ditolak'  => 'Pemberitahuan Seleksi Lamaran: ' . $pelamar->posisi,
            'review'   => 'Lamaran Sedang Ditinjau: ' . $pelamar->posisi,
            default    => 'Update Status Lamaran: ' . $pelamar->posisi,
        };

        $pesanNotif = match($status) {
            'diterima' => 'Selamat! Anda dinyatakan DITERIMA untuk posisi ' . $pelamar->posisi . ' di Klinik Bersama Plus. Silakan periksa email dan WhatsApp Anda untuk informasi orientasi / penandatanganan kerja.' . ($catatan ? " [Catatan: {$catatan}]" : ''),
            'ditolak'  => 'Terima kasih atas minat Anda melamar posisi ' . $pelamar->posisi . '. Mohon maaf saat ini lamaran Anda belum dapat diterima. Berkas Anda tetap tersimpan dalam bank data talenta kami.' . ($catatan ? " [Catatan: {$catatan}]" : ''),
            'review'   => 'Berkas lamaran Anda untuk posisi ' . $pelamar->posisi . ' saat ini sedang dalam peninjauan aktif oleh tim HRD.',
            default    => 'Status lamaran Anda diperbarui menjadi ' . ucfirst($status) . '.',
        };

        Notifikasi::create([
            'user_id'    => $pelamar->user_id,
            'email'      => $pelamar->email,
            'no_telepon' => $pelamar->no_telepon,
            'judul'      => $judulNotif,
            'pesan'      => $pesanNotif,
            'tipe'       => 'karir',
            'status'     => $status,
            'link'       => '/riwayat?tab=lamaran',
            'data'       => [
                'pelamar_id' => $pelamar->id,
                'posisi'     => $pelamar->posisi,
                'catatan'    => $catatan,
            ],
            'is_read'    => false,
        ]);

        return response()->json([
            'success'          => true,
            'message'          => 'Status pelamar berhasil diperbarui menjadi ' . ucfirst($status) . '. Pemberitahuan ke Email, WhatsApp, dan Akun Web telah diproses!',
            'data'             => $pelamar,
            'email_sent'       => $emailSent,
            'whatsapp_url'     => $waUrl,
            'whatsapp_message' => $waMessage,
        ]);
    }

    /**
     * Helper untuk membuat teks pesan WhatsApp yang rapi dan profesional
     */
    private function buildWhatsAppMessage($pelamar, $status, $catatan = null)
    {
        if ($status === 'diterima') {
            $msg = "Halo Sdr/i *{$pelamar->nama}*,\n\n";
            $msg .= "Kami dari Tim HRD *Klinik Bersama Plus*.\n\n";
            $msg .= "🎉 *SELAMAT! ANDA DINYATAKAN DITERIMA*\n";
            $msg .= "Posisi: *{$pelamar->posisi}*\n\n";
            $msg .= "Berdasarkan evaluasi berkas CV dan kualifikasi yang Anda kirimkan, kami dengan senang hati menyampaikan bahwa Anda dinyatakan *DITERIMA* untuk bergabung bersama Klinik Bersama Plus.\n\n";
            if (!empty($catatan)) {
                $msg .= "📝 *Catatan / Instruksi HRD:*\n{$catatan}\n\n";
            }
            $msg .= "📧 Informasi lengkap dan rincian langkah selanjutnya telah kami kirimkan ke email Anda (*{$pelamar->email}*) dan dapat Anda pantau di akun website resmi Klinik Bersama Plus.\n\n";
            $msg .= "Mohon balas pesan WhatsApp ini sebagai konfirmasi penerimaan informasi. Terima kasih dan selamat bergabung!\n\n";
            $msg .= "_Tim HRD Klinik Bersama Plus_";
            return $msg;
        }

        if ($status === 'ditolak') {
            $msg = "Halo Sdr/i *{$pelamar->nama}*,\n\n";
            $msg .= "Kami dari Tim HRD *Klinik Bersama Plus*.\n\n";
            $msg .= "Terima kasih banyak atas waktu dan minat Anda untuk melamar posisi *{$pelamar->posisi}* di Klinik Bersama Plus.\n\n";
            $msg .= "Setelah melalui proses seleksi yang cermat, kami menginformasikan bahwa saat ini kami belum dapat melanjutkan proses lamaran Anda ke tahap berikutnya karena kebutuhan spesifik klinik saat ini.\n\n";
            if (!empty($catatan)) {
                $msg .= "📝 *Catatan HRD:*\n{$catatan}\n\n";
            }
            $msg .= "Data dan profil Anda tetap kami simpan dalam bank data kandidat kami untuk peluang lowongan di masa mendatang. Kami mendoakan yang terbaik untuk perjalanan karir Anda.\n\n";
            $msg .= "_Salam hangat,\nTim HRD Klinik Bersama Plus_";
            return $msg;
        }

        if ($status === 'review') {
            $msg = "Halo Sdr/i *{$pelamar->nama}*,\n\n";
            $msg .= "Kami dari Tim HRD *Klinik Bersama Plus*.\n\n";
            $msg .= "Lamaran kerja Anda untuk posisi *{$pelamar->posisi}* saat ini *SEDANG DITINJAU* oleh tim rekrutmen. Pantau terus email dan akun website Anda untuk kabar berikutnya.\n\n";
            $msg .= "_Tim HRD Klinik Bersama Plus_";
            return $msg;
        }

        return "Halo Sdr/i {$pelamar->nama}, status lamaran Anda untuk posisi {$pelamar->posisi} di Klinik Bersama Plus adalah: " . ucfirst($status);
    }

    public function deletePelamar($id)
    {
        $pelamar = Pelamar::findOrFail($id);

        // Hapus file CV dari storage jika ada
        if ($pelamar->cv_path && Storage::disk('public')->exists($pelamar->cv_path)) {
            Storage::disk('public')->delete($pelamar->cv_path);
        }

        $pelamar->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data pelamar berhasil dihapus.',
        ]);
    }
}
