import { Route, Routes } from 'react-router-dom'
import { AuthenticationGuard } from '../components/AuthenticationGuard'
import Consumption from '../pages/Consumption'
import Logs from '../pages/Logs'
import MyProfile from '../pages/MyProfile'
import PriceList from '../pages/PriceList'
import ShoppingList from '../pages/ShoppingList'
import SmsPage from '../pages/SmsPage'
import Stock from '../pages/Stock'
import Team from '../pages/Team'
import VisitDetail from '../pages/VisitDetail'
import VisitsList from '../pages/VisitsList'
import { ROUTES } from './AppRoutes'
import { Dashboard } from '../pages/Dashboard'
import ClientProfile from '../pages/ClientProfile'
import ClientsList from '../pages/ClientList'

const ReactRouterRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.profile.path} element={<AuthenticationGuard component={MyProfile} />} />
      <Route path={ROUTES.home.path} element={<AuthenticationGuard component={Dashboard} />} />
      <Route path={ROUTES.clients.path} element={<AuthenticationGuard component={ClientsList} />} />
      <Route path={ROUTES.sms.path} element={<AuthenticationGuard component={SmsPage} />} />
      <Route path={ROUTES.shoppingList.path} element={<AuthenticationGuard component={ShoppingList} />} />
      <Route path={ROUTES.consumption.path} element={<AuthenticationGuard component={Consumption} />} />
      <Route path={ROUTES.services.path} element={<AuthenticationGuard component={PriceList} />} />
      <Route path={ROUTES.logs.path} element={<AuthenticationGuard component={Logs} />} />
      <Route path={ROUTES.visits.path} element={<AuthenticationGuard component={VisitsList} />} />
      <Route path={ROUTES.visitDetail.path} element={<AuthenticationGuard component={VisitDetail} />} />
      <Route path={ROUTES.team.path} element={<AuthenticationGuard component={Team} />} />
      <Route path={ROUTES.clientDetail.path} element={<AuthenticationGuard component={ClientProfile} />} />
      <Route path={ROUTES.stock.path} element={<AuthenticationGuard component={Stock} />} />
    </Routes>
  )
}

export default ReactRouterRoutes
