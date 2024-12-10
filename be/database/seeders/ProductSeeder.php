<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                "product_name" => "Meja Kayu",
                "unit_price" => 500000,
                "stock" => 80,
            ],
            [
                "product_name" => "Kursi Besi",
                "unit_price" => 300000,
                "stock" => 100,
            ]
        ];

        foreach ($products as $product) {
            Product::updateOrCreate($product);
        }
    }
}
