<?php

namespace Tests\Unit;

use App\User;
use Carbon\Carbon;
use Tests\TestCase;
use App\Models\Trip;
use App\Models\Route;
use App\Models\Vehicle;
use App\Services\SearchTripsWithTransfersService;

class SearchTripWithTransfersServiceTest extends TestCase
{
    const POINT_A = [50, 52];
    const POINT_B = [54, 56];
    const POINT_C = [58, 60];
    const POINT_D = [60, 62];

    /**
     * @test
     */
    public function case_1()
    {
        $this->createTrip([self::POINT_A, self::POINT_B], Carbon::now());
        $this->createTrip([self::POINT_B, self::POINT_C], Carbon::now()->addHours(10));
        $this->createTrip([self::POINT_B, self::POINT_A, self::POINT_C], Carbon::now()->addHours(20));

        $service = app()->make(SearchTripsWithTransfersService::class);
        $searchRequest = new SearchTripRequest();
        $searchRequest->fromLat = self::POINT_A[0];
        $searchRequest->fromLng = self::POINT_A[1];
        $searchRequest->toLat = self::POINT_C[0];
        $searchRequest->toLng = self::POINT_C[1];

        $possibleRoutes = $service->search($searchRequest);

        $this->assertEquals(2, $possibleRoutes['data']->count());
    }

    /**
     * @test
     */
    public function case_2()
    {
        $this->createTrips([self::POINT_A, self::POINT_B], 2, Carbon::now());
        $this->createTrips([self::POINT_B, self::POINT_C], 2, Carbon::now()->addHours(10));

        $service = app()->make(SearchTripsWithTransfersService::class);
        $searchRequest = new SearchTripRequest();
        $searchRequest->fromLat = self::POINT_A[0];
        $searchRequest->fromLng = self::POINT_A[1];
        $searchRequest->toLat = self::POINT_C[0];
        $searchRequest->toLng = self::POINT_C[1];

        $possibleRoutes = $service->search($searchRequest);

        $this->assertEquals(4, $possibleRoutes['data']->count());
    }

    /**
     * @test
     */
    public function case_3()
    {
        $this->createTrip([self::POINT_A, self::POINT_D], Carbon::now()->addHours(1));
        $this->createTrip([self::POINT_A, self::POINT_B], Carbon::now()->addHours(2));
        $this->createTrip([self::POINT_B, self::POINT_C], Carbon::now()->addHours(3));
        $this->createTrip([self::POINT_C, self::POINT_D], Carbon::now()->addHours(4));

        $service = app()->make(SearchTripsWithTransfersService::class);
        $searchRequest = new SearchTripRequest();
        $searchRequest->fromLat = self::POINT_A[0];
        $searchRequest->fromLng = self::POINT_A[1];
        $searchRequest->toLat = self::POINT_D[0];
        $searchRequest->toLng = self::POINT_D[1];

        $searchRequest->transfers = 3;
        $possibleRoutes = $service->search($searchRequest);

        $this->assertEquals(2, $possibleRoutes['data']->count());

        $searchRequest->transfers = 1;
        $possibleRoutes = $service->search($searchRequest);
        $this->assertEquals(1, $possibleRoutes['data']->count());
    }

    /**
     * @test
     */
    public function case_4()
    {
        $this->createTrip([self::POINT_A, self::POINT_D], Carbon::now()->subHour(1));
        $this->createTrip([self::POINT_A, self::POINT_B], Carbon::now()->addHours(1));
        $this->createTrip([self::POINT_B, self::POINT_C], Carbon::now()->addHours(10));
        $this->createTrip([self::POINT_C, self::POINT_D], Carbon::now()->addHours(20));

        $service = app()->make(SearchTripsWithTransfersService::class);
        $searchRequest = new SearchTripRequest();
        $searchRequest->fromLat = self::POINT_A[0];
        $searchRequest->fromLng = self::POINT_A[1];
        $searchRequest->toLat = self::POINT_D[0];
        $searchRequest->toLng = self::POINT_D[1];

        $searchRequest->transfers = 10;
        $possibleRoutes = $service->search($searchRequest);
        $this->assertEquals(1, $possibleRoutes['data']->count());
    }

    /**
     * @param $routes
     * @param $count
     * @param $startAt
     */
    private function createTrips($routes, $count, $startAt)
    {
        foreach (range(1, $count) as $item) {
            $this->createTrip($routes, $startAt);
        }
    }

    /**
     * @param $routes
     * @param $startAt
     * @return mixed
     */
    private function createTrip($routes, $startAt)
    {
        $driver = factory(User::class)->create([
            'permissions' => User::DRIVER_PERMISSION,
        ]);

        $vehicle = factory(Vehicle::class)->create([
            'user_id' => $driver->id,
        ]);

        $trip = factory(Trip::class)->create([
            'user_id' => $driver->id,
            'vehicle_id' => $vehicle->id,
            'start_at' => $startAt,
        ]);

        foreach ($this->getRoutesFromWaypoints($routes) as $key => $route) {
            factory(Route::class)->create(array_merge($route, [
                'trip_id' => $trip->id,
                'start_at' => $startAt->addMinutes($key),
                'end_at' => $startAt->addMinutes($key + 1),
            ]));
        }

        return $trip;
    }

    /**
     * @param $waypoints
     * @return \Illuminate\Support\Collection
     */
    private function getRoutesFromWaypoints($waypoints)
    {
        $tripWaypoints = collect([]);
        $routes = collect([]);

        if (! empty($waypoints)) {
            foreach ($waypoints as $tripWaypoint) {
                $tripWaypoints->push($tripWaypoint);
            }
        }

        foreach (range(0, $tripWaypoints->count() - 2) as $iteration) {
            $chunk = $tripWaypoints->slice($iteration, 2)->values();

            $routes->push([
                'from' => implode('|', $chunk[0]),
                'from_lat' => $chunk[0][0],
                'from_lng' => $chunk[0][1],
                'to' => implode('|', $chunk[1]),
                'to_lat' => $chunk[1][0],
                'to_lng' => $chunk[1][1],
            ]);
        }

        return $routes;
    }
}
