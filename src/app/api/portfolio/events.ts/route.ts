// src/app/api/portfolio/events/route.ts
import { Kafka } from 'kafkajs';

export async function GET() {
  const kafka = new Kafka({
    brokers: [process.env.NEXT_PUBLIC_KAFKA_BROKER!],
  });
  const consumer = kafka.consumer({ groupId: 'web-sse' });
  await consumer.connect();
  await consumer.subscribe({ topic: 'portfolio-updates', fromBeginning: true });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // whenever Kafka emits, enqueue an SSE frame
      await consumer.run({
        eachMessage: async ({ message }) => {
          const value = message.value?.toString();
          if (value) {
            controller.enqueue(encoder.encode(`data: ${value}\n\n`));
          }
        },
      });
    },
    cancel() {
      // clean up if client disconnects
      consumer.disconnect();
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
