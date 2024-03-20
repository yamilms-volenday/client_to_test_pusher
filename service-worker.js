importScripts("https://js.pusher.com/beams/service-worker.js");

self.addEventListener("push", function (event) {
  // Parse the incoming push event data, or set defaults if none exists
  const payload = event.data
    ? JSON.parse(event.data.text())
    : {
        title: "Default Title",
        body: "No content",
      };
  console.log("payload", payload.notification);
  // Define the options for displaying the notification
  const options = {
    body: payload.body,
    // Include any additional notification options here
    // e.g., icons, images, actions for interaction, etc.
  };

  // Display the notification to the user
  event.waitUntil(self.registration.showNotification(payload.title, options));

  // After displaying the notification, send the notification data to all
  // client pages that are listening to the service worker messages.
  // This allows your web app to be aware of the notification and handle it accordingly.
  event.waitUntil(
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        // Send a message to the client with the notification data
        // Ensure the structure here matches what your clients expect
        client.postMessage({
          msg: "Received a push message.",
          data: {
            title: payload.notification.title,
            body: payload.notification.body,
            // Include any other relevant data you want to send to the client
          },
        });
      });
    })
  );
});

// Listen for click events on the notifications
self.addEventListener("notificationclick", function (event) {
  const clickedNotification = event.notification;
  clickedNotification.close(); // Close the notification

  // Handle the notification click by opening a URL
  const promiseChain = clients.openWindow(clickedNotification.data.url);
  event.waitUntil(promiseChain);
});
