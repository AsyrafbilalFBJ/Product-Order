<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;
use App\Models\OrderDetail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Carbon;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::with('customer')->get();
        return response()->json([
            'status' => 200,
            'message' => 'Successfully get orders',
            'data' => $orders
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $dateNow = Carbon::now();
        $req = $request->all();
        
        $validate = Validator::make($req, [
            'customer_id' => 'required',
            'order_date' => 'required',
            'order_details' => 'required|array',
            'order_details.*.product_id' => 'required|numeric',
            'order_details.*.quantity' => 'required|integer|min:1',
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status_code' => 422,
                'error' => $validate->errors(),
                'message' => 'Validation Error',
            ], 422);
        }

        $totalAmount = 0;

        $order = Order::create([
            'customer_id' => $req['customer_id'],
            'order_date' => $req['order_date'],
            'total_amount' => $totalAmount,
            'status' => "uncompleted"
        ]);

        foreach ($req['order_details'] as $detail) {
            $product = Product::findOrFail($detail['product_id']); // Ambil data produk dari database

            $subtotal = $product->unit_price * $detail['quantity']; // Hitung subtotal
            $totalAmount += $subtotal; // Tambahkan ke totalAmount

            OrderDetail::create([
                'order_id' => $order->order_id,
                'product_id' => $detail['product_id'],
                'quantity' => $detail['quantity'],
                'sub_total' => $subtotal
            ]);

            $product->update([
                'stock' => $product->stock - $detail['quantity']
            ]);
        }

        $order->update([
            'total_amount' => $totalAmount
        ]);

        return response()->json([
            'status_code' => 201,
            'message' => 'Order created successfully!',
            'order' => $order,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $order = Order::where('order_id', $id)
                ->with(['customer', 'orderDetails.products'])
                ->first();
        return response()->json([
            'status' => 200,
            'message' => 'Successfully get order',
            'data' => $order
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $req = $request->all();
        $order = Order::findOrFail($id);

        // Validasi input untuk Order
        $validate = Validator::make($req, [
            'order_date' => 'sometimes|date',
            'status' => 'sometimes|string',
            'customer_id' => 'sometimes|exists:customers,customer_id',
            'order_details' => 'sometimes|array',
            'order_details.*.order_detail_id' => 'required_with:order_details|exists:order_details,order_detail_id',
            'order_details.*.product_id' => 'sometimes|exists:products,product_id',
            'order_details.*.quantity' => 'sometimes|integer|min:1',
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status_code' => 422,
                'error' => $validate->errors(),
                'message' => 'Validation Error',
            ], 422);
        }

        // Update Order
        $order->update([
            'customer_id' => $req['customer_id'],
            'order_date' => $req['order_date'],
            'status' => $req['status']
        ]);

        // Jika ada order_details di dalam request, perbarui data masing-masing
        if ($request->has('order_details')) {
            foreach ($req['order_details'] as $detail) {
                $orderDetail = OrderDetail::findOrFail($detail['order_detail_id']);

                // Dapatkan produk terkait untuk menghitung stok
                $product = Product::findOrFail($orderDetail->product_id);

                // Update product_id jika diberikan
                if (isset($detail['product_id']) && $detail['product_id'] != $orderDetail->product_id) {
                    // Tambahkan kembali stok produk lama sebelum mengganti produk
                    $oldProduct = Product::findOrFail($orderDetail->product_id);
                    $oldProduct->stock += $orderDetail->quantity;
                    $oldProduct->save();

                    $orderDetail->product_id = $detail['product_id'];
                    $product = Product::findOrFail($detail['product_id']);
                }

                // Hitung selisih quantity lama dan baru
                $quantityDiff = $detail['quantity'] - $orderDetail->quantity;

                // Update stok produk
                $product->stock -= $quantityDiff;
                $product->save();

                // Hitung ulang subtotal berdasarkan unit_price produk
                $orderDetail->quantity = $detail['quantity'];
                $orderDetail->sub_total = $product->unit_price * $orderDetail->quantity;
                $orderDetail->save();
            }
        }

        // Hitung ulang total_amount pada tabel Orders
        $order->total_amount = $order->orderDetails->sum('sub_total');
        $order->save();

        return response()->json([
            'status_code' => 200,
            'message' => 'Order and details updated successfully!',
            'data' => $order->load('orderDetails'), // Include relasi OrderDetails
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $order = Order::where('order_id', $id)
                ->with(['customer', 'orderDetails.products'])
                ->first();
        
        if($order->status == "uncompleted"){
            foreach ($order->orderDetails as $detail) {
                $product = $detail->products;
    
                if ($product) {
                    $product->update([
                        'stock' => $product->stock + $detail->quantity,
                    ]);
                }
            }
        }
        $order->delete();
        return response()->json([
            'status' => 200,
            'message' => 'Successfully delete order',
            'data' => $order
        ], 200);
    }
}
