import { SetMetadata } from '@nestjs/common';

export const TURNSTILE_METADATA_KEY = 'turnstile';

export const Turnstile = () => SetMetadata(TURNSTILE_METADATA_KEY, true);
