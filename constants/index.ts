export const APP_NAME = 'Gym'

interface RouteProps {
  name: string
  path: string
}

export const ROUTES: RouteProps[] = [
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'About Us',
    path: '/about-us',
  },
  {
    name: 'Classes',
    path: '/classes',
  },
  {
    name: 'Contact',
    path: '/contact',
  },
  {
    name: 'Pricing',
    path: '/pricing',
  },
  {
    name: 'Blog',
    path: '/blog',
  }
]
