import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PageTitle } from "../components/PageTitle";

// 現在は使っていないが残す
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

      <Button variant="contained" color="tertiary" onClick={() => navigate('/home')}>
        ホーム
      </Button>
    </Box>
  );
}