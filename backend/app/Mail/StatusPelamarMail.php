<?php

namespace App\Mail;

use App\Models\Pelamar;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StatusPelamarMail extends Mailable
{
    use Queueable, SerializesModels;

    public $pelamar;
    public $status;
    public $catatan;

    /**
     * Create a new message instance.
     */
    public function __construct(Pelamar $pelamar, $status = null, $catatan = null)
    {
        $this->pelamar = $pelamar;
        $this->status = $status ?? $pelamar->status;
        $this->catatan = $catatan ?? $pelamar->catatan;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = match ($this->status) {
            'diterima' => '🎉 Selamat! Lamaran Anda DITERIMA - ' . $this->pelamar->posisi . ' | Klinik Bersama Plus',
            'ditolak'  => 'Pemberitahuan Hasil Seleksi Lamaran - ' . $this->pelamar->posisi . ' | Klinik Bersama Plus',
            'review'   => 'Lamaran Anda Sedang Ditinjau - ' . $this->pelamar->posisi . ' | Klinik Bersama Plus',
            default    => 'Update Status Lamaran Kerja - ' . $this->pelamar->posisi . ' | Klinik Bersama Plus',
        };

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.status_pelamar',
            with: [
                'pelamar' => $this->pelamar,
                'status'  => $this->status,
                'catatan' => $this->catatan,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }
}
