from dotenv import load_dotenv
import os
import base64
from requests import post, get
import json 
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
load_dotenv()


client_id = os.getenv("CLIENT_ID")
client_secret = os.getenv("CLIENT_SECRET")
client_credentials_manager = SpotifyClientCredentials(client_id, client_secret)
sp = spotipy.Spotify(client_credentials_manager = client_credentials_manager)


def get_token():
    auth_string = client_id+ ":" + client_secret
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")

    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Authorization": "Basic "+ auth_base64, 
        "Content-Type": "application/x-www-form-urlencoded"
    }

    data = {"grant_type": "client_credentials"}
    result = post(url, headers = headers, data = data)
    json_result = json.loads(result.content)
    token = json_result["access_token"]
    return token

def get_auth_header(token):
    return {"Authorization": "Bearer " + token}


# def search_for_artist(token, artist_name):
#     url = "https://api.spotify.com/v1/search"
#     headers = get_auth_header(token)
#     query = f"q={artist_name}&type=artist&limit=1"

#     query_url = url+ "?" + query

#     result = get(query_url, headers = headers)
#     json_result = json.loads(result.content)["artists"]["items"]
#     if len(json_result)==0:
#         print("no artists wit hthis name exists..")
#         return None

#     return json_result[0]

# def get_songs_by_artist(token, artist_id):
#     url = f"https://api.spotify.com/v1/artists/{artist_id}/top-tracks?country=US"
#     headers = get_auth_header(token)
#     result = get(url, headers=headers)
#     json_result = json.loads(result.content)["tracks"]
#     return json_result



# def what_songs_in_playlist(playlist_link):
#     songs_playlist(playlist_link)
#     for track in tracks:
#     #Track name
#         track_name = track["track"]["name"]
#     #Popularity of the track
#         track_pop = track["track"]["popularity"]
        
    

# def how_pop_each_song(playlist_link):
#     songs_playlist(playlist_link)
#     for track in tracks:
    
#     #Track name
#         track_name = track["track"]["name"]
#         print(track_name)


#THIS WORKS HERE ------------------------------------
def songs_playlist(playlist_link):
    playlist_URI = playlist_link.split("/")[-1].split("?")[0]
    global tracks
    tracks = sp.playlist_tracks(playlist_URI)["items"]
    
        
def how_popular_is_playlist(playlist_link):
    songs_playlist(playlist_link)
    pop = 0; 
    for track in tracks:
        track_pop = track["track"]["popularity"]
        pop+= track_pop
    pop = pop/len(tracks)
    print("your playlist's popularity score:" + str(pop))

#ABOVE IS WHAT IM TRYING TO ACHEIVE IN JS  ----------------

# def how_pop_artists_playlist(playlist_link):
#     songs_playlist(playlist_link)
#     pop =0
#     for track in tracks:
#         artist_uri = track["track"]["artists"][0]["uri"]
#         artist_info = sp.artist(artist_uri)
#         artist_pop = artist_info["popularity"]
#         pop+= artist_pop
#     pop = pop/len(tracks)
#     print("your artists popularity score:" + str(pop))
    


token = get_token()
how_popular_is_playlist("https://open.spotify.com/playlist/37i9dQZEVXbLRQDuF5jeBp?si=3658c568988642dc")
# how_pop_artists_playlist("https://open.spotify.com/playlist/37i9dQZEVXbLRQDuF5jeBp?si=3658c568988642dc")
#print(songs)

#result = search_for_artist(token, "Kendrick Lamar")
#artist_id = result["id"]
#songs = get_songs_by_artist(token, artist_id)
#for idx, song in enumerate(songs):
   #print(f"{idx+1}. {song['name']}")