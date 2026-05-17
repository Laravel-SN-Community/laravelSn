<?php

declare(strict_types=1);

namespace App\Actions\Events;

use App\Enums\PublicationStatus;
use App\Models\Event;

final readonly class UpdateEvent
{
    public function __invoke(Event $event, array $data): Event
    {
        $event->update([
            'title' => $data['title'],
            'format' => $data['format'],
            'description' => $data['description'],
            'starts_at' => $data['starts_at'],
            'ends_at' => $data['ends_at'] ?? null,
            'registration_opens_at' => $data['registration_opens_at'] ?? null,
            'registration_closes_at' => $data['registration_closes_at'] ?? null,
            'is_online' => $data['is_online'] ?? false,
            'venue_id' => ($data['is_online'] ?? false) ? null : ($data['venue_id'] ?? null),
            'online_url' => $data['online_url'] ?? null,
            'capacity' => $data['capacity'] ?? null,
            'waitlist_capacity' => $data['waitlist_capacity'] ?? 0,
            'agenda' => isset($data['agenda']) && count($data['agenda']) > 0 ? $data['agenda'] : null,
            'is_featured' => $data['is_featured'] ?? false,
            'is_sponsored' => $data['is_sponsored'] ?? false,
            'replay_url' => $data['replay_url'] ?? null,
            'status' => ($data['publish'] ?? false) ? PublicationStatus::Published : $event->status,
        ]);

        return $event->refresh();
    }
}
