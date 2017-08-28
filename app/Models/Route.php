<?php

namespace App\Models;

use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Model;

class Route extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'from',
        'from_lat',
        'from_lng',
        'to',
        'to_lat',
        'to_lng',
        'trip_id',
    ];

    /**
     * @var array
     */
    protected $casts = [
        'from' => 'array',
        'from_lat' => 'float',
        'from_lng' => 'float',
        'to' => 'array',
        'to_lat' => 'float',
        'to_lng' => 'float',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function trip()
    {
        return $this->belongsTo(Trip::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function bookings()
    {
        return $this->belongsToMany(Booking::class);
    }

    /**
     * @return int
     */
    public function getReservedSeatsAttribute() : int
    {
        return $this->bookings->reject(function ($booking) {
            return $booking->status !== Booking::STATUS_APPROVED;
        })->reduce(function ($carry, $booking) {
            return $carry + $booking->seats;
        }, 0);
    }

    /**
     * @return int
     */
    public function getAvailableSeatsAttribute() : int
    {
        if ($this->bookings->count() <= 0) {
            return $this->trip->seats;
        }

        return $this->trip->seats - $this->reserved_seats;
    }
}
