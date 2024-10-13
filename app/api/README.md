# API Structure

This directory contains the API routes for the application. The structure is organized as follows:

## /api

- `auth/`: Authentication-related routes
  - `[...nextauth]/`: NextAuth.js configuration and routes
- `collections/`: Collection management routes
  - `[collectionId]/`: Routes for specific collection operations
    - `items/`: Routes for managing items within a collection
    - `generate-link/`: Route for generating unique links for collections
  - `link/`: Routes for handling collection links
- `dashboard/`: Dashboard data retrieval route
- `lead/`: Lead management route
- `payments/`: Payment processing routes
- `products/`
  - `route.js`: Handle GET (list all products) and POST (create new product)
  - `[productId]/`
    - `route.js`: Handle GET, PUT, DELETE for specific product
- `stores/`
  - `route.js`: Handle GET (list all stores) and POST (create new store)
  - `[storeId]/`
    - `products/`
      - `route.js`: Handle GET (list store's products) and POST (create product for store)
- `stripe/`: Stripe integration routes
  - `create-checkout/`: Route for creating Stripe checkout sessions
  - `create-portal/`: Route for creating Stripe customer portals
- `subscriptions/`: Subscription management routes
- `uploadthing/`: File upload routes using UploadThing
- `user/`: User-related routes
  - `[userId]/`: Routes for specific user operations
    - `store/`: Routes for managing a user's store
- `webhook/`: Webhook handling routes
  - `mailgun/`: Mailgun webhook route
  - `stripe/`: Stripe webhook route

## Best Practices

1. Use meaningful and descriptive names for route files and folders.
2. Implement proper error handling and validation in each route.
3. Use middleware for authentication and authorization where necessary.
4. Keep route handlers focused and modular, delegating complex logic to separate service functions.
5. Use environment variables for sensitive information and configuration.
6. Implement rate limiting and other security measures as needed.
7. Document API endpoints, including expected request/response formats.
8. Use consistent response structures across all API routes.
9. Implement proper logging for debugging and monitoring.
10. Consider versioning the API if major changes are expected in the future.

## Notes

- The `[...]` notation in folder names indicates dynamic routes in Next.js.
- Ensure that all routes are properly secured and only accessible to authorized users where necessary.
- Regularly review and update the API structure as the application evolves.
