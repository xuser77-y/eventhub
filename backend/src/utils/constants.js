export const ROLES = ['admin', 'staff'];

export const EVENT_STATUSES = ['draft', 'published', 'cancelled'];

export const EVENT_STATUS_TRANSITIONS = {
  draft: ['published', 'cancelled'],
  published: ['cancelled'],
  cancelled: []
};

export const REGISTRATION_STATUSES = ['pending', 'confirmed', 'cancelled'];

export const REGISTRATION_STATUS_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['cancelled'],
  cancelled: []
};
