<?php

namespace Database\Seeders;

use App\Models\DompetKeuangan;
use App\Models\Pengaturan;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Buat akun Owner default
        User::updateOrCreate(
            ['email' => 'owner@warmindo.com'],
            [
                'name'     => 'Owner',
                'email'    => 'owner@warmindo.com',
                'password' => Hash::make('password'),
                'role'     => 'owner',
            ]
        );

        // Buat akun Kasir default
        User::updateOrCreate(
            ['email' => 'kasir@warmindo.com'],
            [
                'name'     => 'Kasir',
                'email'    => 'kasir@warmindo.com',
                'password' => Hash::make('password'),
                'role'     => 'kasir',
            ]
        );

        // Inisialisasi 3 Dompet Keuangan
        foreach (['modal', 'operasional', 'keuntungan'] as $tipe) {
            DompetKeuangan::firstOrCreate(
                ['tipe' => $tipe],
                ['saldo' => 0]
            );
        }

        // Pengaturan default sistem
        $pengaturan = [
            ['kunci' => 'persen_operasional', 'nilai' => '20',           'keterangan' => 'Persentase dana operasional dari HPP (%)'],
            ['kunci' => 'nama_usaha',          'nilai' => 'WARMINDO P3K', 'keterangan' => 'Nama usaha'],
            ['kunci' => 'alamat_usaha',        'nilai' => '',             'keterangan' => 'Alamat usaha'],
            ['kunci' => 'telepon_usaha',       'nilai' => '',             'keterangan' => 'Nomor telepon usaha'],
            ['kunci' => 'footer_struk',        'nilai' => 'Terima kasih sudah berkunjung!', 'keterangan' => 'Teks footer struk'],
        ];

        foreach ($pengaturan as $item) {
            Pengaturan::updateOrCreate(
                ['kunci' => $item['kunci']],
                $item
            );
        }
    }
}
