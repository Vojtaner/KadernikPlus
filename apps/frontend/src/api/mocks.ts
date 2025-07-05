import type { UserLog, UserType, WareHouseItemStateType } from './entity'

export const mockUserLogs: UserLog[] = [
  {
    id: '1',
    userName: 'Standa Novák',
    description: 'Nový klient: Jana Malá',
    actionType: 'přidání klienta',
    dateTime: '12.5.2025 - 10:12',
  },
  {
    id: '2',
    userName: 'Standa Novák',
    description: 'Barvení + střih: Eva Novotná',
    actionType: 'návštěva klienta',
    dateTime: '12.5.2025 - 11:45',
  },
  {
    id: '3',
    userName: 'Standa Novák',
    description: 'Nákup: Blondor 1L, Peroxid 9%',
    actionType: 'nákup položky',
    dateTime: '12.5.2025 - 13:25',
  },
  {
    id: '4',
    userName: 'Standa Novák',
    description: 'Sklad doplněn: Šampon Silver 500ml',
    actionType: 'přidání skladové položky',
    dateTime: '12.5.2025 - 13:45',
  },
  {
    id: '5',
    userName: 'Standa Novák',
    description: 'Nový klient: Tomáš Kučera',
    actionType: 'přidání klienta',
    dateTime: '13.5.2025 - 09:02',
  },
  {
    id: '6',
    userName: 'Standa Novák',
    description: 'Barvení + foukaná: Karolína Černá',
    actionType: 'návštěva klienta',
    dateTime: '13.5.2025 - 12:33',
  },
  {
    id: '7',
    userName: 'Standa Novák',
    description: 'Sklad doplněn: Maska na vlasy Repair 250ml',
    actionType: 'přidání skladové položky',
    dateTime: '13.5.2025 - 13:00',
  },
  {
    id: '8',
    userName: 'Standa Novák',
    description: 'Export přehledu návštěv za duben',
    actionType: 'export dat',
    dateTime: '13.5.2025 - 13:30',
  },
  {
    id: '9',
    userName: 'Standa Novák',
    description: 'Úprava údajů klienta: Jana Malá',
    actionType: 'úprava klienta',
    dateTime: '14.5.2025 - 09:20',
  },
  {
    id: '10',
    userName: 'Standa Novák',
    description: 'Odstranění položky: Peroxid 12%',
    actionType: 'smazání skladové položky',
    dateTime: '14.5.2025 - 10:15',
  },
]

export const mockUser: UserType = {
  userId: '1',
  name: 'Marie Vrnková',
  age: 45,
  email: 'marie@email.cz',
}

export const mockWarehouseState: WareHouseItemStateType[] = [
  { id: 1, item: 'Blondor ztmavovač', price: 1290, amount: 1000, minAmount: 300, unit: 'g' },
  { id: 2, item: 'Wella Koleston 6/0', price: 180, amount: 120, minAmount: 50, unit: 'ml' },
  { id: 3, item: 'Londa Peroxid 6%', price: 150, amount: 800, minAmount: 200, unit: 'ml' },
  { id: 4, item: 'Goldwell Topchic 9N', price: 200, amount: 90, minAmount: 40, unit: 'ml' },
  { id: 5, item: 'Wella Fixace', price: 220, amount: 500, minAmount: 150, unit: 'ml' },
  { id: 6, item: 'Olaplex No.3', price: 890, amount: 300, minAmount: 100, unit: 'ml' },
  { id: 7, item: 'Londa Šampon na barvené vlasy', price: 250, amount: 1000, minAmount: 400, unit: 'ml' },
  { id: 8, item: 'Londa Kondicionér', price: 270, amount: 850, minAmount: 300, unit: 'ml' },
  { id: 9, item: 'L’Oréal Majirel 5.1', price: 190, amount: 100, minAmount: 30, unit: 'ml' },
  { id: 10, item: 'Schwarzkopf Igora 10-0', price: 185, amount: 130, minAmount: 40, unit: 'ml' },
  { id: 11, item: 'Alpecin Kofeinový šampon', price: 320, amount: 700, minAmount: 250, unit: 'ml' },
  { id: 12, item: 'Kerastase Maska Nutritive', price: 950, amount: 250, minAmount: 100, unit: 'ml' },
  { id: 13, item: 'Barva Londa 8/3', price: 170, amount: 110, minAmount: 40, unit: 'ml' },
  { id: 14, item: 'Wella EIMI Lak na vlasy', price: 390, amount: 300, minAmount: 100, unit: 'ml' },
  { id: 15, item: 'Londa Blondoran', price: 980, amount: 950, minAmount: 350, unit: 'g' },
  { id: 16, item: 'Wella Koleston 8/1', price: 185, amount: 100, minAmount: 50, unit: 'ml' },
  { id: 17, item: 'Londa Vyživující olej', price: 310, amount: 150, minAmount: 60, unit: 'ml' },
  { id: 18, item: 'Maska na vlasy Goldwell Rich Repair', price: 690, amount: 500, minAmount: 200, unit: 'ml' },
  { id: 19, item: 'Londa Fénovací sprej', price: 210, amount: 400, minAmount: 150, unit: 'ml' },
  { id: 20, item: 'Schwarzkopf Blondme Premium zesvětlovač', price: 1450, amount: 800, minAmount: 300, unit: 'g' },
]
