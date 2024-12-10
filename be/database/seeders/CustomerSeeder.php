<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Customer;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = [
            [
                "customer_name" => "John",
                "phone_number" => "088209871234"

            ],
            [
                "customer_name" => "Marry",
                "phone_number" => "088209877890"
            ]
        ];

        foreach ($customers as $customer) {
            Customer::updateOrCreate($customer);
        }
    }
}
