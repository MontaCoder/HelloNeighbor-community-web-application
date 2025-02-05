import { createClient } from '@supabase/supabase-js';
import { RealtimeChannel } from '@supabase/realtime-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

describe('Realtime Messaging and Notifications', () => {
  let channel: RealtimeChannel;

  beforeAll(async () => {
    channel = supabase.channel('realtime-messages');
    await channel.subscribe();
  });

  afterAll(async () => {
    await channel.unsubscribe();
  });

  test('should receive a new message notification', (done) => {
    const message = {
      content: 'Hello, world!',
      sender_id: 'test-user-id',
      receiver_id: null,
      neighborhood_id: 'test-neighborhood-id'
    };

    channel.on('broadcast', { event: 'new-message' }, (payload) => {
      try {
        expect(payload).toMatchObject(message);
        done();
      } catch (error) {
        done(error);
      }
    });

    supabase
      .from('messages')
      .insert(message)
      .then(({ error }) => {
        if (error) {
          done(error);
        }
      });
  });

  test('should receive a new notification', (done) => {
    const notification = {
      title: 'New Event',
      message: 'A new event has been created.',
      type: 'event',
      urgency: 'low',
      created_by: 'test-user-id',
      neighborhood_id: 'test-neighborhood-id'
    };

    channel.on('broadcast', { event: 'new-notification' }, (payload) => {
      try {
        expect(payload).toMatchObject(notification);
        done();
      } catch (error) {
        done(error);
      }
    });

    supabase
      .from('notifications')
      .insert(notification)
      .then(({ error }) => {
        if (error) {
          done(error);
        }
      });
  });
});
