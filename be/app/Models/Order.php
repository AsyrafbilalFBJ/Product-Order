<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\OrderDetail;
use App\Models\Customer;

class Order extends Model
{
    protected $table = "orders";
    protected $primaryKey = "order_id";
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = [
        'customer_id',
        'order_date', 
        'total_amount', 
        'status'
    ];

    public function orderDetails(): HasMany
    {
        return $this->hasMany(OrderDetail::class, 'order_id', 'order_id');
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'customer_id');
    }
}
