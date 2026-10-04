<?php
namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller {
  public function index(){ return response()->json(Product::all()); }
  public function show($id){ return response()->json(Product::findOrFail($id)); }
}
