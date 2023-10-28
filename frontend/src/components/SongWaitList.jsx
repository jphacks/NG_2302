import { Box, List, ListItemText, ListItemButton } from "@mui/material";
import { extract } from "../utils/extract";

export const SongWaitList = ({ images }) => {
  // リストに入っている曲を選択した時
  function handleListItemClick(event) {
  }

  return (
    <List component="nav" aria-label="next songs list">
      {images.map((image, index) => {
        if (index === 0) {
          return null;
        }
        return (
          <ListItemButton
            sx={{ display: 'flex', flexDirection: 'row' }}
            onClick={(event) => handleListItemClick(event)}
          >
            <Box sx={{ p: 2 }} >
              {index}
            </Box>
            <img
              src={"./images/" + image}
              alt="title"
              loading='lazy'
              style={{ paddingRight: '1em' }}
              height="40"
            />
            <ListItemText 
              primary={ extract.songTitle(image) } 
              secondary={ extract.artist(image) } />
          </ListItemButton>
        )
      })}
    </List>
  )
}