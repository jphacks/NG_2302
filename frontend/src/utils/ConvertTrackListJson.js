export const convertTrackListJson = (data) => {
    return [
        {
            id: data.first_music_track_id,
            title: data.first_music_title,
            artist: data.first_music_artist_name,
            image_url: data.first_music_image_url
        },
        {
            id: data.second_music_track_id,
            title: data.second_music_title,
            artist: data.second_music_artist_name,
            image_url: data.second_music_image_url
        },
        {
            id: data.third_music_track_id,
            title: data.third_music_title,
            artist: data.third_music_artist_name,
            image_url: data.third_music_image_url
        },
        {
            id: data.fourth_music_track_id,
            title: data.fourth_music_title,
            artist: data.fourth_music_artist_name,
            image_url: data.fourth_music_image_url
        },
        {
            id: data.fifth_music_track_id,
            title: data.fifth_music_title,
            artist: data.fifth_music_artist_name,
            image_url: data.fifth_music_image_url
        }
    ];
}