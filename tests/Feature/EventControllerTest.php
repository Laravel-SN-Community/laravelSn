<?php

declare(strict_types=1);

use App\Enums\EventRegistrationStatus;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

describe('Events index', function () {
    it('shows upcoming events by default', function () {
        Event::factory()->upcoming()->create(['status' => 'published']);
        Event::factory()->past()->create(['status' => 'published']);

        $this->get(route('events.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('events/index')
                ->has('events.data', 1)
            );
    });

    it('shows past events when tab=past', function () {
        Event::factory()->upcoming()->create(['status' => 'published']);
        Event::factory()->past()->create(['status' => 'published']);

        $this->get(route('events.index', ['tab' => 'past']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->has('events.data', 1));
    });
});

describe('Event registration', function () {
    it('allows authenticated user to register', function () {
        $user = User::factory()->create();
        $event = Event::factory()->upcoming()->create([
            'status' => 'published',
            'capacity' => 50,
        ]);

        $this->actingAs($user)
            ->post(route('events.register', $event))
            ->assertRedirect();

        $this->assertDatabaseHas('event_registrations', [
            'event_id' => $event->id,
            'user_id' => $user->id,
            'status' => EventRegistrationStatus::Confirmed->value,
        ]);
    });

    it('puts user on waitlist when event is full', function () {
        $event = Event::factory()->upcoming()->create([
            'status' => 'published',
            'capacity' => 2,
            'waitlist_capacity' => 5,
        ]);

        EventRegistration::factory()
            ->count(2)
            ->for($event)
            ->create(['status' => EventRegistrationStatus::Confirmed]);

        $latecomer = User::factory()->create();

        $this->actingAs($latecomer)
            ->post(route('events.register', $event))
            ->assertRedirect();

        $this->assertDatabaseHas('event_registrations', [
            'event_id' => $event->id,
            'user_id' => $latecomer->id,
            'status' => EventRegistrationStatus::Waitlisted->value,
        ]);
    });

    it('prevents duplicate registration', function () {
        $user = User::factory()->create();
        $event = Event::factory()->upcoming()->create([
            'status' => 'published',
            'capacity' => 50,
        ]);

        $this->actingAs($user)->post(route('events.register', $event));
        $response = $this->actingAs($user)->post(route('events.register', $event));

        $response->assertSessionHasErrors('registration');

        expect(EventRegistration::where('event_id', $event->id)->where('user_id', $user->id)->count())
            ->toBe(1);
    });

    it('requires authentication to register', function () {
        $event = Event::factory()->upcoming()->create(['status' => 'published']);

        $this->post(route('events.register', $event))
            ->assertRedirect(route('login'));
    });

    it('cancels registration and promotes from waitlist', function () {
        $event = Event::factory()->upcoming()->create([
            'status' => 'published',
            'capacity' => 2,
        ]);

        $confirmed = EventRegistration::factory()
            ->count(2)
            ->for($event)
            ->create(['status' => EventRegistrationStatus::Confirmed]);

        $waitlisted = EventRegistration::factory()
            ->for($event)
            ->create(['status' => EventRegistrationStatus::Waitlisted]);

        $userToCancel = User::find($confirmed->first()->user_id);

        $this->actingAs($userToCancel)
            ->delete(route('events.unregister', $event))
            ->assertRedirect();

        expect($confirmed->first()->fresh()->status)->toBe(EventRegistrationStatus::Cancelled);
        expect($waitlisted->fresh()->status)->toBe(EventRegistrationStatus::Confirmed);
    });
});
