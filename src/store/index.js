import { configureStore } from '@reduxjs/toolkit'
import ethereum from './ethereum/ethereumSlice'

export default configureStore({
  reducer: {
    ethereum,
  },
})
