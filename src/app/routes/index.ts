import { Router } from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { authRoute } from '../modules/auth/auth.route';
import { listingRoutes } from '../modules/listing/listing.routes';
import { bookingsRoutes } from '../modules/booking/booking.router';


const router = Router();

const moduleRoutes = [
    
    {
        path: '/user',
        route: userRoutes
    },
    {
        path:'/auth',
        route: authRoute
    },
    {
        path:'/listing',
        route: listingRoutes
    },
    {
        path:'/booking',
        route: bookingsRoutes
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;