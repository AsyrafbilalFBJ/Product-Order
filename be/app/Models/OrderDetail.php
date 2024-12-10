<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use App\Models\Order;
use App\Models\Product;

class OrderDetail extends Model
{
    protected $table = "order_details";
    protected $primaryKey = "order_detail_id";
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = [
        'order_id', 
        'product_id', 
        'quantity', 
        'sub_total', 
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'order_id', 'order_id');
    }

    public function products(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }
}
