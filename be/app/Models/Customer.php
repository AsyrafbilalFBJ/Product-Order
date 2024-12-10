<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Order;

class Customer extends Model
{
    
    protected $table = "customers";
    protected $primaryKey = "customer_id";
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = [
        'customer_name', 
        'phone_number'
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'customer_id', 'customer_id');
    }
}
