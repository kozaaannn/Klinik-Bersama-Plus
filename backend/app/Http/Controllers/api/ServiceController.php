<?php
namespace App\Http\Controllers\API;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Service;


class ServiceController extends Controller
{
public function index()
{
return response()->json(Service::all());
}


public function show($slug)
{
$service = Service::where('slug', $slug)->firstOrFail();
return response()->json($service);
}
}