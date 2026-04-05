# Restaurant Order Tracker

Restaurant Order Tracker is a greenfield web application for logging restaurants, visits, ordered foods, spend, and reviews.

## Solution structure

- `frontend` contains the Angular 21 application.
- `backend` contains the .NET 8 solution.
- `backend/src/RestaurantOrderTracker.API` is the HTTP entry point.
- `backend/src/RestaurantOrderTracker.Application` holds use cases, abstractions, and validation.
- `backend/src/RestaurantOrderTracker.Domain` holds the core domain model.
- `backend/src/RestaurantOrderTracker.Infrastructure` holds persistence and external integrations.
- `backend/tests` contains unit and integration test projects.

## Phase 1 baseline

This repository currently includes:

- Angular 21 frontend scaffold with a minimal application shell.
- .NET 8 backend scaffold with clean-architecture project boundaries.
- Root-level repo configuration for consistent local development.

## Run locally

### Frontend

```powershell
Set-Location e:\RestaurantOrderTracker\frontend
npm install
npm start
```

### Backend

```powershell
Set-Location e:\RestaurantOrderTracker\backend
dotnet run --project .\src\RestaurantOrderTracker.API
```

## Next phases

The next implementation phases should add authentication, domain entities, persistence, and feature-based Angular UI modules without violating the current layer boundaries.
