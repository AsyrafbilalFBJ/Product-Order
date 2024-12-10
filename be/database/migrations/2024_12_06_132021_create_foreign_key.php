<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // $table->foreign('customer_id')->after('order_id')->constrained("orders");
            $table->foreignId('customer_id')->after('order_id')->references('customer_id')->on('customers')->onDelete('cascade');
        });

        Schema::table('order_details', function (Blueprint $table) {
            // $table->foreign('order_id')->after('order_detail_id')->constrained("order_details");
            // $table->foreign('product_id')->after('order_id')->constrained("order_details");
            $table->foreignId('order_id')->after('order_detail_id')->references('order_id')->on('orders')->onDelete('cascade');
            $table->foreignId('product_id')->after('order_id')->references('product_id')->on('products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('foreign_key');
    }
};
