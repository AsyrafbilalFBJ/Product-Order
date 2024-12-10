<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Order;
use Illuminate\Support\Carbon;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dateNow = Carbon::now();
        $orders = [
            [
                "customer_id" => 1,
                "order_date" => $dateNow->copy()->addDays(1),
                "total_amount" => 1500000,
                "status" => "uncompleted"

            ],
            [
                "customer_id" => 1,
                "order_date" => $dateNow->copy()->addDays(2),
                "total_amount" => 3000000,
                "status" => "completed"

            ]
        ];

        foreach ($orders as $order) {
            Order::updateOrCreate($order);
        }
    }
}
