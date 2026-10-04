<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model {
  protected $fillable = ['invoice','user_id','total','payment','change_amount'];
  public function items(){ return $this->hasMany(TransactionItem::class); }
}
