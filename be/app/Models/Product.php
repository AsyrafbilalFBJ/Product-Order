<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\OrderDetail;

class Product extends Model
{
    protected $table = "products";
    protected $primaryKey = "product_id";
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = [
        'product_name', 
        'unit_price', 
        'stock', 
    ];

    public function orderDetail(): BelongsTo
    {
        return $this->belongsTo(OrderDetail::class, 'product_id', 'product_id');
    }
}
