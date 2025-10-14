import { Paths, ROUTES, type AppRoutePath } from '../../routes/AppRoutes'
import LanguageIcon from '@mui/icons-material/Language'
import { type IntlShape } from 'react-intl'
import WarehouseIcon from '@mui/icons-material/Warehouse'
import LightbulbOutlineIcon from '@mui/icons-material/LightbulbOutline'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import ContentCutIcon from '@mui/icons-material/ContentCut'
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits'
import DashboardIcon from '@mui/icons-material/Dashboard'
import Face4Icon from '@mui/icons-material/Face4'
// import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined'
import PhotoCameraFrontOutlinedIcon from '@mui/icons-material/PhotoCameraFrontOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import { type ReactNode } from 'react'
import type { Location } from 'react-router-dom'
import SideMenuButton from './SideMenuButton'
import { Divider } from '@mui/material'

export const SideMenuList = (props: { items: MenuItem[]; onClose: () => void; location: Location }) => {
  const { items: menuItems, onClose, location } = props

  return (
    <>
      {menuItems.map((menuItem, index) => {
        return !menuItem.condition || menuItem.condition() ? (
          <>
            {[2, 10].includes(index) ? <Divider sx={{ border: '1px solid rgba(1,1,1,0.2)' }} /> : null}
            <SideMenuButton
              key={menuItem.key}
              isActive={location.pathname === menuItem.path}
              to={menuItem.path}
              title={menuItem.title}
              icon={menuItem.icon}
              onClick={() => {
                onClose()
                menuItem.onClick?.()
              }}
            />
          </>
        ) : null
      })}
    </>
  )
}

export type MenuItem = {
  key: string
  title: string
  path: AppRoutePath | undefined
  icon: ReactNode
  condition?: () => boolean
  onClick?: () => void
}

export const getMenuItems = (
  intl: IntlShape,
  teamMember?: { teamId: string },
  stocks?: { id: string }[],
  filters?: { language: string },
  toggleLanguage?: () => void,
  logout?: () => void
): MenuItem[] => [
  {
    key: 'profile',
    title: intl.formatMessage({ id: 'myProfile', defaultMessage: 'Můj profil' }),
    path: ROUTES.profile.path,
    icon: <Face4Icon />,
  },
  {
    key: 'team',
    title: intl.formatMessage({ id: 'team', defaultMessage: 'Tým' }),
    path: teamMember?.teamId ? Paths.team(teamMember.teamId) : '#',
    icon: <Face4Icon />,
    condition: () => !!teamMember,
  },
  {
    key: 'dashboard',
    title: intl.formatMessage({ id: 'dashboard', defaultMessage: 'Přehledy' }),
    path: ROUTES.home.path,
    icon: <DashboardIcon />,
  },
  // {
  //   key: 'clients',
  //   title: intl.formatMessage({ id: 'clients', defaultMessage: 'Klienti' }),
  //   path: ROUTES.clients.path,
  //   icon: <Face4Icon />,
  // },
  {
    key: 'visits',
    title: intl.formatMessage({ id: 'visitsList', defaultMessage: 'Návštěvy' }),
    path: ROUTES.visits.path,
    icon: <PhotoCameraFrontOutlinedIcon />,
  },
  // {
  //   key: 'sms',
  //   title: intl.formatMessage({ id: 'sms', defaultMessage: 'SMSky' }),
  //   path: ROUTES.sms.path,
  //   icon: <SmsOutlinedIcon />,
  // },
  {
    key: 'shoppingList',
    title: intl.formatMessage({ id: 'shoppingList', defaultMessage: 'Nákupní seznam' }),
    path: ROUTES.shoppingList.path,
    icon: <ProductionQuantityLimitsIcon />,
  },
  {
    key: 'consumption',
    title: intl.formatMessage({ id: 'consumption', defaultMessage: 'Spotřeba' }),
    path: teamMember?.teamId ? Paths.consumption(teamMember.teamId) : '#',
    icon: <ContentCutIcon />,
    condition: () => !!teamMember,
  },
  {
    key: 'services',
    title: intl.formatMessage({ id: 'pricing', defaultMessage: 'Ceník' }),
    path: ROUTES.services.path,
    icon: <LocalOfferIcon />,
  },
  {
    key: 'stock',
    title: intl.formatMessage({ id: 'stock', defaultMessage: 'Sklad' }),
    path: stocks?.[0]?.id ? Paths.stock(stocks[0].id) : '#',
    icon: <WarehouseIcon />,
    condition: () => !!stocks?.length,
  },
  {
    key: 'logs',
    title: intl.formatMessage({ id: 'logs', defaultMessage: 'Záznamy o aktivitě' }),
    path: ROUTES.logs.path,
    icon: <LightbulbOutlineIcon />,
  },
  {
    key: 'language',
    title: intl.formatMessage(
      { id: 'currentLanguage', defaultMessage: 'Language: {lang}' },
      { lang: filters?.language.toUpperCase() ?? 'CS' }
    ),
    path: undefined,
    icon: <LanguageIcon />,
    onClick: toggleLanguage,
  },
  {
    key: 'logout',
    path: undefined,
    title: intl.formatMessage({ id: 'logOut', defaultMessage: 'Odhlásit se' }),
    icon: <LogoutIcon />,
    onClick: logout,
  },
]
