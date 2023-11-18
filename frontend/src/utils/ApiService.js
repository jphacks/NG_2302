import axios from "axios"
import { backendUrl } from "../config/backendUrl"
import { urlEncodedHeader, withAuthHeader } from "../config/Headers"
import { updatedQueue } from "./Firebase"

export const apiClient = axios.create({
    baseURL: backendUrl,
});

// アカウント認証
export const postAccount = async (id, password) => {
    const body = {
        login_id: id,
        login_password: password
    }
    await apiClient.post(
        `/auth/account`,
        body
    );
}

export const postToken = async (username, password) => {
    const body = {
        username: username,
        password: password
    }
    const response = await apiClient.post(
        `/auth/token`,
        body,
        urlEncodedHeader
    );
    return response.data;
}

// Spotify認証
export const postRegister = async (clientId, clientSecret, token) => {
    const body = {
        spotify_client_id: clientId,
        spotify_client_secret: clientSecret
    }
    await apiClient.post(
        `/spotify/register`,
        body,
        withAuthHeader(token)
    );
};

// キュー取得
export const getQueueInfo = async (token) => {
    const response = await apiClient.get(
        `/music/get_queue_info`,
        withAuthHeader(token)
    );
    return response.data;
};

// 検索
export const postSearchArtistName = async (artistName, token) => {
    const body = {
        artist_name: artistName
    }
    const response = await apiClient.post(
        `/music/search_music_by_artist_name`,
        body,
        withAuthHeader(token)
    );
    return response.data;
};

export const postSearchMusicTitle = async (title, token) => {
    const body = {
        music_title: title
    }
    const response = await apiClient.post(
        `/music/search_music_by_title`,
        body,
        withAuthHeader(token)
    );
    return response.data;
};

// キュー追加
export const postEnqueue = async (title, token, client_id) => {
    const body = {
        music_title: title
    }
    await apiClient.post(
        `/music/enqueue`,
        body,
        withAuthHeader(token)
    );
    await updatedQueue(client_id);
};

export const postEnqueueTrackId = async (trackId, token, client_id) => {
    const body = {
        track_id: trackId
    }
    await apiClient.post(
        `/music/enqueue_by_track_id`,
        body,
        withAuthHeader(token)
    );
    await updatedQueue(client_id);
}

export const postEnqueueBasedOnMood = async (conversation, token, client_id) => {
    const body = {
        conversation: conversation
    }
    await apiClient.post(
        `/music/enqueue_based_on_mood`,
        body,
        withAuthHeader(token)
    );
    updatedQueue(client_id);
};

// 音量調整
export const postAdjustVolume = async (volume, token) => {
    const body = {
        volume_percent: volume
    }
    await apiClient.post(
        `/music/adjust_volume`,
        body,
        withAuthHeader(token)
    );
}