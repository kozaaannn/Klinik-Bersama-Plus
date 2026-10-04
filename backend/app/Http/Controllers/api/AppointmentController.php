<?php
namespace App\Http\Controllers\API;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Appointment;


class AppointmentController extends Controller
{
public function index(Request $request)
{
return response()->json(Appointment::where('user_id', $request->user()->id)->with('service')->get());
}


public function store(Request $request)
{
$request->validate(['service_id'=>'required|exists:services,id','appointment_date'=>'required|date']);
$appt = Appointment::create([
'user_id'=>$request->user()->id,
'service_id'=>$request->service_id,
'appointment_date'=>$request->appointment_date,
'note'=>$request->note ?? null
]);
return response()->json($appt, 201);
}
}