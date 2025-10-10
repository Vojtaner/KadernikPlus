import { Button, IconButton } from '@mui/material'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import AppTheme from '../AppTheme'
import CloseIcon from '@mui/icons-material/Close'

const FullScreenImage = (props: { src: string }) => {
  const [showImage, setShowImage] = useState(false)

  return (
    <>
      <Button onClick={() => setShowImage(true)} sx={{ bgcolor: AppTheme.palette.info.main }} variant="contained">
        <FormattedMessage id="formDialog.tutorial" defaultMessage="Návod" />
      </Button>
      {showImage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1300,
          }}>
          <IconButton
            onClick={() => setShowImage(false)}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: 'white',
            }}>
            <CloseIcon />
          </IconButton>
          <img
            src={props.src}
            alt="fullscreen"
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
            }}
          />
        </div>
      )}
    </>
  )
}

export default FullScreenImage
