import { Typography } from "@mui/material"

export const PageTitle = ({ title }) => {
  return (
    <div>
      <Typography component="h2" variant="div">
        {title}
      </Typography>
      <Box sx={{ width: "100%", height: 2, bgcolor: 'black' }} />
    </div>
  )
}