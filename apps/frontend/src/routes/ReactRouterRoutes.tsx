import { Route, Routes } from 'react-router-dom'
import { AuthenticationGuard } from '../app/components/AuthenticationGuard'
import Consumption from '../hairdresser/pages/Consumption'
import MyProfile from '../hairdresser/pages/MyProfile'
import PriceList from '../hairdresser/pages/PriceList'
import ShoppingList from '../hairdresser/pages/ShoppingList'
import Stock from '../hairdresser/pages/Stock'
import Team from '../hairdresser/pages/Team'
import VisitDetail from '../hairdresser/pages/VisitDetail'
import VisitsList from '../hairdresser/visits/components/VisitsList'
import { ROUTES } from './AppRoutes'
import { Dashboard } from '../hairdresser/pages/Dashboard'
import ClientProfile from '../hairdresser/pages/ClientProfile'
import Logs from '../hairdresser/pages/Logs'

const ReactRouterRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.profile.path} element={<AuthenticationGuard component={MyProfile} />} />
      <Route path={ROUTES.home.path} element={<AuthenticationGuard component={Dashboard} />} />
      {/* <Route path={ROUTES.clients.path} element={<AuthenticationGuard component={ClientsList} />} /> */}
      {/* <Route path={ROUTES.sms.path} element={<AuthenticationGuard component={SmsPage} />} /> */}
      <Route path={ROUTES.shoppingList.path} element={<AuthenticationGuard component={ShoppingList} />} />
      <Route path={ROUTES.consumption.path} element={<AuthenticationGuard component={Consumption} />} />
      <Route path={ROUTES.services.path} element={<AuthenticationGuard component={PriceList} />} />
      <Route path={ROUTES.logs.path} element={<AuthenticationGuard component={Logs} />} />
      <Route
        path={ROUTES.visits.path}
        element={<AuthenticationGuard component={() => <VisitsList visitListApplyFilter="allVisitsPage" />} />}
      />
      <Route path={ROUTES.visitDetail.path} element={<AuthenticationGuard component={VisitDetail} />} />
      <Route path={ROUTES.team.path} element={<AuthenticationGuard component={Team} />} />
      <Route path={ROUTES.clientDetail.path} element={<AuthenticationGuard component={ClientProfile} />} />
      <Route path={ROUTES.stock.path} element={<AuthenticationGuard component={Stock} />} />
    </Routes>
  )
}

export default ReactRouterRoutes
