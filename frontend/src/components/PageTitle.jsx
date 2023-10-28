import { Typography, Box } from "@mui/material"
import { CustomDivider } from "./CustomDivider"

export const PageTitle = ({ title }) => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography component="h2" variant="div" >
        {title}
      </Typography>
      <CustomDivider />
    </Box>
  )
}