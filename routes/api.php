<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['prefix' => 'user', 'as' => 'user.'], function () {
    Route::post('register',
        ['middleware' => 'jwt.guest', 'as' => 'register', 'uses' => 'Auth\RegisterController@register']);
    Route::post('verify', ['middleware' => 'jwt.guest', 'as' => 'verify', 'uses' => 'Auth\RegisterController@verify']);
    Route::post('authorization', ['middleware' => 'jwt.guest', 'as' => 'authorization', 'uses' => 'Auth\LoginController@authorization']);
    Route::post('logout', ['as' => 'logout', 'uses' => 'Auth\LoginController@logout']);
});

Route::group([
    'prefix' => 'trips',
    'as' => 'trips.',
    'middleware' => ['jwt.auth', 'jwt.role:'.\App\User::DRIVER_PERMISSION],
], function () {
    Route::get('/', ['as' => 'all', 'uses' => 'TripsController@getAll']);
    Route::get('/upcoming', ['as' => 'upcoming', 'uses' => 'TripsController@getUpcoming']);
    Route::get('/past', ['as' => 'past', 'uses' => 'TripsController@getPast']);
    Route::post('create', ['as' => 'create', 'uses' => 'TripsController@create']);
    Route::patch('update/{trip}', ['as' => 'update', 'uses' => 'TripsController@update']);
    Route::delete('{trip}', ['as' => 'delete', 'uses' => 'TripsController@delete']);
});

Route::middleware('jwt.guest')->post('v1/password-resets', ['as' => 'password.forgot', 'uses' => 'Auth\PasswordResetsController@forgot']);
Route::middleware('jwt.guest')->put('v1/password-resets', ['as' => 'password.reset', 'uses' => 'Auth\PasswordResetsController@reset']);

