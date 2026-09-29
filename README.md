# BarberFlow

BarberFlow is a full-stack scheduling system for barbershops.

The application allows customers to select a service, barber and available time slot to schedule an appointment. It also includes a WhatsApp integration that allows customers to check availability, create appointments and cancel them through an automated assistant.

## Technologies

### Frontend
- React
- TypeScript
- Vite

### Backend
- Node.js
- Express
- TypeScript

### Database
- MongoDB

### Other
- Docker
- WhatsApp integration

## Features

- Service selection
- Barber selection
- Available time slots
- Appointment scheduling
- Appointment cancellation
- Appointment management
- WhatsApp scheduling integration

## Structure

The project is divided into a frontend and backend application.

The frontend communicates with the backend through a REST API. The backend handles the application's business logic and persists the data in MongoDB.

The WhatsApp integration uses the same backend and database, allowing appointments created through WhatsApp and the web application to remain synchronized.

## Running the project

Clone the repository:

```bash
git clone <repository-url>
