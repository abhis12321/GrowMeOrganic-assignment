# PrimeReact Artworks Table

A single-page React application built with **Vite** and **TypeScript** that displays a paginated list of artworks from the [Art Institute of Chicago API](https://api.artic.edu/docs/). It features **server-side pagination**, **persistent row selection**, and a custom **bulk selection overlay** form.

## ✨ Features

- **Server-Side Pagination**  
  Fetches artworks one page at a time directly from the API, improving performance and minimizing memory usage.

- **Custom Row Selection**  
  Users can select individual rows using checkboxes.

- **Persistent Selection**  
  Row selections are maintained even while navigating between different pages.

- **Bulk Selection Overlay**  
  A dropdown in the header opens an overlay form, allowing users to specify how many artworks to select. The app fetches and selects artworks across multiple pages accordingly.

## 🛠️ Technologies

- **React** – JavaScript library for building user interfaces  
- **Vite** – Lightning-fast build tool for frontend development  
- **TypeScript** – Adds static typing for improved development experience  
- **PrimeReact** – UI components including `DataTable`, `OverlayPanel`, and `InputNumber`  
- **Tailwind CSS** – Utility-first CSS framework for fast and consistent styling  

## 🚀 Deployment

The application is deployed on Vercel and can be accessed here:  
👉 [https://grow-me-organic-ten.vercel.app/](https://grow-me-organic-ten.vercel.app/) 

## 📦 Setup and Installation

Follow these steps to run the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/abhis12321/GrowMeOrganic-assignment
cd GrowMeOrganic-assignment
