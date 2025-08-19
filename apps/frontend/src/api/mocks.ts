import dayjs from 'dayjs'
import { UnitsObject, type StockItem } from '../entities/stock-item'
import type { UserLog, UserType } from './entity'

export const mockUserLogs: UserLog[] = [
  {
    id: '1',
    userName: 'Standa Novák',
    description: 'Nový klient: Jana Malá',
    actionType: 'přidání klienta',
    dateTime: dayjs(new Date()),
  },
  {
    id: '2',
    userName: 'Standa Novák',
    description: 'Barvení + střih: Eva Novotná',
    actionType: 'návštěva klienta',
    dateTime: dayjs(new Date()),
  },
  {
    id: '3',
    userName: 'Standa Novák',
    description: 'Nákup: Blondor 1L, Peroxid 9%',
    actionType: 'nákup položky',
    dateTime: dayjs(new Date()),
  },
  {
    id: '4',
    userName: 'Standa Novák',
    description: 'Sklad doplněn: Šampon Silver 500ml',
    actionType: 'přidání skladové položky',
    dateTime: dayjs(new Date()),
  },
  {
    id: '5',
    userName: 'Standa Novák',
    description: 'Nový klient: Tomáš Kučera',
    actionType: 'přidání klienta',
    dateTime: dayjs(new Date()),
  },
  {
    id: '6',
    userName: 'Standa Novák',
    description: 'Barvení + foukaná: Karolína Černá',
    actionType: 'návštěva klienta',
    dateTime: dayjs(new Date()),
  },
  {
    id: '7',
    userName: 'Standa Novák',
    description: 'Sklad doplněn: Maska na vlasy Repair 250ml',
    actionType: 'přidání skladové položky',
    dateTime: dayjs(new Date()),
  },
  {
    id: '8',
    userName: 'Standa Novák',
    description: 'Export přehledu návštěv za duben',
    actionType: 'export dat',
    dateTime: dayjs(new Date()),
  },
  {
    id: '9',
    userName: 'Standa Novák',
    description: 'Úprava údajů klienta: Jana Malá',
    actionType: 'úprava klienta',
    dateTime: dayjs(new Date()),
  },
  {
    id: '10',
    userName: 'Standa Novák',
    description: 'Odstranění položky: Peroxid 12%',
    actionType: 'smazání skladové položky',
    dateTime: dayjs(new Date()),
  },
]

export const mockUser: UserType = {
  userId: '1',
  name: 'Marie Vrnková',
  age: 45,
  email: 'marie@email.cz',
}

export const mockWarehouseState: Pick<
  StockItem,
  'id' | 'totalPrice' | 'quantity' | 'itemName' | 'unit' | 'threshold'
>[] = [
  { id: '1', itemName: 'Blondor ztmavovač', totalPrice: 1290, quantity: 1000, threshold: 300, unit: UnitsObject.CM },
  { id: '2', itemName: 'Wella Koleston 6/0', totalPrice: 180, quantity: 120, threshold: 50, unit: UnitsObject.CM },
  { id: '3', itemName: 'Londa Peroxid 6%', totalPrice: 150, quantity: 800, threshold: 200, unit: UnitsObject.CM },
  { id: '4', itemName: 'Goldwell Topchic 9N', totalPrice: 200, quantity: 90, threshold: 40, unit: UnitsObject.CM },
  { id: '5', itemName: 'Wella Fixace', totalPrice: 220, quantity: 500, threshold: 150, unit: UnitsObject.CM },
  { id: '6', itemName: 'Olaplex No.3', totalPrice: 890, quantity: 300, threshold: 100, unit: UnitsObject.CM },
  {
    id: '7',
    itemName: 'Londa Šampon na barvené vlasy',
    totalPrice: 250,
    quantity: 1000,
    threshold: 400,
    unit: UnitsObject.CM,
  },
  { id: '8', itemName: 'Londa Kondicionér', totalPrice: 270, quantity: 850, threshold: 300, unit: UnitsObject.CM },
  { id: '9', itemName: 'L’Oréal Majirel 5.1', totalPrice: 190, quantity: 100, threshold: 30, unit: UnitsObject.CM },
  { id: '10', itemName: 'Schwarzkopf Igora 10-0', totalPrice: 185, quantity: 130, threshold: 40, unit: UnitsObject.CM },
  {
    id: '11',
    itemName: 'Alpecin Kofeinový šampon',
    totalPrice: 320,
    quantity: 700,
    threshold: 250,
    unit: UnitsObject.CM,
  },
  {
    id: '12',
    itemName: 'Kerastase Maska Nutritive',
    totalPrice: 950,
    quantity: 250,
    threshold: 100,
    unit: UnitsObject.CM,
  },
  { id: '13', itemName: 'Barva Londa 8/3', totalPrice: 170, quantity: 110, threshold: 40, unit: UnitsObject.CM },
  {
    id: '14',
    itemName: 'Wella EIMI Lak na vlasy',
    totalPrice: 390,
    quantity: 300,
    threshold: 100,
    unit: UnitsObject.G,
  },
  { id: '15', itemName: 'Londa Blondoran', totalPrice: 980, quantity: 950, threshold: 350, unit: UnitsObject.G },
  { id: '16', itemName: 'Wella Koleston 8/1', totalPrice: 185, quantity: 100, threshold: 50, unit: UnitsObject.G },
  { id: '17', itemName: 'Londa Vyživující olej', totalPrice: 310, quantity: 150, threshold: 60, unit: UnitsObject.G },
  {
    id: '18',
    itemName: 'Maska na vlasy Goldwell Rich Repair',
    totalPrice: 690,
    quantity: 500,
    threshold: 200,
    unit: UnitsObject.G,
  },
  { id: '19', itemName: 'Londa Fénovací sprej', totalPrice: 210, quantity: 400, threshold: 150, unit: UnitsObject.G },
  {
    id: '20',
    itemName: 'Schwarzkopf Blondme Premium zesvětlovač',
    totalPrice: 1450,
    quantity: 800,
    threshold: 300,
    unit: 'g',
  },
]
