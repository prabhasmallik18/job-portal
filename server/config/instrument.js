import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

// To initialize the SDK before everything else, create an external file called instrument.js
Sentry.init({
  // Use the DSN from your Sentry project dashboard as shown in the video
  dsn: "https://7684e5a0eb9b67d146635eec1c55299f@o4508408152653824.ingest.us.sentry.io/4508408155406336",
  integrations: [
    nodeProfilingIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions
  // Set sampling rate for profiling - this is required for the profiling integration
  profilesSampleRate: 1.0,
});

// The following lines are used in the video to test the profiler and transaction tracking
Sentry.profiler.startProfiler();

// Starts a transaction that will also be profiled
Sentry.startSpan({
  name: "My First Transaction",
}, () => {
  // the code executing inside the transaction will be wrapped in a span and profiled
});

// Stops the profiler manually
Sentry.profiler.stopProfiler();