import { Typography } from "@mui/material"
import { PageTitle } from "../components/PageTitle"

export const SearchArtist = ({ artistList }) => {

    const artistCard = (artist) => {
        return (
            <Card sx={{ mt: 1, mb: 1, width: "80%", display: 'flex' }}>
                <CardActionArea
                    sx={{ display: 'flex' }}
                    onClick={() => {
                        // 特定のアーティストの楽曲一覧ページへ遷移
                    }}
                >
                    <CardMedia
                        component="img"
                        sx={{ width: 140 }}
                        image={artist.image_url}
                        alt="track image"
                    />
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', width: "100%" }}>
                        <Typography component="div" color="text.secondary" variant="h3">
                            {artist.name}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        )
    }

    return (
        <>
            <PageTitle title={'アーティスト検索'} />

            <Typography variant="h6" component='div' >
                検索結果
            </Typography>

            {artistList.map((artist) => { artistCard(artist) })}
        </>
    )
}