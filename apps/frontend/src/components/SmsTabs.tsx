import { Box, Tab } from '@mui/material'
import SmsCard from './SmsCard'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import { TabPanel } from '@mui/lab'
import { useState } from 'react'

const SmsTabs = () => {
  const [value, setValue] = useState('1')

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Upozornění" value="1" />
            <Tab label="Zálohy" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ paddingY: '10px', paddingX: 0 }}>
          <SmsCard
            text="Další návštěva je za tři dny. Doražte. Případně se omluvte."
            customerName="Jitka Straková"
            haircut="Baleage"
          />
        </TabPanel>
        <TabPanel value="2" sx={{ padding: 0 }}>
          <SmsCard
            text="Dobrý den, stále od Vás nemám zaplacenou zálohu. Prosím o zaslání na 2324525255/2030. Jinak Vám termín zítra propadne."
            customerName="Maria Jelínek"
            haircut="Stříhání na sucho"
          />
        </TabPanel>
      </TabContext>
    </Box>
  )
}

export default SmsTabs
