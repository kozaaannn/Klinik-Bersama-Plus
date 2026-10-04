<?php
namespace App\Models;


use Illuminate\Database\Eloquent\Model;


class Appointment extends Model
{
protected $fillable = ['user_id','service_id','appointment_date','note','status'];


public function service() { return $this->belongsTo(Service::class); }
public function user() { return $this->belongsTo(User::class); }
}