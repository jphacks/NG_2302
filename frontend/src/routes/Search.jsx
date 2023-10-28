import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PageTitle } from "../components/PageTitle";

export const Search = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <PageTitle title={'Search Result'} />

      <Button variant="contained" onClick={() => navigate('/')}>ホーム</Button>
    </Box>
  );
}