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
import { AppRoutes } from './AppRoutes'
import { Dashboard } from '../pages/Dashboard'
import ClientProfile from '../pages/ClientProfile'
import ClientsList from '../pages/ClientList'

const ReactRouterRoutes = () => {
  return (
    <Routes>
      <Route path={AppRoutes.MyProfile} element={<AuthenticationGuard component={MyProfile} />} />
      <Route path={AppRoutes.Dashboard} element={<AuthenticationGuard component={Dashboard} />} />
      <Route path={AppRoutes.ClientList} element={<AuthenticationGuard component={ClientsList} />} />
      <Route path={AppRoutes.Sms} element={<AuthenticationGuard component={SmsPage} />} />
      <Route path={AppRoutes.ShoppingList} element={<AuthenticationGuard component={ShoppingList} />} />
      <Route path={AppRoutes.Consumption} element={<AuthenticationGuard component={Consumption} />} />
      <Route path={AppRoutes.PriceList} element={<AuthenticationGuard component={PriceList} />} />
      <Route path={AppRoutes.Logs} element={<AuthenticationGuard component={Logs} />} />
      <Route path={AppRoutes.VisitsList} element={<AuthenticationGuard component={VisitsList} />} />
      <Route path={AppRoutes.VisitDetail} element={<AuthenticationGuard component={VisitDetail} />} />
      <Route path={AppRoutes.Team} element={<AuthenticationGuard component={Team} />} />
      <Route path={AppRoutes.ClientProfile} element={<AuthenticationGuard component={ClientProfile} />} />
      <Route path={AppRoutes.stock} element={<AuthenticationGuard component={Stock} />} />
    </Routes>
  )
}

export default ReactRouterRoutes
