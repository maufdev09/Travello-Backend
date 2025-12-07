import { Router } from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { authRoute } from '../modules/auth/auth.route';


const router = Router();

const moduleRoutes = [
    
    {
        path: '/user',
        route: userRoutes
    },
    {
        path:'/auth',
        route: authRoute
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;