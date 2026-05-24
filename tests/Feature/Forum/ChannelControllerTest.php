<?php

declare(strict_types=1);

use App\Models\Channel;
use App\Models\Thread;
use Inertia\Testing\AssertableInertia as Assert;

describe('Forum index', function () {
    it('renders forum/index with channels and threads', function () {
        Channel::factory()->count(3)->create();
        Thread::factory()->count(2)->create();

        $this->get(route('forum.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('forum/index')
                ->has('channels')
                ->has('threads')
                ->has('filter')
            );
    });

    it('only shows active root channels', function () {
        $active = Channel::factory()->create(['is_active' => true]);
        Channel::factory()->inactive()->create();

        $parent = Channel::factory()->create();
        Channel::factory()->withParent($parent)->create();

        $this->get(route('forum.index'))
            ->assertInertia(fn (Assert $page) => $page
                ->component('forum/index')
                ->has('channels', 2)
            );
    });

    it('includes children on root channels', function () {
        $parent = Channel::factory()->create();
        Channel::factory()->withParent($parent)->create();

        $this->get(route('forum.index'))
            ->assertInertia(fn (Assert $page) => $page
                ->component('forum/index')
                ->has('channels.0.children', 1)
            );
    });
});

describe('Channel show', function () {
    it('renders forum/channel with channel and threads', function () {
        $channel = Channel::factory()->create();
        $thread = Thread::factory()->create();
        $thread->channels()->attach($channel);

        $this->get(route('forum.channels.show', $channel))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('forum/channel')
                ->has('channel')
                ->has('threads.data', 1)
            );
    });

    it('only shows threads belonging to the channel', function () {
        $channel = Channel::factory()->create();
        $other = Channel::factory()->create();

        $threadInChannel = Thread::factory()->create();
        $threadInChannel->channels()->attach($channel);

        $threadNotInChannel = Thread::factory()->create();
        $threadNotInChannel->channels()->attach($other);

        $this->get(route('forum.channels.show', $channel))
            ->assertInertia(fn (Assert $page) => $page
                ->has('threads.data', 1)
            );
    });
});
