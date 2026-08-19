# Skeleton Shop UI

A modern, responsive React e-commerce UI built with Vite, React Router, and Tailwind CSS. Fully integrated with the skeleton-shop-api backend.

## Features

- ✅ **Responsive Design** - Mobile-first design that works seamlessly on phones, tablets, and desktops
- ✅ **Modern Tech Stack** - React 18, Vite, Tailwind CSS, React Router
- ✅ **API Integration** - Axios-based API client for seamless backend integration
- ✅ **Product Catalog** - Browse and filter products by category
- ✅ **Product Details** - Detailed product pages with images, descriptions, and specifications
- ✅ **Responsive Navigation** - Hamburger menu for mobile, full navigation for desktop
- ✅ **Professional UI** - Modern design with consistent branding throughout

## Project Structure

```
skeleton-shop-ui/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── Layout.jsx
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── ProductCard.jsx
│   ├── pages/              # Page components
│   │   ├── Home.jsx
│   │   └── ProductDetail.jsx
│   ├── services/           # API services
│   │   └── api.js
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── package.json            # Dependencies
├── .env.example            # Environment variables template
└── README.md               # This file
```

## Prerequisites

- Node.js 16+ and npm/yarn/pnpm
- Backend API running (skeleton-shop-api)

## Installation

1. **Clone the repository** (if not already done):
```bash
cd skeleton-shop-ui
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create environment file**:
```bash
cp .env.example .env
```

4. **Configure API endpoint** in `.env`:
```
VITE_API_URL=http://localhost:8000
```

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Hot Module Replacement (HMR)
Changes to your code will automatically refresh in the browser.

## Building for Production

Create a production-ready build:

```bash
npm run build
```

The built files will be in the `dist/` directory.

Preview the production build locally:

```bash
npm run preview
```

## API Integration

The app communicates with the skeleton-shop-api backend through the `apiService` in `src/services/api.js`.

### Available API Methods:

**Products:**
- `getProducts()` - Fetch all products
- `getProductById(id)` - Fetch specific product
- `createProduct(data)` - Create new product (admin)
- `updateProduct(id, data)` - Update product (admin)
- `deleteProduct(id)` - Delete product (admin)

**Categories:**
- `getCategories()` - Fetch all categories
- `getCategoryById(id)` - Fetch specific category

**Orders:**
- `getOrders()` - Fetch all orders
- `createOrder(data)` - Create new order

## Responsive Breakpoints

The design uses Tailwind CSS breakpoints:

- **xs**: 320px - Small phones
- **sm**: 640px - Large phones & small tablets
- **md**: 768px - Tablets
- **lg**: 1024px - Small laptops
- **xl**: 1280px - Desktops
- **2xl**: 1536px - Large monitors

## Component Overview

### Layout
- **Header**: Responsive navigation with mobile hamburger menu
- **Footer**: Multi-column footer with links and contact info
- **Layout**: Main wrapper that manages header, content, and footer

### Pages
- **Home**: Products listing with category filters and featured section
- **ProductDetail**: Individual product page with full details

### Services
- **api.js**: Centralized API client with methods for all backend endpoints

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Tips

- Images are lazy-loaded by default
- CSS is purged in production (Tailwind)
- Code splitting is automatic with Vite

## Common Tasks

### Adding a New Page

1. Create a new component in `src/pages/`
2. Import and add the route in `App.jsx`
3. Add navigation link in `Header.jsx`

### Adding a New Component

1. Create the component in `src/components/`
2. Import and use where needed

### Styling

The project uses Tailwind CSS. Add classes directly to elements:
```jsx
<div className="bg-blue-600 text-white p-4 rounded-lg">
  Styled content
</div>
```

## Troubleshooting

**API requests failing?**
- Check that skeleton-shop-api is running on `http://localhost:8000`
- Verify `VITE_API_URL` in `.env` matches your backend URL
- Check browser console for CORS errors

**Styles not loading?**
- Make sure Tailwind CSS is properly configured
- Run `npm install` again to ensure all dependencies are installed

**Build fails?**
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear the dist directory: `rm -rf dist`

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly across different screen sizes
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include browser console errors if applicable

## Future Enhancements

- [ ] Shopping cart functionality
- [ ] User authentication
- [ ] Order management
- [ ] Product reviews and ratings
- [ ] Wishlist feature
- [ ] Advanced search and filters
- [ ] Payment integration
- [ ] Admin dashboard
